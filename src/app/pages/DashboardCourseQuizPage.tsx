import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useEntity } from '@/app/hooks';
import { buildCourseTopicTests } from '@/app/lib/courseStudentDashboard';
import { persistQuizCourseProgress } from '@/app/lib/quizProgress';
import { persistQuizTestResult } from '@/app/lib/quizTestResult';

type CourseBookingRow = {
  id: number;
  user_id: number;
  course_id: number;
  status: string;
};
type CourseRow = { id: number; name: string };
type ModuleRow = { id: number; course_id: number; title: string };

type Q = { text: string; options: string[]; correct: number };

function buildQuestions(courseName: string, testTitle: string, seed: number): Q[] {
  const t = testTitle.toLowerCase();
  const pool: Q[] = [
    {
      text: `В контексте курса «${courseName}», что важнее всего зафиксировать перед практикой на животной модели?`,
      options: [
        'Только длину шерсти',
        'Состояние кожи, шерсти, поведение питомца и согласование с куратором',
        'Только породу питомца',
        'Только стоимость расходников',
      ],
      correct: 1,
    },
    {
      text: 'Какой подход к инструментам наиболее безопасный при обучении?',
      options: [
        'Использовать любые ножницы, если они острые',
        'Подбирать инструмент под тип шерсти, регулярно проверять кромку и хранение',
        'Делиться одним инструментом между всеми участниками',
        'Работать без расчёски, если шерсть короткая',
      ],
      correct: 1,
    },
    {
      text: 'Если питомец тревожится во время процедуры, что из перечисленного соответствует профессиональной этике?',
      options: [
        'Ускорить процедуру силой',
        'Сделать паузу, снизить стимулы, при необходимости остановить занятие и обсудить с преподавателем',
        'Игнорировать поведение',
        'Полностью отменить курс',
      ],
      correct: 1,
    },
    {
      text: `Как лучше готовиться к проверке знаний по теме «${testTitle}»?`,
      options: [
        'Выучить ответы наизусть без понимания',
        'Повторить конспект, отметить неясные места и задать вопросы куратору',
        'Пропустить теорию и прийти только на практику',
        'Смотреть только видео на ускоренной скорости',
      ],
      correct: 1,
    },
    {
      text: 'Что из перечисленного относится к санитарным нормам в учебном кабинете?',
      options: [
        'Работа без мытья рук между разными питомцами',
        'Дезинфекция поверхностей, смена полотенец, соблюдение очередности обработки',
        'Хранение личной еды на рабочем столе',
        'Использование одних перчаток весь день без смены',
      ],
      correct: 1,
    },
    {
      text: `В теме «${t.slice(0, 40)}…» акцент на самопроверке означает:`,
      options: [
        'Сверять шаги с чек-листом курса и отмечать типичные ошибки',
        'Не вести записи',
        'Полагаться только на случайный результат',
        'Избегать обратной связи преподавателя',
      ],
      correct: 0,
    },
  ];
  const out: Q[] = [];
  for (let i = 0; i < 5; i++) {
    out.push(pool[(seed + i) % pool.length]);
  }
  return out;
}

