import express from 'express';
import createController from '../controllers/universalController.js';
import db from '../db/knex.js';
import { optionalAuth } from '../middleware/auth.js';
import { validateIdParam } from '../middleware/validate.js';

const ctrl = createController(
  'zone_rental_applications',
  {
    guest: { read: false, create: true, update: false, delete: false },
    client: { read: false, readOwn: true, create: true, update: false, delete: false },
    groomer: { read: false, create: false },
  },
  { ownerField: 'user_id' }
);

const router = express.Router({ mergeParams: true });
router.use(optionalAuth);

router.get('/', ctrl.getAll);
router.get('/search', ctrl.search);
router.get('/:id', validateIdParam, ctrl.getById);

router.post('/', async (req, res) => {
  try {
    const actor = req.user || { id: null, role: 'guest' };
    const {
      name,
      phone,
      email,
      hours,
      message = null,
      points_to_spend = 0,
    } = req.body || {};
    if (!name || !phone || !email || !hours) {
      return res.status(400).json({ success: false, error: 'Заполните обязательные поля заявки' });
    }

    const created = await db.transaction(async (trx) => {
      const spend = actor.id ? Math.max(0, Number(points_to_spend) || 0) : 0;
      if (spend > 0) {
        const acc = await trx('loyalty_accounts').where({ user_id: actor.id }).first().forUpdate();
        const current = Number(acc?.points ?? 0);
        if (current < spend) throw new Error('Недостаточно лапок для списания');
        await trx('loyalty_accounts').where({ user_id: actor.id }).update({ points: current - spend, updated_at: db.raw('now()') });
      }
      const inserted = await trx('zone_rental_applications')
        .insert({
          user_id: actor.id ?? null,
          name,
          phone,
          email,
          hours: Number(hours),
          message,
          created_by: actor.id ?? null,
        })
        .returning('*');
      return Array.isArray(inserted) ? inserted[0] : inserted;
    });

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', validateIdParam, ctrl.update);
router.delete('/:id', validateIdParam, ctrl.delete);

export default router;
