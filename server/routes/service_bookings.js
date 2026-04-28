import express from 'express';
import createController from '../controllers/universalController.js';
import { optionalAuth } from '../middleware/auth.js';
import { validateIdParam } from '../middleware/validate.js';
import db from '../db/knex.js';
import { getSlotsWithAvailabilityForService, isAllowedSlot } from '../slots.js';

const bookingsController = createController('service_bookings', {
  client: {
    read: false,
    readOwn: true,
    create: true,
    updateOwn: true,
    deleteOwn: false,
    update: false,
    delete: false,
  },
  groomer: { read: true, create: true, update: true, delete: false },
}, { ownerField: 'user_id' });

const router = express.Router({ mergeParams: true });
router.use(optionalAuth);

/** GET /api/service_bookings/slots?date=YYYY-MM-DD&master_id=1&service_id=1 — доступные слоты с учётом длительности услуги (блокируются слоты на всё время услуги) */
router.get('/slots', async (req, res) => {
  try {
    const { date, master_id, service_id } = req.query;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ success: false, error: 'Укажите дату в формате YYYY-MM-DD' });
    }
    let durationMinutes = 60;
    if (service_id) {
      const service = await db('services').where('id', service_id).select('duration_minutes', 'duration_slots').first();
      if (service) {
        if (service.duration_slots != null) durationMinutes = Math.max(30, Number(service.duration_slots) * 30);
        else if (service.duration_minutes != null) durationMinutes = service.duration_minutes;
      }
    }

    const startOfDay = new Date(date + 'T00:00:00.000Z');
    const endOfDay = new Date(date + 'T23:59:59.999Z');
    let query = db('service_bookings')
      .join('services', 'service_bookings.service_id', 'services.id')
      .whereBetween('service_bookings.scheduled_at', [startOfDay, endOfDay])
      .whereNotIn('service_bookings.status', ['cancelled'])
      .select('service_bookings.scheduled_at', 'services.duration_minutes', 'services.duration_slots');
    if (master_id) query = query.where('service_bookings.master_id', master_id);
    const booked = await query;

    const blockedRanges = booked.map((r) => {
      const start = new Date(r.scheduled_at);
      const dur =
        r.duration_slots != null
          ? Math.max(30, Number(r.duration_slots) * 30)
          : (r.duration_minutes != null ? Math.max(30, r.duration_minutes) : 60);
      const end = new Date(start.getTime() + dur * 60 * 1000);
      return { start, end };
    });

    const slots = getSlotsWithAvailabilityForService(date, durationMinutes, blockedRanges);
    return res.json({ success: true, data: slots });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/** Проверка, что scheduled_at попадает в разрешённый слот (окна по 30 мин 9:00–18:00) */
function validateSlot(req, res, next) {
  const scheduledAt = req.body?.scheduled_at;
  if (!scheduledAt) return next();
  const d = new Date(scheduledAt);
  const dateStr = d.toISOString().slice(0, 10);
  if (!isAllowedSlot(dateStr, d.toISOString())) {
    return res.status(400).json({
      success: false,
      error: 'Выберите время из доступных слотов (каждые 30 мин с 10:00 до 21:30)',
    });
  }
  next();
}