export function DashboardCourseQuizPage() {
  const { courseId: courseIdParam, testIndex: testIndexParam } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const courseId = courseIdParam ? parseInt(courseIdParam, 10) : NaN;
  const testIndex = testIndexParam ? parseInt(testIndexParam, 10) : NaN;

  const { list: bookings, loadingList: loadingBookings } = useEntity<CourseBookingRow>('course_bookings', {
    fetchListOnMount: !!user,
    listParams: { limit: 100 },
    enabled: !!user,
  });
  const { item: course, loadingItem: loadingCourse } = useEntity<CourseRow>('courses', {
    fetchListOnMount: false,
    fetchItemOnMount: !!courseId && !Number.isNaN(courseId),
    id: Number.isNaN(courseId) ? null : courseId,
    enabled: !!courseId && !Number.isNaN(courseId),
  });
  const { list: modules, refetchList: refetchModules } = useEntity<ModuleRow>('course_modules', {
    fetchListOnMount: false,
    enabled: !!courseId && !Number.isNaN(courseId),
  });

  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [savingProgress, setSavingProgress] = useState(false);

  useEffect(() => {
    if (courseId && !Number.isNaN(courseId)) void refetchModules({ course_id: courseId, limit: 40 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const moduleTitles = useMemo(
    () => modules.filter((m) => m.course_id === courseId).map((m) => m.title),
    [modules, courseId]
  );
  const tests = useMemo(
    () => (course?.name ? buildCourseTopicTests(course.name, moduleTitles) : []),
    [course?.name, moduleTitles]
  );
  const currentMeta = tests[testIndex];
  const questions = useMemo(
    () => (currentMeta && course?.name ? buildQuestions(course.name, currentMeta.title, testIndex) : []),
    [currentMeta, course?.name, testIndex]
  );

  const myPaid = bookings.filter((b) => b.user_id === user?.id && b.course_id === courseId && b.status === 'оплачен');
  const testsReady = Boolean(course?.name && tests.length > 0);
  const indexOk = testIndex >= 0 && testIndex < tests.length;
  const allowed = myPaid.length > 0 && user && !Number.isNaN(courseId) && !Number.isNaN(testIndex) && testsReady && indexOk;

  if (!user) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Войдите в аккаунт, чтобы проходить тесты курса.</p>
        <Link to="/dashboard/my-courses" className="text-[#40AB40] font-medium mt-2 inline-block">
          Назад к курсу
        </Link>
      </div>
    );
  }

  if (loadingBookings || (Number.isFinite(courseId) && loadingCourse && !course)) {
    return (
      <div className="p-16 flex justify-center">
        <Loader2 className="w-10 h-10 text-[#40AB40] animate-spin" />
      </div>
    );
  }

  if (!allowed || !currentMeta || questions.length === 0) {
    return (
      <div className="p-8 max-w-lg">
        <p className="text-gray-700 dark:text-gray-200 mb-4">Тест недоступен: нет оплаченной записи на этот курс или неверная ссылка.</p>
        <Link to="/dashboard/my-courses" className="text-[#40AB40] font-semibold">
          ← Мои курсы
        </Link>
      </div>
    );
  }

  const q = questions[step];
  const isLast = step >= questions.length - 1;

  const onPick = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.correct) setScore((s) => s + 1);
  };

  const next = async () => {
    if (picked === null) return;
    if (isLast) {
      const testPercent = Math.round((score / questions.length) * 100);
      const booking = myPaid[0];
      if (user && booking) {
        setSavingProgress(true);
        const err = await persistQuizCourseProgress({
          courseId,
          userId: user.id,
          courseBookingId: booking.id,
          testPercent,
        });
        const errQuiz = await persistQuizTestResult({
          userId: user.id,
          courseId,
          testIndex,
          scorePercent: testPercent,
        });
        setSavingProgress(false);
        if (err) console.warn(err);
        if (errQuiz) console.warn(errQuiz);
      }
      setFinished(true);
      return;
    }
    setStep((s) => s + 1);
    setPicked(null);
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <button
        type="button"
        onClick={() => navigate('/dashboard/my-courses')}
        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#40AB40] mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Мои курсы
      </button>

      <div className="rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-[#40AB40]/20 p-6 md:p-8">
        <p className="text-xs uppercase tracking-wide text-[#40AB40] font-semibold mb-1">Тест по курсу</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{course?.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">{currentMeta.title}</p>

        {finished ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-[#40AB40] mx-auto mb-4" />
            <p className="text-xl font-bold mb-2">Готово</p>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Верных ответов: {score} из {questions.length}
            </p>
            <p className="text-sm text-[#40AB40] font-medium mb-6">
              Результат теста: {Math.round((score / questions.length) * 100)}% — прогресс по курсу обновлён в базе данных.
            </p>
            <Link
              to="/dashboard/my-courses"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#40AB40] text-white font-semibold hover:bg-[#359635] transition-colors"
            >
              Вернуться к курсу
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-between text-xs text-gray-500 mb-4">
              <span>
                Вопрос {step + 1} / {questions.length}
              </span>
              <span>Набрано баллов: {score}</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="space-y-4"
              >
                <p className="text-lg font-medium text-gray-800 dark:text-gray-100 leading-snug">{q.text}</p>
                <ul className="space-y-2">
                  {q.options.map((opt, idx) => {
                    const show = picked !== null;
                    const correct = idx === q.correct;
                    const wrong = show && picked === idx && !correct;
                    return (
                      <li key={idx}>
                        <button
                          type="button"
                          disabled={picked !== null}
                          onClick={() => onPick(idx)}
                          className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm ${
                            show && correct
                              ? 'border-[#40AB40] bg-[#40AB40]/15 text-[#2d8a2d]'
                              : wrong
                              ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                              : 'border-gray-200 dark:border-gray-600 hover:border-[#40AB40]/50 dark:hover:border-[#40AB40]/40'
                          }`}
                        >
                          {opt}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                disabled={picked === null || savingProgress}
                onClick={() => void next()}
                className="px-6 py-2.5 rounded-xl bg-[#40AB40] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#359635] inline-flex items-center gap-2"
              >
                {savingProgress ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isLast ? (savingProgress ? 'Сохранение…' : 'Завершить') : 'Далее'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
