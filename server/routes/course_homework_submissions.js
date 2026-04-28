import express from 'express';
import db from '../db/knex.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(optionalAuth);
router.use(requireAuth);

async function getMasterIdByUserId(userId) {
  const row = await db('masters').where({ user_id: userId }).first();
  return row?.id ?? null;
}

async function getTaughtCourseIds(masterId) {
  const fromInstructors = await db('course_instructors').where({ master_id: masterId }).select('course_id');
  const fromBookings = await db('course_bookings').where({ master_id: masterId }).select('course_id');
  return new Set([...fromInstructors, ...fromBookings].map((r) => Number(r.course_id)));
}

// Мои работы ученика (для страницы ДЗ)
router.get('/mine', async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.query.course_id ? Number(req.query.course_id) : null;
    let q = db('course_homework_submissions').where({ user_id: userId }).orderBy('created_at', 'desc').limit(100);
    if (courseId) q = q.andWhere({ course_id: courseId });
    const rows = await q;
    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Загрузка/обновление ответа ученика
router.post('/submit', async (req, res) => {
  try {
    const userId = req.user.id;
    if (req.user.role !== 'client') {
      return res.status(403).json({ success: false, error: 'Только ученик может отправить домашнее задание' });
    }
    const bookingId = Number(req.body?.course_booking_id);
    const filePath = typeof req.body?.file_path === 'string' ? req.body.file_path.trim() : '';
    const studentComment = typeof req.body?.student_comment === 'string' ? req.body.student_comment.trim() : null;
    if (!bookingId || !filePath) {
      return res.status(400).json({ success: false, error: 'Нужны course_booking_id и file_path' });
    }

    const booking = await db('course_bookings').where({ id: bookingId, user_id: userId }).first();
    if (!booking) return res.status(404).json({ success: false, error: 'Запись на курс не найдена' });
    if (booking.status !== 'оплачен') {
      return res.status(400).json({ success: false, error: 'ДЗ доступно только для оплаченного курса' });
    }

    const payload = {
      course_booking_id: booking.id,
      user_id: userId,
      course_id: booking.course_id,
      master_id: booking.master_id ?? null,
      file_path: filePath,
      student_comment: studentComment,
      status: 'submitted',
      score_percent: null,
      groomer_comment: null,
      reviewed_at: null,
      updated_at: db.raw('now()'),
    };

    const existing = await db('course_homework_submissions')
      .where({ course_booking_id: booking.id, user_id: userId })
      .first();
    if (existing) {
      await db('course_homework_submissions').where({ id: existing.id }).update(payload);
      const updated = await db('course_homework_submissions').where({ id: existing.id }).first();
      return res.json({ success: true, data: updated });
    }

    const inserted = await db('course_homework_submissions')
      .insert({ ...payload, created_by: userId })
      .returning('*');
    const row = Array.isArray(inserted) ? inserted[0] : inserted;
    return res.status(201).json({ success: true, data: row });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Работы учеников для грумера
router.get('/groomer', async (req, res) => {
  try {
    const me = req.user.id;
    if (req.user.role !== 'groomer') {
      return res.status(403).json({ success: false, error: 'Доступ только для грумера' });
    }
    const courseId = req.query.course_id ? Number(req.query.course_id) : null;
    const userId = req.query.user_id ? Number(req.query.user_id) : null;
    const masterId = await getMasterIdByUserId(me);
    if (!masterId) return res.json({ success: true, data: [] });
    const taughtCourseIds = await getTaughtCourseIds(masterId);
    if (taughtCourseIds.size === 0) return res.json({ success: true, data: [] });

    let q = db('course_homework_submissions as s')
      .leftJoin('users as u', 'u.id', 's.user_id')
      .leftJoin('courses as c', 'c.id', 's.course_id')
      .select('s.*', 'u.name as user_name', 'c.name as course_name')
      .whereIn('s.course_id', Array.from(taughtCourseIds))
      .orderBy('s.created_at', 'desc')
      .limit(200);
    if (courseId) q = q.andWhere('s.course_id', courseId);
    if (userId) q = q.andWhere('s.user_id', userId);
    const rows = await q;
    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Непроверенные работы для красной точки у грумера
router.get('/groomer/pending-count', async (req, res) => {
  try {
    if (req.user.role !== 'groomer') {
      return res.status(403).json({ success: false, error: 'Доступ только для грумера' });
    }
    const masterId = await getMasterIdByUserId(req.user.id);
    if (!masterId) return res.json({ success: true, data: { count: 0 } });
    const taughtCourseIds = await getTaughtCourseIds(masterId);
    if (taughtCourseIds.size === 0) return res.json({ success: true, data: { count: 0 } });
    const row = await db('course_homework_submissions')
      .whereIn('course_id', Array.from(taughtCourseIds))
      .andWhere({ status: 'submitted' })
      .count({ count: '*' })
      .first();
    return res.json({ success: true, data: { count: Number(row?.count ?? 0) } });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Проверка работы грумером
router.put('/:id/review', async (req, res) => {
  try {
    if (req.user.role !== 'groomer') {
      return res.status(403).json({ success: false, error: 'Доступ только для грумера' });
    }
    const id = Number(req.params.id);
    const score = req.body?.score_percent == null ? null : Number(req.body.score_percent);
    const comment = typeof req.body?.groomer_comment === 'string' ? req.body.groomer_comment.trim() : null;
    if (!id || score == null || Number.isNaN(score) || score < 0 || score > 100) {
      return res.status(400).json({ success: false, error: 'Укажите корректную оценку от 0 до 100' });
    }
    const submission = await db('course_homework_submissions').where({ id }).first();
    if (!submission) return res.status(404).json({ success: false, error: 'Работа не найдена' });
    const masterId = await getMasterIdByUserId(req.user.id);
    const taughtCourseIds = masterId ? await getTaughtCourseIds(masterId) : new Set();
    if (!taughtCourseIds.has(Number(submission.course_id))) {
      return res.status(403).json({ success: false, error: 'Работа не относится к вашим курсам' });
    }

    await db('course_homework_submissions')
      .where({ id })
      .update({
        score_percent: score,
        groomer_comment: comment,
        status: 'reviewed',
        reviewed_at: db.raw('now()'),
        updated_at: db.raw('now()'),
      });
    const row = await db('course_homework_submissions').where({ id }).first();
    return res.json({ success: true, data: row });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