/** Проверка доступности слота с учетом длительности услуги (не даём забронировать пересекающийся интервал) */
async function validateAvailability(req, res, next) {
  try {
    const scheduledAt = req.body?.scheduled_at;
    const serviceId = req.body?.service_id;
    if (!scheduledAt || !serviceId) return next();

    const start = new Date(scheduledAt);
    if (Number.isNaN(start.getTime())) return next();

    const service = await db('services').where('id', serviceId).select('name', 'duration_minutes', 'duration_slots').first();
    const durMin =
      service?.duration_slots != null
        ? Math.max(30, Number(service.duration_slots) * 30)
        : (service?.duration_minutes != null ? Math.max(30, service.duration_minutes) : 60);
    const end = new Date(start.getTime() + durMin * 60 * 1000);

    const dateStr = start.toISOString().slice(0, 10);
    const startOfDay = new Date(dateStr + 'T00:00:00.000Z');
    const endOfDay = new Date(dateStr + 'T23:59:59.999Z');

    let query = db('service_bookings')
      .join('services', 'service_bookings.service_id', 'services.id')
      .whereBetween('service_bookings.scheduled_at', [startOfDay, endOfDay])
      .whereNotIn('service_bookings.status', ['cancelled'])
      .select('service_bookings.id', 'service_bookings.scheduled_at', 'services.duration_minutes', 'services.duration_slots');

    if (req.body?.master_id) query = query.where('service_bookings.master_id', req.body.master_id);
    if (req.params?.id) query = query.whereNot('service_bookings.id', req.params.id);

    const booked = await query;
    const overlaps = booked.some((r) => {
      const bStart = new Date(r.scheduled_at);
      const bDur =
        r.duration_slots != null
          ? Math.max(30, Number(r.duration_slots) * 30)
          : (r.duration_minutes != null ? Math.max(30, r.duration_minutes) : 60);
      const bEnd = new Date(bStart.getTime() + bDur * 60 * 1000);
      return start.getTime() < bEnd.getTime() && end.getTime() > bStart.getTime();
    });

    if (overlaps) {
      return res.status(409).json({ success: false, error: 'Это время уже занято. Выберите другое доступное время.' });
    }
    return next();
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function assignRandomMaster(req, res, next) {
  try {
    if (req.body?.master_id || !req.body?.service_id) return next();
    const links = await db('master_services').where({ service_id: req.body.service_id }).select('master_id');
    if (!links.length) return next();
    const idx = Math.floor(Math.random() * links.length);
    req.body.master_id = links[idx].master_id;
    return next();
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

router.get('/', bookingsController.getAll);
router.get('/search', bookingsController.search);
router.get('/:id', validateIdParam, bookingsController.getById);
<<<<<<< Updated upstream
router.post('/', assignRandomMaster, validateSlot, validateAvailability, bookingsController.create);
router.put('/:id', validateIdParam, validateSlot, validateAvailability, bookingsController.update);
=======

router.post('/', validateSlot, async (req, res) => {
  try {
    const actor = req.user || { id: null, role: 'guest' };
    if (actor.role !== 'client' || !actor.id) {
      return res.status(403).json({ success: false, error: 'Только авторизованный клиент может создать запись' });
    }
    const {
      service_id,
      master_id = null,
      pet_id = null,
      scheduled_at,
      status = 'ожидает оплату',
      contact_method = null,
      notes = null,
      points_to_spend = 0,
    } = req.body || {};

    if (!service_id || !scheduled_at) {
      return res.status(400).json({ success: false, error: 'Не указаны service_id или scheduled_at' });
    }

    const result = await db.transaction(async (trx) => {
      const spend = Math.max(0, Number(points_to_spend) || 0);
      if (spend > 0) {
        const acc = await trx('loyalty_accounts').where({ user_id: actor.id }).first().forUpdate();
        const current = Number(acc?.points ?? 0);
        if (current < spend) throw new Error('Недостаточно лапок для списания');
        if (acc) {
          await trx('loyalty_accounts')
            .where({ user_id: actor.id })
            .update({ points: current - spend, updated_at: db.raw('now()') });
        }
      }

      const inserted = await trx('service_bookings')
        .insert({
          user_id: actor.id,
          service_id,
          master_id,
          pet_id,
          scheduled_at,
          status,
          contact_method,
          notes,
          created_by: actor.id,
        })
        .returning('*');
      const row = Array.isArray(inserted) ? inserted[0] : inserted;
      return row;
    });

    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:id', validateIdParam, validateSlot, bookingsController.update);
>>>>>>> Stashed changes
router.delete('/:id', validateIdParam, bookingsController.delete);

export default router;
