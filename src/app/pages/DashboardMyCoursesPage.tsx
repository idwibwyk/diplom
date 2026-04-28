import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, CalendarDays, ChevronDown, ClipboardList, GraduationCap, Megaphone, Play, Sparkles, Trophy } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useEntity } from '@/app/hooks';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/app/api/client';
import { homeworkFromBooking } from '@/app/lib/learnerBookingFields';
import {
  buildCourseTopicTests,
  difficultyBarsFromLevel,
  difficultyTierFromLevel,
  DIFFICULTY_BAR_CLASS,
} from '@/app/lib/courseStudentDashboard';

type CourseBookingRow = {
  id: number;
  user_id: number;
  course_id: number;
  course_schedule_id: number | null;
  master_id: number | null;
  status: string;
  notes: string | null;
};
type CourseRow = {
  id: number;
  name: string;
  description: string | null;
  duration: string | null;
  format: string;
  price: number;
  level?: string | null;
};
type CourseScheduleRow = { id: number; course_id: number; start_date: string; start_time: string | null };
type MasterRow = { id: number; full_name: string; image: string | null; user_id?: number | null };
type CourseInstructorRow = { id: number; course_id: number; master_id: number };
type ModuleRow = { id: number; course_id: number; title: string; sort_order: number };
type QuizResultRow = { id: number; user_id: number; course_id: number; test_index: number; score_percent: number };
type ContentRow = {
  id: number;
  module_id: number;
  title: string;
  type: string;
  content: string | null;
  duration_minutes: number | null;
  sort_order: number;
};

function initials(name: string) {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return '?';
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[1][0]).toUpperCase();
}

