import { api } from '@/app/api/client';

export type QuizResultRow = {
  id: number;
  user_id: number;
  course_id: number;
  test_index: number;
  score_percent: number;
};

type ListBody = { success?: boolean; data?: QuizResultRow[] };

/** Сохраняет результат одного тематического теста (таблица user_course_quiz_results). */
export async function persistQuizTestResult(params: {
  userId: number;
  courseId: number;
  testIndex: number;
  scorePercent: number;
}): Promise<string | null> {
  const { userId, courseId, testIndex, scorePercent } = params;
  const res = await api.get(`/user_course_quiz_results?course_id=${courseId}&limit=100`);
  if ('error' in res) return res.error;

  const body = res.data as ListBody;
  const rows = Array.isArray(body?.data) ? body.data : [];
  const existing = rows.find((r) => r.user_id === userId && r.course_id === courseId && r.test_index === testIndex);

  if (existing) {
    const u = await api.put(`/user_course_quiz_results/${existing.id}`, { score_percent: scorePercent });
    if ('error' in u) return u.error;
    const putBody = u.data as { success?: boolean; error?: string };
    if (putBody && putBody.success === false) return putBody.error ?? 'Ошибка сохранения';
    return null;
  }

  const c = await api.post(`/user_course_quiz_results`, {
    user_id: userId,
    course_id: courseId,
    test_index: testIndex,
    score_percent: scorePercent,
  });
  if ('error' in c) return c.error;
  const postBody = c.data as { success?: boolean; error?: string };
  if (postBody && postBody.success === false) return postBody.error ?? 'Ошибка сохранения';
  return null;
}
