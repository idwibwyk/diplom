import { useMemo } from 'react';
import { useEntity } from '@/app/hooks';
import { useAuth } from '@/app/context/AuthContext';

type ReviewRow = {
  id: number;
  user_id: number | null;
  service_id: number | null;
  course_id: number | null;
  service_booking_id?: number | null;
  course_booking_id?: number | null;
  text: string;
  rating: number;
  moderation_status?: string | null;
};
type ServiceRow = { id: number; name: string };
type CourseRow = { id: number; name: string };
type NotificationRow = { id: number; user_id: number; type: string; title?: string | null; body?: string | null; meta?: any; created_at: string };

export function AdminModerationPage() {
  const { user } = useAuth();
  const { list: reviews, update: updateReview } = useEntity<ReviewRow>('reviews', { fetchListOnMount: true, listParams: { limit: 500 } });
  const { list: services } = useEntity<ServiceRow>('services', { fetchListOnMount: true, listParams: { limit: 200 } });
  const { list: courses } = useEntity<CourseRow>('courses', { fetchListOnMount: true, listParams: { limit: 200 } });
  const { list: notifications, create: createNotification, update: updateNotification } = useEntity<NotificationRow>('notifications', { fetchListOnMount: true, listParams: { limit: 300 } });

  const pendingReviews = useMemo(() => reviews.filter((r) => (r.moderation_status || 'pending') === 'pending'), [reviews]);
  const questions = useMemo(
    () => notifications.filter((n) => n.type === 'client_question' && !n.meta?.answered_at).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [notifications]
  );

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Модерация</h1>

      <section className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="text-xl font-bold mb-4">Отзывы на проверке</h2>
        <div className="space-y-3">
          {pendingReviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <p className="font-semibold">
                {r.service_id ? services.find((s) => s.id === r.service_id)?.name : courses.find((c) => c.id === r.course_id)?.name || 'Запись'}
              </p>
              <p className="text-sm text-gray-500">Оценка: {r.rating}/5</p>
              <p className="mt-2">{r.text}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await updateReview(r.id, { moderation_status: 'approved', moderated_at: new Date().toISOString(), moderated_by: user?.id ?? null } as any);
                    if (r.user_id) {
                      await createNotification({
                        user_id: r.user_id,
                        type: 'moderation_result',
                        title: 'Отзыв опубликован',
                        body: `Ваш отзыв опубликован: ${r.service_id ? services.find((s) => s.id === r.service_id)?.name : courses.find((c) => c.id === r.course_id)?.name || 'Запись'}.`,
                      } as any);
                    }
                  }}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-white"
                >
                  Опубликовать
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await updateReview(r.id, { moderation_status: 'rejected', moderated_at: new Date().toISOString(), moderated_by: user?.id ?? null, moderation_comment: 'Не прошёл модерацию' } as any);
                    if (r.user_id) {
                      await createNotification({
                        user_id: r.user_id,
                        type: 'moderation_result',
                        title: 'Отзыв не прошел модерацию',
                        body: `Отзыв по записи "${r.service_id ? services.find((s) => s.id === r.service_id)?.name : courses.find((c) => c.id === r.course_id)?.name || 'Запись'}" отклонен. Можете отправить новый.`,
                      } as any);
                    }
                  }}
                  className="rounded-xl bg-rose-500 px-4 py-2 text-white"
                >
                  Отклонить
                </button>
              </div>
            </div>
          ))}
          {!pendingReviews.length ? <p className="text-sm text-gray-500">Нет отзывов на модерации</p> : null}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="text-xl font-bold mb-4">Вопросы клиентов по услугам</h2>
        <div className="space-y-3">
          {questions.map((q) => (
            <div key={q.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <p className="font-semibold">{q.title || 'Вопрос клиента'}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{q.body}</p>
              <button
                type="button"
                onClick={async () => {
                  const answer = window.prompt('Введите ответ клиенту');
                  if (!answer?.trim()) return;
                  const clientId = q.meta?.from_user_id;
                  if (clientId) {
                    await createNotification({
                      user_id: clientId,
                      type: 'admin_reply',
                      title: `Ответ администратора: ${q.meta?.service_name || 'услуга'}`,
                      body: answer.trim(),
                    } as any);
                  }
                  await updateNotification(q.id, { meta: { ...(q.meta || {}), answered_at: new Date().toISOString(), answered_by: user?.id ?? null, answer } } as any);
                }}
                className="mt-3 rounded-xl bg-[#4A90E2] px-4 py-2 text-white"
              >
                Ответить клиенту
              </button>
            </div>
          ))}
          {!questions.length ? <p className="text-sm text-gray-500">Нет новых вопросов</p> : null}
        </div>
      </section>
    </div>
  );
}

