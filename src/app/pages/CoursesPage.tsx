import React, { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Clock, Users, ArrowRight, Star, Calendar, Loader2 } from 'lucide-react';
import { useEntity } from '@/app/hooks';
import { ContactForm } from '@/app/components/ContactForm';

type CourseRow = { id: number; name: string; level: string; format: string; duration: string; price: number; description: string | null; image: string | null };

export function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const navigate = useNavigate();
  const { list: coursesList, loadingList, loadingListError } = useEntity<CourseRow>('courses', {
    fetchListOnMount: true,
    listParams: { limit: 50 },
  });

  const levels = [
    { id: 'all', name: 'Все уровни' },
    { id: 'beginner', name: 'Начальный' },
    { id: 'advanced', name: 'Продвинутый' },
  ];

  const filteredCourses = useMemo(() => {
    return coursesList.filter((course) => {
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
      const matchesSearch =
        searchTerm === '' ||
        (course.name && course.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesLevel && matchesSearch;
    });
  }, [coursesList, selectedLevel, searchTerm]);

  const coursesWithDetails = useMemo(() => {
    return filteredCourses.map((course, idx) => ({
      ...course,
      students: [150, 85, 42, 68, 95, 120][idx] ?? 80,
      rating: [4.9, 5.0, 4.8, 4.9, 4.7, 4.8][idx] ?? 4.8,
    }));
  }, [filteredCourses]);

  const getCourseLinkByName = useCallback((courseName: string, fallbackId: number) => {
    const normalized = courseName.toLowerCase();
    const matched = coursesList.find((course) => course.name.toLowerCase() === normalized)
      ?? coursesList.find((course) => course.name.toLowerCase().includes(normalized) || normalized.includes(course.name.toLowerCase()));
    return `/book/course/${matched?.id ?? fallbackId}`;
  }, [coursesList]);

  if (loadingList) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#009B00] animate-spin" />
      </div>
    );
  }
  if (loadingListError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <p className="text-red-500">{loadingListError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#009B00]/5 via-white to-[#40AB40]/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero в стиле /courses/schedule */}
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
              Курсы по грумингу
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
              Станьте профессиональным грумером с нашей академией
            </p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Link
                to="/book/course"
                className="inline-flex items-center gap-2 px-10 py-4 btn-gradient-green text-white rounded-2xl font-bold text-lg shadow-lg shadow-[#40AB40]/30 hover:shadow-xl transition-shadow"
              >
                Запись на курс
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>


      {/* Filters */}
      <section className="py-8 bg-white dark:bg-gray-900 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск курсов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#009B00]"
              />
            </div>

            {/* Level Filter */}
            <div className="flex gap-2">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    selectedLevel === level.id
                      ? 'bg-[#009B00] text-white'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {level.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {coursesWithDetails.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => navigate(`/courses/${course.id}`)}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl cursor-pointer group flex flex-col h-full"
              >
                <div className="relative h-64 overflow-hidden flex-shrink-0">
                  <img
                    src={course.image ?? '/pictures/The basics of dog grooming.jpg'}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#EF476F] text-white px-4 py-2 rounded-full font-bold text-sm">
                    {course.level === 'beginner' ? 'Начальный' : 'Продвинутый'}
                  </div>
                  <div className="absolute top-4 right-4 bg-white text-[#009B00] px-4 py-2 rounded-full font-bold">
                    {course.price.toLocaleString()}₽
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col min-h-0">
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.students}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#EF476F] text-[#EF476F]" />
                      {course.rating}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{course.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        course.format === 'online'
                          ? 'bg-blue-100 text-blue-700'
                          : course.format === 'offline'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {course.format === 'online'
                        ? 'Онлайн'
                        : course.format === 'offline'
                        ? 'Очно'
                        : 'Гибрид'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-auto pt-2" onClick={(e) => e.stopPropagation()}>
                    <Link
                      to={`/courses/${course.id}`}
                      className="flex items-center gap-2 text-[#009B00] font-bold hover:gap-4 transition-all"
                    >
                      Подробнее о курсе
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to={`/book/course/${course.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-[#40AB40] hover:bg-[#89E689] text-white rounded-xl font-medium transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      Записаться
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Ближайшие старты</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Запишитесь на следующий поток прямо сейчас
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              { course: 'Основы груминга собак', date: '21 апреля 2026', spots: 12 },
              { course: 'Профессиональный груминг', date: '6 мая 2026', spots: 10 },
              { course: 'Креативный груминг', date: '10 июня 2026', spots: 15 },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-[#009B00]/10 to-[#89E689]/10 rounded-2xl p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-[#009B00] rounded-xl flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{item.course}</h3>
                    <p className="text-gray-600 dark:text-gray-300">Старт: {item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Осталось {item.spots} мест
                  </p>
                  <Link
                    to={getCourseLinkByName(item.course, index + 1)}
                    className="inline-block bg-[#009B00] text-white px-6 py-2 rounded-full font-bold hover:bg-[#40AB40] transition-colors"
                  >
                    Записаться
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />
    </div>
  );
}