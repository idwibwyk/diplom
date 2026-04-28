import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, FileCheck2, GraduationCap, MessageCircle, Users } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useEntity } from '@/app/hooks';
import { api } from '@/app/api/client';
import { useEffect } from 'react';
import { buildCourseTopicTests } from '@/app/lib/courseStudentDashboard';

type MasterRow = { id: number; user_id: number; full_name: string };
type CourseInstructorRow = { id: number; course_id: number; master_id: number };
type CourseRow = { id: number; name: string };
type ModuleRow = { id: number; course_id: number; title: string; sort_order: number };
type BookingRow = { id: number; user_id: number; course_id: number; master_id: number | null; status: string };
type UserRow = { id: number; name: string };
type QuizResultRow = { id: number; user_id: number; course_id: number; test_index: number; score_percent: number };

export function GroomerTeachingPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'courses' | 'students'>('courses');
  const [unreadByUserId, setUnreadByUserId] = useState<Record<number, number>>({});
  const [pendingHomeworkKeys, setPendingHomeworkKeys] = useState<Set<string>>(new Set());

  const { list: masters } = useEntity<MasterRow>('masters', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 200 } });
  const { list: instructors } = useEntity<CourseInstructorRow>('course_instructors', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 500 } });
  const { list: courses } = useEntity<CourseRow>('courses', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 500 } });
  const { list: modules } = useEntity<ModuleRow>('course_modules', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 1000 } });
  const { list: bookings } = useEntity<BookingRow>('course_bookings', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 1200 } });
  const { list: users } = useEntity<UserRow>('users', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 1200 } });
  const { list: quizResults } = useEntity<QuizResultRow>('user_course_quiz_results', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 2000 } });

  const meMaster = useMemo(() => masters.find((m) => m.user_id === user?.id), [masters, user?.id]);
  const taughtCourseIds = useMemo(() => {
    if (!meMaster) return new Set<number>();
    const fromInstructor = instructors.filter((i) => i.master_id === meMaster.id).map((i) => i.course_id);
    const fromBookings = bookings.filter((b) => b.master_id === meMaster.id).map((b) => b.course_id);
    return new Set([...fromInstructor, ...fromBookings]);
  }, [meMaster, instructors, bookings]);

  const taughtCourses = useMemo(
    () => courses.filter((c) => taughtCourseIds.has(c.id)),
    [courses, taughtCourseIds]
  );

  const paidStudents = useMemo(() => {
    if (!meMaster) return [];
    return bookings.filter((b) => b.status === 'оплачен' && taughtCourseIds.has(b.course_id));
  }, [bookings, meMaster, taughtCourseIds]);

  const testCountByCourse = useMemo(() => {
    const map = new Map<number, number>();
    for (const c of taughtCourses) {
      const titles = modules
        .filter((m) => m.course_id === c.id)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((m) => m.title);
      map.set(c.id, buildCourseTopicTests(c.name, titles).length);
    }
    return map;
  }, [taughtCourses, modules]);

  const rows = useMemo(() => {
    return paidStudents.map((b) => {
      const u = users.find((row) => row.id === b.user_id);
      const c = courses.find((row) => row.id === b.course_id);
      const doneRows = quizResults.filter((r) => r.user_id === b.user_id && r.course_id === b.course_id);
      const total = testCountByCourse.get(b.course_id) ?? 0;
      const coverage = total > 0 ? Math.round((doneRows.length / total) * 100) : 0;
      const avg = doneRows.length > 0 ? Math.round(doneRows.reduce((s, r) => s + r.score_percent, 0) / doneRows.length) : 0;
      return { bookingId: b.id, userId: b.user_id, courseId: b.course_id, userName: u?.name ?? `Пользователь #${b.user_id}`, courseName: c?.name ?? `Курс #${b.course_id}`, coverage, avg };
    });
  }, [paidStudents, users, courses, quizResults, testCountByCourse]);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const res = await api.get<{ success?: boolean; data?: Array<{ sender_id: number; unread_count: number }> }>('/conversations/unread-summary');
      if ('error' in res) return;
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      const map: Record<number, number> = {};
      for (const row of data) map[row.sender_id] = row.unread_count;
      setUnreadByUserId(map);

      const hwRes = await api.get<{ success?: boolean; data?: Array<{ user_id: number; course_id: number; status: string }> }>('/course_homework_submissions/groomer');
      if (!('error' in hwRes)) {
        const rows = Array.isArray(hwRes.data?.data) ? hwRes.data.data : [];
        const set = new Set<string>();
        for (const row of rows) {
          if (row.status === 'submitted') set.add(`${row.user_id}:${row.course_id}`);
        }
        setPendingHomeworkKeys(set);
      }
    })();
  }, [user]);

  if (!user) return <div className="p-8">Требуется вход.</div>;

  return (
    <div className="p-6 md:p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Обучение
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Курсы, ученики и прогресс</p>

      <div className="flex gap-2 mb-6">
        <button type="button" onClick={() => setTab('courses')} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${tab === 'courses' ? 'bg-[#40AB40] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
          <BookOpen className="w-4 h-4" />
          Курсы
        </button>
        <button type="button" onClick={() => setTab('students')} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${tab === 'students' ? 'bg-[#40AB40] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
          <Users className="w-4 h-4" />
          Ученики
        </button>
      </div>

      {tab === 'courses' ? (
        taughtCourses.length === 0 ? (
          <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700">Пока нет назначенных курсов.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {taughtCourses.map((c) => {
              const studentsCount = paidStudents.filter((b) => b.course_id === c.id).length;
              return (
                <Link key={c.id} to={`/dashboard-groomer/teaching/course/${c.id}`} className="group rounded-2xl bg-white dark:bg-gray-800 p-5 border border-gray-200 dark:border-gray-700 hover:border-[#40AB40] shadow-sm">
                  <div className="flex items-center justify-between">
                    <GraduationCap className="w-8 h-8 text-[#40AB40]" />
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#40AB40]" />
                  </div>
                  <h3 className="font-bold text-lg mt-3 text-gray-900 dark:text-white">{c.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{studentsCount} оплаченных учеников</p>
                </Link>
              );
            })}
          </div>
        )
      ) : (
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left px-4 py-3 font-bold">Ученик</th>
                  <th className="text-left px-4 py-3 font-bold">Курс</th>
                  <th className="text-left px-4 py-3 font-bold">Прогресс</th>
                  <th className="text-left px-4 py-3 font-bold">Домашнее</th>
                  <th className="text-left px-4 py-3 font-bold">Чат</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td className="px-4 py-6 text-gray-500" colSpan={5}>Нет учеников по оплаченным заявкам.</td></tr>
                ) : rows.map((r) => (
                  <tr key={r.bookingId} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{r.userName}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.courseName}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700 dark:text-gray-200">{r.coverage}% курс / средний балл {r.avg}%</div>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/dashboard-groomer/teaching/homework?userId=${r.userId}&courseId=${r.courseId}`} className="inline-flex items-center gap-2 text-[#40AB40] font-medium hover:underline">
                        <FileCheck2 className="w-4 h-4" />
                        Проверить ДЗ
                        {pendingHomeworkKeys.has(`${r.userId}:${r.courseId}`) ? <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> : null}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/dashboard-groomer/teaching/chat?userId=${r.userId}&courseId=${r.courseId}`} className="relative inline-flex items-center gap-2 text-[#40AB40] font-medium hover:underline">
                        <MessageCircle className="w-4 h-4" />
                        Открыть чат
                        {(unreadByUserId[r.userId] ?? 0) > 0 ? <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> : null}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