export function DashboardMyCoursesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { list: bookings } = useEntity<CourseBookingRow>('course_bookings', { fetchListOnMount: !!user, listParams: { limit: 100 } });
  const { list: courses } = useEntity<CourseRow>('courses', { fetchListOnMount: true, listParams: { limit: 100 } });
  const { list: schedules } = useEntity<CourseScheduleRow>('course_schedules', { fetchListOnMount: true, listParams: { limit: 200 } });
  const { list: masters } = useEntity<MasterRow>('masters', { fetchListOnMount: true, listParams: { limit: 100 } });
  const { list: quizResults } = useEntity<QuizResultRow>('user_course_quiz_results', { fetchListOnMount: !!user, listParams: { limit: 500 } });
  const { list: instructors, refetchList: refetchInstructors } = useEntity<CourseInstructorRow>('course_instructors', {
    fetchListOnMount: false,
    enabled: false,
  });
  const { list: modules, refetchList: refetchModules } = useEntity<ModuleRow>('course_modules', {
    fetchListOnMount: false,
    enabled: false,
  });
  const { list: allContent } = useEntity<ContentRow>('course_content', {
    fetchListOnMount: true,
    listParams: { limit: 200 },
  });
  const [unreadByUserId, setUnreadByUserId] = useState<Record<number, number>>({});
  const [hasHomeworkDot, setHasHomeworkDot] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const myBookings = bookings.filter((b) => b.user_id === user?.id);
  const paidBookings = myBookings.filter((b) => b.status === 'оплачен');
  const paidCourseIds = useMemo(() => Array.from(new Set(paidBookings.map((b) => b.course_id))), [paidBookings]);
  useEffect(() => {
    if (paidCourseIds.length === 0) {
      setSelectedCourseId(null);
      return;
    }
    if (selectedCourseId == null || !paidCourseIds.includes(selectedCourseId)) {
      setSelectedCourseId(paidCourseIds[0]);
    }
  }, [paidCourseIds, selectedCourseId]);
  const paidBooking = selectedCourseId != null ? paidBookings.find((b) => b.course_id === selectedCourseId) ?? paidBookings[0] : paidBookings[0];
  const activeBooking = paidBooking ?? myBookings[0];
  const activeCourseId = activeBooking?.course_id;

  const activeCourse = activeCourseId != null ? courses.find((c) => c.id === activeCourseId) : undefined;
  const activeSchedule =
    activeBooking?.course_schedule_id != null
      ? schedules.find((s) => s.id === activeBooking.course_schedule_id)
      : undefined;
  const isPaid = activeBooking?.status === 'оплачен';

  const leadInstructorMasterId =
    activeCourseId != null
      ? instructors.find((i) => i.course_id === activeCourseId)?.master_id ?? activeBooking?.master_id
      : undefined;
  const activeMaster = leadInstructorMasterId != null ? masters.find((m) => m.id === leadInstructorMasterId) : undefined;
  const activeMasterUnread = activeMaster?.user_id != null ? unreadByUserId[activeMaster.user_id] ?? 0 : 0;

  useEffect(() => {
    if (!activeCourseId) return;
    void (async () => {
      await refetchInstructors({ course_id: activeCourseId, limit: 20 });
      await refetchModules({ course_id: activeCourseId, limit: 40 });
    })();
    // refetch* из useEntity нестабильны по ссылке — оставляем только course_id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCourseId]);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const res = await api.get<{ success?: boolean; data?: Array<{ sender_id: number; unread_count: number }> }>('/conversations/unread-summary');
      if ('error' in res) return;
      const rows = Array.isArray(res.data?.data) ? res.data.data : [];
      const next: Record<number, number> = {};
      for (const r of rows) next[r.sender_id] = r.unread_count;
      setUnreadByUserId(next);

      const submissionRes = await api.get<{ success?: boolean; data?: Array<{ course_id: number }> }>('/course_homework_submissions/mine');
      const submitted = new Set(
        'error' in submissionRes ? [] : (Array.isArray(submissionRes.data?.data) ? submissionRes.data.data.map((s) => s.course_id) : [])
      );
      const myPaid = bookings.filter((b) => b.user_id === user.id && b.status === 'оплачен');
      const pending = myPaid.some((b) => homeworkFromBooking(b).length > 0 && !submitted.has(b.course_id));
      setHasHomeworkDot(pending);
    })();
  }, [user, bookings]);

  const courseModules = useMemo(() => {
    if (!activeCourseId) return [];
    return modules
      .filter((m) => m.course_id === activeCourseId)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [modules, activeCourseId]);

  const moduleIds = useMemo(() => new Set(courseModules.map((m) => m.id)), [courseModules]);

  const courseMaterials = useMemo(
    () => allContent.filter((c) => moduleIds.has(c.module_id)).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [allContent, moduleIds]
  );

  const topicTests = useMemo(
    () => (activeCourse?.name ? buildCourseTopicTests(activeCourse.name, courseModules.map((m) => m.title)) : []),
    [activeCourse?.name, courseModules]
  );
  const courseProgress = useMemo(() => {
    if (!activeCourseId || !user?.id || topicTests.length === 0) return 0;
    const scoreByIndex = new Map<number, number>();
    for (const row of quizResults) {
      if (row.user_id === user.id && row.course_id === activeCourseId) scoreByIndex.set(row.test_index, row.score_percent);
    }
    const sum = topicTests.reduce((acc, t) => acc + (scoreByIndex.get(t.index) ?? 0), 0);
    return Math.round(sum / topicTests.length);
  }, [activeCourseId, user?.id, quizResults, topicTests]);

  const difficultyCount = difficultyBarsFromLevel(activeCourse?.level ?? undefined);
  const tier = difficultyTierFromLevel(activeCourse?.level ?? undefined);
  const barCls = DIFFICULTY_BAR_CLASS[tier];

  const cardBase =
    'group relative block rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 pt-14 pb-5 px-4 shadow-md transition-all duration-300 hover:border-[#40AB40] hover:bg-gradient-to-br hover:from-[#40AB40] hover:to-[#5cbd5c] hover:shadow-xl hover:text-white';

  if (myBookings.length === 0) {
    return (
      <div className="p-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-lg border-2 border-[#40AB40]/20 text-center">
          <h1 className="text-3xl font-bold mb-3">Мои курсы</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">У вас еще нет записей на курс, запишитесь на курс.</p>
          <Link
            to="/book/course"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#40AB40] hover:bg-[#89E689] text-white rounded-xl font-bold transition-colors"
          >
            <GraduationCap className="w-5 h-5" />
            Записаться на курс
          </Link>
        </div>
      </div>
    );
  }

  if (!activeBooking) {
    return null;
  }

  if (!isPaid) {
    return (
      <div className="p-8 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-2 border-[#40AB40]/20">
          <h1 className="text-3xl font-bold mb-2">Мои курсы</h1>
          <h2 className="text-xl font-semibold mb-2">{activeCourse?.name ?? 'Выбранный курс'}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">Вы записаны на курс. Ожидайте подтверждения администратора.</p>
          <p className="text-sm text-gray-500">Текущий статус: {activeBooking.status}</p>
          <p className="text-sm text-gray-500 mt-1">
            Старт: {activeSchedule ? new Date(activeSchedule.start_date).toLocaleDateString('ru-RU') : '—'}
            {activeSchedule?.start_time ? ` в ${activeSchedule.start_time.slice(0, 5)}` : ''}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 min-h-full">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a6b1a] via-[#40AB40] to-[#89E689] text-white shadow-xl p-6 md:p-10">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,white,transparent_45%)]" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex items-center gap-5">
            <div
              className="relative h-24 w-24 shrink-0 rounded-full p-[3px]"
              style={{
                background: `conic-gradient(from -90deg, rgba(255,255,255,0.95) ${Math.min(100, courseProgress)}%, rgba(255,255,255,0.2) 0)`,
              }}
            >
              <div className="h-full w-full rounded-full bg-[#0f3d0f]/90 flex items-center justify-center overflow-hidden border-2 border-white/30">
                <span className="text-2xl font-bold text-white">{initials(user?.name ?? 'У')}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-white/80">Студент</p>
              <h1 className="text-2xl md:text-3xl font-bold">{user?.name ?? 'Пользователь'}</h1>
              <p className="text-white/90 mt-1 text-sm md:text-base">{activeCourse?.name ?? 'Курс'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-8 lg:gap-12">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/70 mb-1">Выполнение курса</p>
              <p className="text-4xl md:text-5xl font-extrabold tabular-nums">{courseProgress}%</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/70 mb-2">Сложность курса</p>
              <div className="flex items-end gap-1 h-14">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 rounded-full transition-all ${i < difficultyCount ? barCls.filled : barCls.muted}`}
                    style={{ height: `${40 + i * 14}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs uppercase tracking-wider text-white/70 mb-1">Формат</p>
              <p className="text-lg font-semibold max-w-[10rem] leading-tight">{activeCourse?.format ?? '—'}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,240px)_1fr_1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md p-4">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Нужна помощь?</h2>
            {activeMaster ? (
              <>
                {activeMaster.user_id != null ? (
                  <Link
                    to={`/dashboard/my-courses/chat?masterId=${activeMaster.id}`}
                    className="relative inline-flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-[#40AB40] hover:bg-[#359635] text-white text-sm font-semibold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Связаться в чате
                    {activeMasterUnread > 0 ? (
                      <span
                        className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-white dark:border-gray-800"
                        title="Есть непрочитанные сообщения"
                      />
                    ) : null}
                  </Link>
                ) : (
                  <p className="text-xs text-amber-700 dark:text-amber-300 mb-2">Чат недоступен: у мастера нет учётной записи в системе.</p>
                )}
                <p className="text-center text-xs font-medium text-gray-800 dark:text-gray-100 mt-2">
                  {activeMaster.full_name}
                  {activeMasterUnread > 0 ? <span className="ml-1 inline-block h-2.5 w-2.5 rounded-full bg-red-500 align-middle" /> : null}
                </p>
              </>
            ) : (
              <p className="text-xs text-amber-700 dark:text-amber-300">Преподаватель назначается.</p>
            )}
          </div>
          {paidCourseIds.length > 0 ? (
            <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md p-4">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Выбранный курс</h2>
              <div className="relative">
                <select
                  value={selectedCourseId ?? ''}
                  onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                  className="appearance-none w-full rounded-xl border border-[#40AB40]/35 bg-gradient-to-r from-white to-emerald-50/40 dark:from-gray-900 dark:to-gray-900 px-3 py-2.5 pr-9 text-sm font-medium text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#40AB40]/30"
                >
                  {paidCourseIds.map((cid) => {
                    const c = courses.find((x) => x.id === cid);
                    return (
                      <option key={cid} value={cid}>
                        {c?.name ?? `Курс #${cid}`}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#40AB40]" />
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl bg-white dark:bg-gray-800 border border-dashed border-[#40AB40]/30 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2 text-[#40AB40]">
              <BookOpen className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wide">Быстрые разделы</h3>
            </div>
            <nav className="flex flex-col gap-1.5 text-xs">
              <Link className="text-gray-700 dark:text-gray-200 hover:text-[#40AB40] py-1" to="/dashboard/my-courses/homework">
                Домашнее задание
                {hasHomeworkDot ? <span className="ml-1 inline-block h-2.5 w-2.5 rounded-full bg-red-500 align-middle" /> : null}
              </Link>
              <Link className="text-gray-700 dark:text-gray-200 hover:text-[#40AB40] py-1" to="/dashboard/my-courses/schedule">
                Расписание
              </Link>
              <Link className="text-gray-700 dark:text-gray-200 hover:text-[#40AB40] py-1" to="/dashboard/my-courses/news">
                Новости курса
              </Link>
              <Link className="text-gray-700 dark:text-gray-200 hover:text-[#40AB40] py-1" to="/dashboard/my-courses/progress">
                Прогресс
              </Link>
            </nav>
            {activeCourse?.description ? (
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-3 line-clamp-5 border-t border-gray-100 dark:border-gray-700 pt-2 leading-snug">
                {activeCourse.description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Тесты</h2>
            <span className="text-xs font-medium text-[#40AB40] bg-[#40AB40]/10 px-2 py-1 rounded-lg">{topicTests.length} тем</span>
          </div>
          <ul className="space-y-3">
            {topicTests.map((t) => (
              <li key={t.index}>
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/my-courses/quiz/${activeBooking.course_id}/${t.index}`)}
                  className="w-full flex items-center gap-3 text-left rounded-xl border border-gray-100 dark:border-gray-600 px-3 py-3 hover:border-[#40AB40]/50 hover:bg-[#40AB40]/5 transition-colors group"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#40AB40]/15 text-[#40AB40] group-hover:bg-[#40AB40] group-hover:text-white transition-colors">
                    <Play className="w-4 h-4" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-medium text-gray-900 dark:text-white text-sm leading-snug">{t.title}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{t.durationMin} мин</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Учебные материалы</h2>
            <span className="text-xs text-gray-500">{courseMaterials.length}</span>
          </div>
          {courseMaterials.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Материалы курса в каталоге пока не добавлены.</p>
          ) : (
            <ul className="space-y-3">
              {courseMaterials.map((row, idx) => {
                const colors = ['bg-rose-500', 'bg-teal-500', 'bg-amber-400', 'bg-violet-500'];
                const dot = colors[idx % colors.length];
                return (
                  <li key={row.id}>
                    <Link
                      to={`/dashboard/my-courses/material/${row.id}`}
                      className="w-full flex items-center gap-3 text-left rounded-xl border border-gray-100 dark:border-gray-600 px-3 py-3 hover:border-[#40AB40]/50 hover:bg-[#40AB40]/5 transition-colors"
                    >
                      <span className={`h-10 w-1.5 rounded-full ${dot}`} />
                      <span className="flex-1 min-w-0">
                        <span className="block font-medium text-gray-900 dark:text-white text-sm leading-snug">{row.title}</span>
                        <span className="text-xs text-gray-500 capitalize">{row.type}</span>
                      </span>
                      <Play className="w-4 h-4 text-gray-400 shrink-0" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link to="/dashboard/my-courses/progress" className={cardBase}>
          <Trophy className="absolute left-5 top-5 w-8 h-8 text-[#40AB40] group-hover:text-white transition-colors" />
          <div className="text-center">
            <p className="text-xs uppercase tracking-wide text-gray-500 group-hover:text-white/90">Рейтинг / прогресс</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-white mt-1">{courseProgress}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 group-hover:text-white/85">Подробнее</p>
          </div>
        </Link>
        <Link to="/dashboard/my-courses/homework" className={cardBase}>
          <ClipboardList className="absolute left-5 top-5 w-8 h-8 text-[#40AB40] group-hover:text-white transition-colors" />
          {hasHomeworkDot ? <span className="absolute right-4 top-4 h-3 w-3 rounded-full bg-red-500 border-2 border-white dark:border-gray-800" /> : null}
          <div className="text-center">
            <p className="text-xs uppercase tracking-wide text-gray-500 group-hover:text-white/90">Домашнее задание</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-2 group-hover:text-white">Открыть</p>
          </div>
        </Link>
        <Link to="/dashboard/my-courses/schedule" className={cardBase}>
          <CalendarDays className="absolute left-5 top-5 w-8 h-8 text-[#40AB40] group-hover:text-white transition-colors" />
          <div className="text-center">
            <p className="text-xs uppercase tracking-wide text-gray-500 group-hover:text-white/90">Расписание занятий</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-2 group-hover:text-white">Открыть</p>
          </div>
        </Link>
        <Link to="/dashboard/my-courses/news" className={cardBase}>
          <Megaphone className="absolute left-5 top-5 w-8 h-8 text-[#40AB40] group-hover:text-white transition-colors" />
          <div className="text-center">
            <p className="text-xs uppercase tracking-wide text-gray-500 group-hover:text-white/90">Доска объявлений</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-2 group-hover:text-white">Открыть</p>
          </div>
        </Link>
      </div>

    </div>
  );
}
