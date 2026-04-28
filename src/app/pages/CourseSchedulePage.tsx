import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Users, Award, BookOpen, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useEntity } from '@/app/hooks';

type Course = { id: number; name: string; level: string; format: string; duration?: string | null; price: number; description?: string | null; image?: string | null };
type CourseSchedule = { id: number; course_id: number; start_date: string; start_time?: string | null; spots?: number | null };

const formatMap: Record<string, string> = {
  hybrid: 'Гибрид',
  online: 'Онлайн',
  offline: 'Очно',
};

export function CourseSchedulePage() {
  const [filter, setFilter] = useState<'all' | 'online' | 'offline' | 'hybrid'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { list: courses } = useEntity<Course>('courses', { fetchListOnMount: true, listParams: { limit: 200 } });
  const { list: schedules } = useEntity<CourseSchedule>('course_schedules', { fetchListOnMount: true, listParams: { limit: 300 } });

  const items = schedules.map((s) => {
    const c = courses.find((x) => x.id === s.course_id);
    return {
      id: s.id,
      courseId: s.course_id,
      name: c?.name || 'Курс',
      level: c?.level || 'beginner',
      format: c?.format || 'offline',
      duration: c?.duration || '—',
      price: c?.price || 0,
      description: c?.description || '',
      image: c?.image || '/pictures/hero-section groom room courses.jpg',
      date: s.start_date,
      time: s.start_time ? String(s.start_time).slice(0, 5) : '10:00',
      spots: s.spots ?? 0,
    };
  });

  const filtered = filter === 'all'
    ? items
    : items.filter((x) => x.format === filter);

  const byMonth = filtered.reduce<Record<string, typeof items>>((acc, item) => {
    const key = new Date(item.date).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#009B00]/5 via-white to-[#40AB40]/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative py-20 md:py-28 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#40AB40]/20 via-transparent to-[#89E689]/10 dark:from-[#40AB40]/30 dark:to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#40AB40] to-[#89E689] bg-clip-text text-transparent">
              Подробное расписание курсов
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
              Выберите удобную дату и время. В каждой карточке — полная информация о курсе и ближайшем старте.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/book/course"
                className="inline-flex items-center gap-2 px-10 py-4 btn-gradient-green text-white rounded-2xl font-bold text-lg shadow-lg shadow-[#40AB40]/30 hover:shadow-xl transition-shadow"
              >
                Записаться на курс
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-12">
        {/* Фильтр формата */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {(['all', 'online', 'offline', 'hybrid'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${
                filter === f
                  ? 'bg-[#40AB40] text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {f === 'all' ? 'Все' : formatMap[f]}
            </button>
            ))}
        </motion.div>

        {/* Карточки по месяцам */}
        <div className="max-w-4xl mx-auto space-y-10">
          <AnimatePresence mode="wait">
            {Object.entries(byMonth).map(([month, list]) => (
              <motion.section
                key={month}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-[#40AB40]">{month}</h2>
                <div className="space-y-4">
                  {list.map((item) => {
                    const open = expandedId === item.id;
                    return (
                      <motion.article
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-2 border-[#40AB40]/20"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-48 flex-shrink-0">
                            <img
                              src={item.image}
                              alt=""
                              className="w-full h-36 sm:h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#40AB40]/20 text-[#40AB40]">
                                {item.level === 'beginner' ? 'Начальный' : 'Продвинутый'}
                              </span>
                              <span className="px-3 py-1 rounded-full text-sm bg-gray-200 dark:bg-gray-700">
                                {formatMap[item.format]}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                              {item.description}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(item.date).toLocaleDateString('ru-RU')} в {item.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                {item.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                Осталось {item.spots} мест
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-2xl font-bold text-[#40AB40]">
                                {item.price.toLocaleString()} ₽
                              </span>
                              <Link
                                to={`/book/course/${item.courseId}`}
                                className="inline-flex items-center gap-2 px-5 py-2.5 btn-gradient-green text-white rounded-xl font-medium"
                              >
                                Записаться
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                              <Link
                                to={`/courses/${item.courseId}`}
                                className="inline-flex items-center gap-2 text-[#40AB40] font-medium hover:underline"
                              >
                                Подробнее о курсе
                              </Link>
                              <button
                                type="button"
                                onClick={() => setExpandedId(open ? null : item.id)}
                                className="inline-flex items-center gap-1 text-gray-500 hover:text-[#40AB40]"
                              >
                                {open ? (
                                  <>
                                    Свернуть
                                    <ChevronUp className="w-4 h-4" />
                                  </>
                                ) : (
                                  <>
                                    Ещё информация
                                    <ChevronDown className="w-4 h-4" />
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                        <AnimatePresence>
                          {open && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6 pt-0 border-t border-gray-200 dark:border-gray-700 mt-0 pt-4">
                                <div className="flex items-center gap-2 text-[#40AB40] mb-2">
                                  <Award className="w-5 h-5" />
                                  <span className="font-medium">Что входит</span>
                                </div>
                                <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  <li>• Теоретические модули и практика</li>
                                  <li>• Сертификат по окончании</li>
                                  <li>• Доступ к материалам</li>
                                  <li>• Поддержка преподавателей</li>
                                </ul>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.article>
                    );
                  })}
                </div>
              </motion.section>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
