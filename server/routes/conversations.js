import express from 'express';
import db from '../db/knex.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(optionalAuth);
router.use(requireAuth);

/** Сводка непрочитанных сообщений: sender_id -> unread_count */
router.get('/unread-summary', async (req, res) => {
  try {
    const me = req.user.id;
    const rows = await db('messages')
      .select('sender_id')
      .count({ unread_count: '*' })
      .where({ recipient_id: me, is_read: false })
      .groupBy('sender_id');
    const data = rows.map((r) => ({
      sender_id: Number(r.sender_id),
      unread_count: Number(r.unread_count ?? 0),
    }));
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/** Сообщения между текущим пользователем и partnerUserId (оба направления). */
router.get('/with/:partnerUserId', async (req, res) => {
  try {
    const me = req.user.id;
    const partner = parseInt(req.params.partnerUserId, 10);
    if (Number.isNaN(partner) || partner < 1) {
      return res.status(400).json({ success: false, error: 'Некорректный получатель' });
    }
    const rows = await db('messages')
      .where(function q() {
        this.where({ sender_id: me, recipient_id: partner }).orWhere({ sender_id: partner, recipient_id: me });
      })
      .orderBy('created_at', 'asc')
      .orderBy('id', 'asc')
      .limit(400);

    await db('messages')
      .where({ sender_id: partner, recipient_id: me, is_read: false })
      .update({ is_read: true });

    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/** Отправить сообщение в чат (сохраняется в messages). */
router.post('/with/:partnerUserId', async (req, res) => {
  try {
    const me = req.user.id;
    const partner = parseInt(req.params.partnerUserId, 10);
    const { message } = req.body || {};
    if (Number.isNaN(partner) || partner < 1) {
      return res.status(400).json({ success: false, error: 'Некорректный получатель' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Введите текст сообщения' });
    }
    const inserted = await db('messages')
      .insert({
        sender_id: me,
        recipient_id: partner,
        message: message.trim(),
        is_read: false,
        type: 'chat',
        created_by: me,
      })
      .returning('*');
    const row = Array.isArray(inserted) ? inserted[0] : inserted;
    return res.status(201).json({ success: true, data: row });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
