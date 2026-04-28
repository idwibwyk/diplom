import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useEntity } from '@/app/hooks';
import { useMemo } from 'react';
import { scheduleNotesFromBooking } from '@/app/lib/learnerBookingFields';

type CourseBookingRow = {
  id: number;
  user_id: number;
  course_id: number;
  course_schedule_id: number | null;
  status: string;
  notes: string | null;
  schedule_notes?: string | null;
};
type CourseRow = { id: number; name: string };
type ScheduleRow = { id: number; course_id: number; start_date: string; start_time: string | null };

export function DashboardMyCourseSchedulePage() {
  const { user } = useAuth();
  const { list: bookings } = useEntity<CourseBookingRow>('course_bookings', {
    fetchListOnMount: !!user,
    listParams: { limit: 100 },
    enabled: !!user,
  });
  const { list: courses } = useEntity<CourseRow>('courses', { fetchListOnMount: true, listParams: { limit: 100 } });
  const { list: schedules } = useEntity<ScheduleRow>('course_schedules', { fetchListOnMount: true, listParams: { limit: 200 } });

  const active = useMemo(() => {
    const mine = bookings.filter((b) => b.user_id === user?.id);
    return mine.find((b) => b.status === 'оплачен') ?? mine[0];
  }, [bookings, user?.id]);

  const course = active ? courses.find((c) => c.id === active.course_id) : undefined;
  const slot = active?.course_schedule_id != null ? schedules.find((s) => s.id === active.course_schedule_id) : undefined;
  const notesText = active ? scheduleNotesFromBooking(active) : '';
  const slotLine =
    slot != null
      ? `Дата потока: ${new Date(slot.start_date).toLocaleDateString('ru-RU')}${slot.start_time ? `, ${slot.start_time.slice(0, 5)}` : ''}.`
      : '';
  const body = [notesText.trim() || null, slotLine.trim() || null].filter(Boolean).join('\n\n');

  if (!user) {
    return (
      <div className="p-8">
        <Link to="/dashboard/my-courses" className="text-[#40AB40]">Мои курсы</Link>
      </div>
    );
  }

  if (!active) {
    return (
      <div className="p-8 max-w-xl">
        <Link to="/dashboard/my-courses" className="inline-flex items-center gap-2 text-[#40AB40] mb-4">
          <ArrowLeft className="w-4 h-4" />
          Мои курсы
        </Link>
        <p className="text-gray-600">Нет записи на курс.</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-emerald-50/30 to-white dark:from-gray-900 dark:to-gray-950 pb-16">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <Link
          to="/dashboard/my-courses"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#40AB40] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Мои курсы
        </Link>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#40AB40]/15 text-[#40AB40]">
              <CalendarDays className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Расписание занятий</h1>
              <p className="text-sm text-gray-500">{course?.name ?? `Курс #${active.course_id}`}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
              {body.trim() || 'Очных занятий нет'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
