import express from 'express';
import createController from '../controllers/universalController.js';
import { optionalAuth } from '../middleware/auth.js';
import { validateIdParam } from '../middleware/validate.js';
import db from '../db/knex.js';
import { getAvailableSlotsForService, isAllowedSlot } from '../slots.js';

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
      const service = await db('services').where('id', service_id).select('duration_minutes').first();
      if (service && service.duration_minutes != null) durationMinutes = service.duration_minutes;
    }

    const startOfDay = new Date(date + 'T00:00:00.000Z');
    const endOfDay = new Date(date + 'T23:59:59.999Z');
    let query = db('service_bookings')
      .join('services', 'service_bookings.service_id', 'services.id')
      .whereBetween('service_bookings.scheduled_at', [startOfDay, endOfDay])
      .whereNotIn('service_bookings.status', ['cancelled'])
      .select('service_bookings.scheduled_at', 'services.duration_minutes');
    if (master_id) query = query.where('service_bookings.master_id', master_id);
    const booked = await query;

    const blockedRanges = booked.map((r) => {
      const start = new Date(r.scheduled_at);
      const dur = r.duration_minutes != null ? Math.max(30, r.duration_minutes) : 60;
      const end = new Date(start.getTime() + dur * 60 * 1000);
      return { start, end };
    });

    const available = getAvailableSlotsForService(date, durationMinutes, blockedRanges);
    return res.json({ success: true, data: available });
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
      error: 'Выберите время из доступных слотов (каждые 30 мин с 09:00 до 18:00)',
    });
  }
  next();
}

router.get('/', bookingsController.getAll);
router.get('/search', bookingsController.search);
router.get('/:id', validateIdParam, bookingsController.getById);
router.post('/', validateSlot, bookingsController.create);
router.put('/:id', validateIdParam, validateSlot, bookingsController.update);
router.delete('/:id', validateIdParam, bookingsController.delete);

export default router;
