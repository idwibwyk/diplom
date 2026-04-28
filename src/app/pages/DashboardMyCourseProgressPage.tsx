import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, BarChart3, Loader2, Trophy } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useEntity } from '@/app/hooks';
import { useEffect, useMemo } from 'react';
import { buildCourseTopicTests } from '@/app/lib/courseStudentDashboard';

type CourseBookingRow = { user_id: number; course_id: number; status: string };
type CourseRow = { id: number; name: string };
type ModuleRow = { id: number; course_id: number; title: string; sort_order: number };
type QuizResultRow = { id: number; user_id: number; course_id: number; test_index: number; score_percent: number };

export function DashboardMyCourseProgressPage() {
  const { user } = useAuth();
  const { list: bookings } = useEntity<CourseBookingRow>('course_bookings', {
    fetchListOnMount: !!user,
    listParams: { limit: 100 },
    enabled: !!user,
  });
  const { list: courses } = useEntity<CourseRow>('courses', { fetchListOnMount: true, listParams: { limit: 100 } });
  const { list: modules, refetchList: refetchModules, loadingList: loadingMods } = useEntity<ModuleRow>('course_modules', {
    fetchListOnMount: false,
    enabled: false,
  });
  const { list: quizResults, refetchList: refetchQuiz, loadingList: loadingQuiz } = useEntity<QuizResultRow>('user_course_quiz_results', {
    fetchListOnMount: false,
    enabled: false,
  });

  const active = useMemo(() => {
    const mine = bookings.filter((b) => b.user_id === user?.id);
    return mine.find((b) => b.status === 'оплачен') ?? mine[0];
  }, [bookings, user?.id]);

  const courseId = active?.course_id;
  const course = courseId != null ? courses.find((c) => c.id === courseId) : undefined;

  useEffect(() => {
    if (!courseId) return;
    void refetchModules({ course_id: courseId, limit: 40 });
    void refetchQuiz({ course_id: courseId, limit: 100 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const moduleTitles = useMemo(() => {
    if (!courseId) return [];
    return modules
      .filter((m) => m.course_id === courseId)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((m) => m.title);
  }, [modules, courseId]);

  const catalogTests = useMemo(
    () => (course?.name ? buildCourseTopicTests(course.name, moduleTitles) : []),
    [course?.name, moduleTitles]
  );

  const myQuizRows = useMemo(
    () => (user && courseId ? quizResults.filter((r) => r.user_id === user.id && r.course_id === courseId) : []),
    [quizResults, user, courseId]
  );

  const totalTests = catalogTests.length;
  const completed = myQuizRows.length;
  const rowsSorted = useMemo(() => [...myQuizRows].sort((a, b) => a.test_index - b.test_index), [myQuizRows]);
  const scoreByIndex = useMemo(() => {
    const m = new Map<number, number>();
    for (const row of rowsSorted) m.set(row.test_index, row.score_percent);
    return m;
  }, [rowsSorted]);
  const rowsForDisplay = useMemo(() => {
    if (catalogTests.length === 0) return [];
    return catalogTests.map((t) => ({
      index: t.index,
      title: t.title,
      score_percent: scoreByIndex.get(t.index) ?? 0,
      done: scoreByIndex.has(t.index),
    }));
  }, [catalogTests, scoreByIndex]);
  const coursePercent = useMemo(() => {
    if (rowsForDisplay.length === 0) return 0;
    const sum = rowsForDisplay.reduce((acc, r) => acc + r.score_percent, 0);
    return Math.round(sum / rowsForDisplay.length);
  }, [rowsForDisplay]);

  if (!user) {
    return (
      <div className="p-8">
        <Link to="/dashboard/my-courses" className="text-[#40AB40]">
          Мои курсы
        </Link>
      </div>
    );
  }

  if (!active || !courseId) {
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

  if (courseId && (loadingMods || loadingQuiz)) {
    return (
      <div className="p-16 flex justify-center min-h-[40vh]">
        <Loader2 className="w-10 h-10 text-[#40AB40] animate-spin" />
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

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#40AB40]/15 text-[#40AB40] mb-3">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Статистика тестов</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{course?.name ?? `Курс #${courseId}`}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-[#40AB40]/25 bg-white dark:bg-gray-800 p-5 shadow-sm text-center"
          >
            <BarChart3 className="w-7 h-7 text-[#40AB40] mx-auto mb-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Пройдено тестов</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {completed} <span className="text-lg text-gray-400 font-normal">/ {totalTests}</span>
            </p>
            <p className="text-sm text-[#40AB40] font-medium mt-2">Выполнение курса: {coursePercent}%</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm text-center"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Средний балл</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{coursePercent}%</p>
            <p className="text-xs text-gray-500 mt-2">Учитываются все 5 тестов (непройденные = 0%)</p>
          </motion.div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/50">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Результаты по каждому тесту</p>
          </div>
          {rowsForDisplay.length === 0 ? (
            <p className="p-6 text-sm text-gray-500 text-center">Пока нет записей о прохождении тестов.</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {rowsForDisplay.map((r) => {
                return (
                  <li key={r.index} className="px-4 py-3 flex items-center justify-between gap-3 text-sm">
                    <span className="text-gray-700 dark:text-gray-200 min-w-0">
                      <span className="text-gray-400 mr-2">#{r.index + 1}</span>
                      <span className="font-medium">{r.title ?? `Тест ${r.index + 1}`}</span>
                    </span>
                    <span className={`shrink-0 font-bold ${r.done ? 'text-[#40AB40]' : 'text-gray-400'}`}>{r.score_percent}%</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
