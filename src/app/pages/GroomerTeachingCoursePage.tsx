import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useEntity } from '@/app/hooks';
import { api } from '@/app/api/client';
import { bulletinFromBooking, homeworkFromBooking, scheduleNotesFromBooking } from '@/app/lib/learnerBookingFields';

type MasterRow = { id: number; user_id: number };
type CourseRow = { id: number; name: string };
type BookingRow = {
  id: number;
  user_id: number;
  course_id: number;
  master_id: number | null;
  status: string;
  notes: string | null;
  homework_text?: string | null;
  schedule_notes?: string | null;
  bulletin_text?: string | null;
};

export function GroomerTeachingCoursePage() {
  const { user } = useAuth();
  const { courseId: idParam } = useParams();
  const courseId = idParam ? parseInt(idParam, 10) : NaN;

  const { list: masters } = useEntity<MasterRow>('masters', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 200 } });
  const { list: courses } = useEntity<CourseRow>('courses', { fetchListOnMount: true, listParams: { limit: 500 } });
  const { list: bookings, refetchList } = useEntity<BookingRow>('course_bookings', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 1200 } });

  const meMaster = useMemo(() => masters.find((m) => m.user_id === user?.id), [masters, user?.id]);
  const myCourseBookings = useMemo(
    () => (meMaster && Number.isFinite(courseId) ? bookings.filter((b) => b.course_id === courseId && b.status === 'оплачен') : []),
    [bookings, meMaster, courseId]
  );
  const course = Number.isFinite(courseId) ? courses.find((c) => c.id === courseId) : undefined;
  const first = myCourseBookings[0];

  const [homework, setHomework] = useState(first ? homeworkFromBooking(first) : '');
  const [schedule, setSchedule] = useState(first ? scheduleNotesFromBooking(first) : '');
  const [bulletin, setBulletin] = useState(first ? bulletinFromBooking(first) : '');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string>('');

  useEffect(() => {
    setHomework(first ? homeworkFromBooking(first) : '');
    setSchedule(first ? scheduleNotesFromBooking(first) : '');
    setBulletin(first ? bulletinFromBooking(first) : '');
  }, [first]);

  const saveAll = async () => {
    if (!myCourseBookings.length || saving) return;
    setSaving(true);
    setNotice('');
    try {
      await Promise.all(
        myCourseBookings.map((b) =>
          api.put(`/course_bookings/${b.id}`, {
            homework_text: homework.trim() || null,
            schedule_notes: schedule.trim() || null,
            bulletin_text: bulletin.trim() || null,
          })
        )
      );
      await refetchList({ limit: 1200 });
      setNotice('Изменения сохранены.');
    } finally {
      setSaving(false);
    }
  };

  if (!user || !meMaster || !Number.isFinite(courseId)) {
    return <div className="p-8">Недостаточно данных для страницы.</div>;
  }

  return (
    <div className="p-6 md:p-8 space-y-4">
      <Link to="/dashboard-groomer/teaching" className="inline-flex items-center gap-2 text-[#40AB40]">
        <ArrowLeft className="w-4 h-4" />
        Назад к обучению
      </Link>

      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
        <h1 className="text-2xl font-bold">{course?.name ?? `Курс #${courseId}`}</h1>
        <p className="text-sm text-gray-500 mt-1">Оплаченных учеников: {myCourseBookings.length}</p>
      </div>

      <section className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="font-bold mb-2">Домашнее задание</h2>
        <textarea value={homework} onChange={(e) => setHomework(e.target.value)} rows={6} placeholder="Если грумер не задал задание, ученики увидят: «Домашнее задание отсутствует»." className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" />
      </section>

      <section className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="font-bold mb-2">Расписание занятий</h2>
        <textarea value={schedule} onChange={(e) => setSchedule(e.target.value)} rows={5} placeholder="Если нет дат, ученики увидят: «Очных занятий нет»." className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" />
      </section>

      <section className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="font-bold mb-2">Доска объявлений</h2>
        <textarea value={bulletin} onChange={(e) => setBulletin(e.target.value)} rows={5} placeholder="Полезная информация для учеников курса." className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" />
      </section>

      <div className="flex items-center gap-3">
        <button type="button" onClick={() => void saveAll()} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#40AB40] text-white hover:bg-[#359635] disabled:opacity-50">
          <Save className="w-4 h-4" />
          Сохранить
        </button>
        {notice ? <span className="text-sm text-[#40AB40]">{notice}</span> : null}
      </div>
    </div>
  );
}
