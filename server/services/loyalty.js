import db from '../db/knex.js';

function toPgTimestamp(date) {
  if (date instanceof Date) return date.toISOString();
  return new Date(date).toISOString();
}

/**
 * Пересчитывает «лапки» пользователя на основе прошедших записей.
 * Начисление происходит только если время записи уже наступило.
 */
export async function syncLoyaltyForUser(userId, now = new Date()) {
  if (!userId) return null;

  // гарантируем наличие аккаунта
  const existing = await db('loyalty_accounts').where({ user_id: userId }).first();
  if (!existing) {
    await db('loyalty_accounts').insert({ user_id: userId, points: 0, total_earned: 0, created_by: userId });
  }

  const nowIso = toPgTimestamp(now);

  const serviceEarnedRow = await db('service_bookings as sb')
    .leftJoin('services as s', 's.id', 'sb.service_id')
    .where('sb.user_id', userId)
    .andWhere('sb.scheduled_at', '<=', nowIso)
    .whereNotIn('sb.status', ['cancelled', 'postponed'])
    .sum({ sum: db.raw('COALESCE(s.loyalty_points, 0)') })
    .first();
  const serviceEarned = Number(serviceEarnedRow?.sum ?? 0) || 0;

  // курсы: берем дату/время из course_schedules
  const courseEarnedRow = await db('course_bookings as cb')
    .leftJoin('courses as c', 'c.id', 'cb.course_id')
    .leftJoin('course_schedules as cs', 'cs.id', 'cb.course_schedule_id')
    .where('cb.user_id', userId)
    .whereNotIn('cb.status', ['cancelled', 'postponed'])
    .andWhere(function whereStarted() {
      // если нет расписания — не начисляем
      this.whereNotNull('cb.course_schedule_id');
      // start_date + start_time (если null -> 00:00)
      this.andWhereRaw(
        "(cs.start_date::timestamp + COALESCE(cs.start_time, '00:00')::time) <= ?::timestamp",
        [nowIso]
      );
    })
    .sum({ sum: db.raw('COALESCE(c.loyalty_points, 0)') })
    .first();
  const courseEarned = Number(courseEarnedRow?.sum ?? 0) || 0;

  const totalEarned = serviceEarned + courseEarned;

  await db('loyalty_accounts')
    .where({ user_id: userId })
    .update({
      points: totalEarned,
      total_earned: totalEarned,
      updated_at: db.raw('now()'),
    });

  return { points: totalEarned, total_earned: totalEarned };
}

