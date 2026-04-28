import { api } from '@/app/api/client';

export type ProgressApiRow = {
  id: number;
  user_id: number;
  course_id: number;
  progress_percent: number;
  content_id?: number | null;
  course_booking_id?: number | null;
};

type ListBody = { success?: boolean; data?: ProgressApiRow[] };

/**
 * Обновляет или создаёт запись прогресса по курсу после теста.
 * Учитывает результат теста (%) и предыдущий максимум по курсу.
 */
export async function persistQuizCourseProgress(params: {
  courseId: number;
  userId: number;
  courseBookingId: number;
  testPercent: number;
}): Promise<string | null> {
  const { courseId, userId, courseBookingId, testPercent } = params;
  const res = await api.get(`/user_course_progress?course_id=${courseId}&limit=80`);
  if ('error' in res) return res.error;

  const body = res.data as ListBody;
  const rows = Array.isArray(body?.data) ? body.data : [];
  const mine = rows.filter((r) => r.user_id === userId && r.course_id === courseId);
  const best = mine.length ? mine.reduce((a, r) => (r.progress_percent > a.progress_percent ? r : a)) : null;
  const prev = best?.progress_percent ?? 0;
  const blended = Math.min(100, Math.max(prev, Math.round(prev * 0.25 + testPercent * 0.75)));

  if (best) {
    const u = await api.put(`/user_course_progress/${best.id}`, {
      progress_percent: blended,
      is_completed: blended >= 100,
    });
    if ('error' in u) return u.error;
    const putBody = u.data as { success?: boolean; error?: string };
    if (putBody && putBody.success === false) return putBody.error ?? 'Ошибка сохранения';
    return null;
  }

  const c = await api.post(`/user_course_progress`, {
    user_id: userId,
    course_id: courseId,
    course_booking_id: courseBookingId,
    progress_percent: blended,
    is_completed: blended >= 100,
  });
  if ('error' in c) return c.error;
  const postBody = c.data as { success?: boolean; error?: string };
  if (postBody && postBody.success === false) return postBody.error ?? 'Ошибка сохранения';
  return null;
}
