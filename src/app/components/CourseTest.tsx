import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Question {
  id: number;
  question: string;
  options: Array<{ value: string; label: string; score: Record<string, number> }>;
}

const questions: Question[] = [
  {
    id: 1,
    question: 'Какой у вас опыт в груминге?',
    options: [
      { value: 'none', label: 'Нет опыта, только начинаю', score: { beginner: 3, advanced: 0 } },
      { value: 'little', label: 'Немного опыта, стригу своих питомцев', score: { beginner: 2, advanced: 1 } },
      { value: 'some', label: 'Есть опыт, работал с несколькими породами', score: { beginner: 1, advanced: 2 } },
      { value: 'professional', label: 'Профессиональный грумер', score: { beginner: 0, advanced: 3 } },
    ],
  },
  {
    id: 2,
    question: 'Какая ваша основная цель обучения?',
    options: [
      { value: 'hobby', label: 'Хобби, уход за своими питомцами', score: { beginner: 2, advanced: 0 } },
      { value: 'career', label: 'Начать карьеру грумера', score: { beginner: 3, advanced: 1 } },
      { value: 'improve', label: 'Улучшить навыки, расширить знания', score: { beginner: 1, advanced: 3 } },
      { value: 'business', label: 'Открыть свой салон', score: { beginner: 0, advanced: 3 } },
    ],
  },
  {
    id: 3,
    question: 'Какой формат обучения вам удобнее?',
    options: [
      { value: 'online', label: 'Онлайн, в удобное время', score: { beginner: 2, advanced: 1 } },
      { value: 'offline', label: 'Очно, с практикой', score: { beginner: 3, advanced: 2 } },
      { value: 'hybrid', label: 'Гибридный формат', score: { beginner: 2, advanced: 3 } },
    ],
  },
  {
    id: 4,
    question: 'Сколько времени вы готовы уделять обучению в неделю?',
    options: [
      { value: '5h', label: '5-10 часов', score: { beginner: 2, advanced: 1 } },
      { value: '15h', label: '15-20 часов', score: { beginner: 3, advanced: 2 } },
      { value: '30h', label: '30+ часов', score: { beginner: 1, advanced: 3 } },
    ],
  },
  {
    id: 5,
    question: 'Какой у вас бюджет на обучение?',
    options: [
      { value: 'low', label: 'До 30 000₽', score: { beginner: 3, advanced: 0 } },
      { value: 'medium', label: '30 000 - 50 000₽', score: { beginner: 2, advanced: 2 } },
      { value: 'high', label: '50 000+₽', score: { beginner: 1, advanced: 3 } },
    ],
  },
  {
    id: 6,
    question: 'Какие породы вас интересуют больше всего?',
    options: [
      { value: 'small', label: 'Мелкие породы (йорки, шпицы)', score: { beginner: 3, advanced: 1 } },
      { value: 'medium', label: 'Средние породы (пудели, ретриверы)', score: { beginner: 2, advanced: 2 } },
      { value: 'all', label: 'Все породы', score: { beginner: 1, advanced: 3 } },
    ],
  },
  {
    id: 7,
    question: 'Нужна ли вам помощь с трудоустройством?',
    options: [
      { value: 'yes', label: 'Да, очень нужна', score: { beginner: 3, advanced: 1 } },
      { value: 'maybe', label: 'Было бы полезно', score: { beginner: 2, advanced: 2 } },
      { value: 'no', label: 'Нет, не нужна', score: { beginner: 1, advanced: 3 } },
    ],
  },
  {
    id: 8,
    question: 'Какой результат вы хотите получить?',
    options: [
      { value: 'basics', label: 'Базовые навыки груминга', score: { beginner: 3, advanced: 0 } },
      { value: 'professional', label: 'Профессиональный уровень', score: { beginner: 1, advanced: 3 } },
      { value: 'specialization', label: 'Узкая специализация', score: { beginner: 0, advanced: 3 } },
    ],
  },
];

const courses = [
  {
    id: 1,
    name: 'Основы груминга собак',
    level: 'beginner',
    price: 35000,
    duration: '3 месяца',
    description: 'Идеально для начинающих. Полный курс от основ до первых стрижек.',
    match: 0,
  },
  {
    id: 2,
    name: 'Профессиональный груминг',
    level: 'advanced',
    price: 65000,
    duration: '6 месяцев',
    description: 'Для тех, кто хочет стать профессионалом. Углубленная программа.',
    match: 0,
  },
  {
    id: 3,
    name: 'Креативный груминг',
    level: 'advanced',
    price: 28000,
    duration: '1 месяц',
    description: 'Специализация на дизайнерских стрижках и креативных решениях.',
    match: 0,
  },
];

export function CourseTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<typeof courses | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateResults();
      }
    }, 300);
  };

  const calculateResults = () => {
    let beginnerScore = 0;
    let advancedScore = 0;

    questions.forEach((question) => {
      const answer = answers[question.id];
      const option = question.options.find((opt) => opt.value === answer);
      if (option) {
        beginnerScore += option.score.beginner || 0;
        advancedScore += option.score.advanced || 0;
      }
    });

    const calculatedCourses = courses.map((course) => {
      let match = 0;
      if (course.level === 'beginner') {
        match = Math.min(100, Math.round((beginnerScore / 20) * 100));
      } else {
        match = Math.min(100, Math.round((advancedScore / 20) * 100));
      }
      return { ...course, match };
    });

    const sortedCourses = calculatedCourses
      .sort((a, b) => b.match - a.match)
      .slice(0, 3);

    setResults(sortedCourses);
    setIsComplete(true);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
    setIsComplete(false);
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isComplete && results) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-[#009B00] to-[#89E689] rounded-2xl p-8 text-white"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Ваши рекомендации</h2>
          <p className="text-xl opacity-90">
            На основе ваших ответов мы подобрали курсы специально для вас
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {results.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{course.name}</h3>
                  <p className="opacity-90 mb-2">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{course.duration}</span>
                    <span>•</span>
                    <span>{course.price.toLocaleString()}₽</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold mb-1">{course.match}%</div>
                  <div className="text-sm opacity-75">совпадение</div>
                </div>
              </div>
              <Link
                to={`/courses/${course.id}`}
                className="inline-flex items-center gap-2 bg-white text-[#009B00] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Подробнее о курсе
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={resetTest}
            className="inline-flex items-center gap-2 bg-white text-[#009B00] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
          >
            Пройти тест заново
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">Какой курс вам подходит?</h2>
          <span className="text-gray-500 dark:text-gray-400">
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-[#009B00] to-[#89E689] h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-2xl font-bold mb-6">{currentQ.question}</h3>
          <div className="space-y-4">
            {currentQ.options.map((option, index) => (
              <motion.button
                key={option.value}
                onClick={() => handleAnswer(currentQ.id, option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[currentQ.id] === option.value
                    ? 'border-[#009B00] bg-[#89E689]/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-[#009B00]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQ.id] === option.value
                        ? 'border-[#009B00] bg-[#009B00]'
                        : 'border-gray-300'
                    }`}
                  >
                    {answers[currentQ.id] === option.value && (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium">{option.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
