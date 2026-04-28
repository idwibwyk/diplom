import express from 'express';
import createController from '../controllers/universalController.js';
import db from '../db/knex.js';
import { optionalAuth } from '../middleware/auth.js';
import { validateIdParam } from '../middleware/validate.js';

const rolesConfig = {
  guest: { read: false, create: false },
  client: { read: false, readOwn: true, create: true, updateOwn: true, delete: false },
  groomer: { read: true, create: false, update: true, delete: false },
};
const options = { ownerField: 'user_id' };
const ctrl = createController('course_bookings', rolesConfig, options);
const router = express.Router({ mergeParams: true });

router.use(optionalAuth);
router.get('/', ctrl.getAll);
router.get('/search', ctrl.search);
router.get('/:id', validateIdParam, ctrl.getById);

router.post('/', async (req, res) => {
  try {
    const user = req.user || { id: null, role: 'guest' };
    if (user.role !== 'client' || !user.id) {
      return res.status(403).json({ success: false, error: 'Только авторизованный клиент может записаться на курс' });
    }
    const userExists = await db('users').where({ id: user.id }).first();
    if (!userExists) {
      return res.status(401).json({ success: false, error: 'Сессия устарела. Войдите в аккаунт заново.' });
    }

    const {
      course_id,
      course_schedule_id,
      master_id = null,
      notes = null,
      status = 'ожидает оплату',
    } = req.body || {};

    if (!course_id || !course_schedule_id) {
      return res.status(400).json({ success: false, error: 'Не выбраны курс или дата старта' });
    }

    const result = await db.transaction(async (trx) => {
      const schedule = await trx('course_schedules')
        .where({ id: course_schedule_id, course_id })
        .first()
        .forUpdate();

      if (!schedule) {
        throw new Error('Выбранная дата старта не найдена');
      }
      if ((schedule.spots ?? 0) <= 0) {
        throw new Error('На выбранную дату мест больше нет');
      }

      await trx('course_schedules')
        .where({ id: schedule.id })
        .update({ spots: schedule.spots - 1, updated_at: db.raw('now()') });

      const [inserted] = await trx('course_bookings')
        .insert({
          user_id: user.id,
          course_id,
          course_schedule_id,
          master_id,
          notes,
          status,
          created_by: user.id,
        })
        .returning('id');

      const bookingId = inserted?.id ?? inserted;
      return trx('course_bookings').where({ id: bookingId }).first();
    });

    return res.status(201).json({
      success: true,
      data: result,
      message: 'Запись на курс создана',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/:id/status', validateIdParam, async (req, res) => {
  try {
    const actor = req.user || { id: null, role: 'guest' };
    if (actor.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Только администратор может менять статус' });
    }
    const id = Number(req.params.id);
    const nextStatus = String(req.body?.status || '').trim();
    if (!nextStatus) return res.status(400).json({ success: false, error: 'Не указан статус' });

    const updated = await db.transaction(async (trx) => {
      const booking = await trx('course_bookings').where({ id }).first().forUpdate();
      if (!booking) throw new Error('Запись не найдена');

      await trx('course_bookings').where({ id }).update({ status: nextStatus, updated_at: db.raw('now()') });

      if (booking.status !== 'оплачен' && nextStatus === 'оплачен') {
        const course = await trx('courses').where({ id: booking.course_id }).first();
        const points = Number(course?.loyalty_points ?? 0);
        if (points > 0) {
          const account = await trx('loyalty_accounts').where({ user_id: booking.user_id }).first().forUpdate();
          if (account) {
            await trx('loyalty_accounts')
              .where({ user_id: booking.user_id })
              .update({
                points: Number(account.points ?? 0) + points,
                total_earned: Number(account.total_earned ?? 0) + points,
                updated_at: db.raw('now()'),
              });
          } else {
            await trx('loyalty_accounts').insert({
              user_id: booking.user_id,
              points,
              total_earned: points,
              created_by: actor.id,
            });
          }
        }
      }
      return trx('course_bookings').where({ id }).first();
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', validateIdParam, ctrl.update);
router.delete('/:id', validateIdParam, ctrl.delete);

export default router;
