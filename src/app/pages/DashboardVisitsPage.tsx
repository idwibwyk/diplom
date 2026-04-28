import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { useEntity } from '@/app/hooks';
import { Star, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

type Booking = { id: number; service_id: number; master_id: number | null; pet_id: number | null; scheduled_at: string; status: string; notes: string | null };
type Service = { id: number; name: string; price: number; duration_minutes?: number | null; duration_slots?: number | null };
type Master = { id: number; full_name: string };
type Pet = { id: number; name: string };
type CourseBooking = { id: number; course_id: number; course_schedule_id: number | null; master_id: number | null; status: string; notes: string | null; created_at: string; updated_at: string };
type Course = { id: number; name: string; price: number; duration: string };
type CourseSchedule = { id: number; course_id: number; start_date: string; start_time: string | null };
type ReviewRow = {
  id: number;
  user_id: number | null;
  service_id?: number | null;
  course_id?: number | null;
  master_id?: number | null;
  service_booking_id?: number | null;
  course_booking_id?: number | null;
  moderation_status?: 'pending' | 'approved' | 'rejected' | null;
};

export function DashboardVisitsPage() {
  const { user } = useAuth();
  const { list: bookings, loadingList: loadingBookings } = useEntity<Booking>('service_bookings', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 200 } });
  const { list: courseBookings, loadingList: loadingCourseBookings } = useEntity<CourseBooking>('course_bookings', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 200 } });
  const { list: services } = useEntity<Service>('services', { fetchListOnMount: true, listParams: { limit: 200 } });
  const { list: courses } = useEntity<Course>('courses', { fetchListOnMount: true, listParams: { limit: 200 } });
  const { list: courseSchedules } = useEntity<CourseSchedule>('course_schedules', { fetchListOnMount: true, listParams: { limit: 200 } });
  const { list: masters } = useEntity<Master>('masters', { fetchListOnMount: true, listParams: { limit: 200 } });
  const { list: pets } = useEntity<Pet>('pets', { fetchListOnMount: true, listParams: { limit: 200 } });
  const { list: myReviews, create: createReview, update: updateReview, loadingList: loadingReviews, creating: creatingReview } = useEntity<ReviewRow>('reviews', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 500 } });

  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{
    kind: 'service' | 'course';
    id: number;
    title: string;
    masterName: string;
    masterId?: number | null;
    serviceId?: number | null;
    courseId?: number | null;
    petName?: string;
  } | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const getDurationMinutes = (service?: Service) => {
    if (!service) return 60;
    if (service.duration_slots != null) return Math.max(30, Number(service.duration_slots) * 30);
    if (service.duration_minutes != null) return Math.max(30, Number(service.duration_minutes));
    return 60;
  };

  const formatTimeRange = (startIso: string, durationMinutes: number) => {
    const start = new Date(startIso);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
    const format = (d: Date) => d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    return `${format(start)}-${format(end)}`;
  };

  const visits = useMemo(
    () =>
      [
        ...bookings
          .filter((b) => b.status === 'completed' || new Date(b.scheduled_at).getTime() < Date.now())
          .map((b) => ({ kind: 'service' as const, booking: b })),
        ...courseBookings
          .filter((b) => b.status === 'completed' || b.status === 'confirmed' || b.status === 'pending')
          .map((b) => ({ kind: 'course' as const, booking: b })),
      ]
        .map((x) => {
          if (x.kind === 'service') {
            const b = x.booking as Booking;
          const service = services.find((s) => s.id === b.service_id);
          return {
            id: b.id,
            kind: 'service' as const,
            serviceId: b.service_id,
            masterId: b.master_id,
            date: b.scheduled_at,
            title: service?.name ?? 'Услуга',
            master: masters.find((m) => m.id === b.master_id)?.full_name ?? 'Любой мастер',
            pet: pets.find((p) => p.id === b.pet_id)?.name ?? 'Питомец',
            cost: service?.price ?? 0,
            timeRange: formatTimeRange(b.scheduled_at, getDurationMinutes(service)),
            notes: b.notes || '',
          };
          }
          const b = x.booking as CourseBooking;
          const course = courses.find((c) => c.id === b.course_id);
          const schedule = b.course_schedule_id ? courseSchedules.find((cs) => cs.id === b.course_schedule_id) : null;
          const dt = schedule ? new Date(`${schedule.start_date}T${schedule.start_time || '00:00'}`) : null;
          return {
            id: b.id,
            kind: 'course' as const,
            courseId: b.course_id,
            masterId: b.master_id,
            date: dt ? dt.toISOString() : b.updated_at || b.created_at,
            title: course?.name ?? 'Курс',
            master: masters.find((m) => m.id === b.master_id)?.full_name ?? 'Преподаватель',
            pet: '—',
            cost: course?.price ?? 0,
            timeRange: schedule ? `${schedule.start_time || '00:00'}` : '—',
            notes: b.notes || '',
          };
        })
        .filter(Boolean)
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [bookings, courseBookings, services, courses, courseSchedules, masters, pets]
  );

  const reviewStateFor = (kind: 'service' | 'course', id: number): 'none' | 'pending' | 'approved' | 'rejected' => {
    const r = kind === 'service'
      ? myReviews.find((x) => x.service_booking_id === id)
      : myReviews.find((x) => x.course_booking_id === id);
    const s = (r?.moderation_status || 'pending') as 'pending' | 'approved' | 'rejected';
    if (!r) return 'none';
    return s;
  };

  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        История посещений
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Все визиты в MARS GROOM</p>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        {(loadingBookings || loadingCourseBookings || loadingReviews) ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-[#53C9CA]" />
          </div>
        ) : (
        <div className="space-y-4">
          {visits.map((visit, i) => (
            <motion.div
              key={visit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-l-4 border-[#53C9CA] pl-6 py-4 rounded-r-xl bg-gray-50 dark:bg-gray-700/30"
            >
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">{visit.kind === 'service' ? 'Услуга:' : 'Курс:'}</span> {visit.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-semibold">Мастер:</span> {visit.master}</p>
                  {visit.kind === 'service' ? (
                    <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-semibold">Питомец:</span> {visit.pet}</p>
                  ) : null}
                </div>
                <div className="min-w-[170px] pl-8 pr-6 py-1 text-right">
                  <p className="font-bold text-[#53C9CA]">{visit.cost} ₽</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 break-words">{new Date(visit.date).toLocaleDateString('ru-RU')} · {visit.timeRange}</p>
                </div>
              </div>
              {visit.notes && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 italic">«{visit.notes}»</p>
              )}

              <div className="mt-4">
                {reviewStateFor(visit.kind, visit.id) === 'none' || reviewStateFor(visit.kind, visit.id) === 'rejected' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setReviewTarget({
                        kind: visit.kind,
                        id: visit.id,
                        title: visit.title,
                        masterName: visit.master,
                        masterId: visit.masterId,
                        serviceId: (visit as any).serviceId,
                        courseId: (visit as any).courseId,
                        petName: visit.kind === 'service' ? visit.pet : undefined,
                      });
                      setReviewRating(5);
                      setReviewText('');
                      setReviewOpen(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#53C9CA] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2fb9b9] transition-colors"
                  >
                    <Star className="h-4 w-4" />
                    {reviewStateFor(visit.kind, visit.id) === 'rejected' ? 'Оставить отзыв повторно' : 'Оставить отзыв'}
                  </button>
                ) : reviewStateFor(visit.kind, visit.id) === 'pending' ? (
                  <span className="text-sm text-amber-600">Отзыв на модерации. Повторная отправка недоступна до решения администратора.</span>
                ) : (
                  <span className="text-sm text-gray-500">Отзыв опубликован</span>
                )}
              </div>
            </motion.div>
          ))}
          {visits.length === 0 && <p className="text-center text-gray-500 py-6">Пока нет завершенных записей.</p>}
        </div>
        )}
      </div>

      {reviewOpen && reviewTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
            <h3 className="text-xl font-bold">Отзыв</h3>
            <p className="mt-1 text-sm text-gray-500">
              {reviewTarget.title} · {reviewTarget.masterName}{reviewTarget.petName ? ` · ${reviewTarget.petName}` : ''}
            </p>

            <div className="mt-4 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setReviewRating(i + 1)}
                  className="p-1"
                  aria-label={`Оценка ${i + 1}`}
                >
                  <Star className={`h-6 w-6 ${i < reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
                </button>
              ))}
            </div>

            <textarea
              className="mt-4 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#53C9CA] dark:border-gray-700 dark:bg-gray-900"
              rows={5}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Напишите ваш отзыв…"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setReviewOpen(false)}
                className="rounded-xl border border-gray-300 px-4 py-2 dark:border-gray-700"
              >
                Отмена
              </button>
              <button
                type="button"
                disabled={creatingReview || !reviewText.trim()}
                onClick={async () => {
                  if (!user) return;
                  const payload: any = {
                    rating: reviewRating,
                    text: reviewText.trim(),
                    type: reviewTarget.kind,
                    moderation_status: 'pending',
                    master_id: reviewTarget.masterId ?? null,
                  };
                  let rejected: ReviewRow | undefined;
                  if (reviewTarget.kind === 'service') {
                    payload.service_booking_id = reviewTarget.id;
                    payload.service_id = reviewTarget.serviceId ?? null;
                    rejected = myReviews.find((r) => r.service_booking_id === reviewTarget.id && r.moderation_status === 'rejected');
                  } else {
                    payload.course_booking_id = reviewTarget.id;
                    payload.course_id = reviewTarget.courseId ?? null;
                    rejected = myReviews.find((r) => r.course_booking_id === reviewTarget.id && r.moderation_status === 'rejected');
                  }
                  if (rejected) await updateReview(rejected.id, payload);
                  else await createReview(payload);
                  setReviewOpen(false);
                }}
                className="rounded-xl bg-[#53C9CA] px-4 py-2 font-semibold text-white disabled:opacity-60"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
