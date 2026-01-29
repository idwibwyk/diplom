import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Clock,
  DollarSign,
  Users,
  Award,
  BookOpen,
  PlayCircle,
  CheckCircle,
  Star,
  Calendar,
  FileText,
  Video,
} from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';
import { ContactForm } from '@/app/components/ContactForm';
import { FavoriteButton } from '@/app/components/FavoriteButton';
import { courses as allCourses, masters } from '@/app/data/mockData';

const extendedMock: Record<number, { program: any[]; instructor: any; reviews: any[]; bonuses: string[]; demoLesson: any }> = {
  1: {
    program: [
      { id: 1, name: 'Модуль 1: Введение в груминг', lessons: [{ id: 1, name: 'История груминга', duration: '30 мин', type: 'video' }, { id: 2, name: 'Этика работы с животными', duration: '45 мин', type: 'video' }, { id: 3, name: 'Безопасность в работе', duration: '40 мин', type: 'article' }], progress: 0 },
      { id: 2, name: 'Модуль 2: Инструменты и оборудование', lessons: [{ id: 4, name: 'Виды ножниц и их применение', duration: '50 мин', type: 'video' }, { id: 5, name: 'Машинки для стрижки', duration: '45 мин', type: 'video' }, { id: 6, name: 'Расчески и щетки', duration: '30 мин', type: 'article' }], progress: 0 },
      { id: 3, name: 'Модуль 3: Практика стрижки', lessons: [{ id: 7, name: 'Стрижка мелких пород', duration: '60 мин', type: 'video' }, { id: 8, name: 'Практическое занятие', duration: '120 мин', type: 'practice' }], progress: 0 },
    ],
    instructor: { name: 'Анна Петрова', experience: '10 лет', specialization: 'Мелкие породы, декоративные стрижки', rating: 4.9, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
    reviews: [{ id: 1, author: 'Мария Иванова', rating: 5, text: 'Отличный курс! Всё понятно объясняется, много практики. Рекомендую!', date: '2026-01-10' }, { id: 2, author: 'Иван Соколов', rating: 5, text: 'После курса сразу начал работать. Преподаватель очень опытный.', date: '2026-01-05' }],
    bonuses: ['Доступ к библиотеке знаний на 1 год', 'Сертификат по окончании', 'Помощь с трудоустройством', 'Доступ к закрытому сообществу'],
    demoLesson: { id: 1, name: 'Введение в груминг', duration: '30 мин', type: 'video' },
  },
};

function getExtended(id: number) {
  return extendedMock[id] ?? extendedMock[1];
}

export function CourseDetailPage() {
  const { id } = useParams();
  const [reviewIndex, setReviewIndex] = useState(0);
  const cid = parseInt(id || '1', 10);
  const base = allCourses.find((c) => c.id === cid) ?? allCourses[0];
  const ext = getExtended(base.id);
  const course = {
    ...base,
    image: base.image ?? 'https://images.unsplash.com/photo-1653150756437-41454967e9f5?w=1200',
    students: 150,
    rating: 4.9,
    requirements: ['Возраст от 18 лет', 'Желание учиться и развиваться', 'Любовь к животным', 'Готовность к практическим занятиям'],
    program: ext.program,
    instructor: ext.instructor,
    reviews: ext.reviews,
    bonuses: ext.bonuses,
    demoLesson: ext.demoLesson,
  };
  const instructorMaster = masters.find((m) => m.name === course.instructor.name);

  const calculateTotalProgress = () => {
    const totalLessons = course.program.reduce((sum, module) => sum + module.lessons.length, 0);
    const completedLessons = course.program.reduce(
      (sum, module) => sum + module.lessons.filter((l) => module.progress > 0).length,
      0
    );
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero */}
      <section
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${course.image})`,
        }}
      >
        <div className="absolute top-4 right-4 z-10">
          <FavoriteButton type="course" id={course.id} className="bg-white/20 hover:bg-white/30 text-white rounded-full" />
        </div>
        <div className="container mx-auto px-4 h-full flex items-end pb-12">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">{course.name}</h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6" />
                <span className="text-xl">{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                <span className="text-xl">{course.price.toLocaleString()}₽</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                <span className="text-xl">{course.students} студентов</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            {/* Description */}
            <section>
              <h2 className="text-3xl font-bold mb-6">О курсе</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {course.description}
              </p>
            </section>

            {/* Demo Access */}
            <section className="bg-gradient-to-r from-[#009B00]/10 to-[#89E689]/10 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <PlayCircle className="w-12 h-12 text-[#009B00]" />
                <div>
                  <h3 className="text-2xl font-bold">Демо-доступ</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Попробуйте первый модуль бесплатно
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Video className="w-6 h-6 text-[#009B00]" />
                    <span className="font-bold">{course.demoLesson.name}</span>
                  </div>
                  <span className="text-gray-500">{course.demoLesson.duration}</span>
                </div>
                <button className="w-full mt-4 bg-[#009B00] hover:bg-[#40AB40] text-white py-3 rounded-xl font-bold transition-colors">
                  Смотреть бесплатно
                </button>
              </div>
            </section>

            {/* Program */}
            <section>
              <h3 className="text-2xl font-bold mb-6">Программа обучения</h3>
              <div className="space-y-6">
                {course.program.map((module, moduleIndex) => (
                  <div
                    key={module.id}
                    className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border-2 border-[#009B00]/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold">
                        Модуль {moduleIndex + 1}: {module.name}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {module.lessons.length} уроков
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-[#009B00] h-2 rounded-full transition-all"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Прогресс: {module.progress}%
                      </p>
                    </div>

                    <div className="space-y-2">
                      {module.lessons.map((lesson) => {
                        const LessonIcon = lesson.type === 'video' ? Video : FileText;
                        return (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg"
                          >
                            <LessonIcon className="w-5 h-5 text-[#009B00]" />
                            <span className="flex-1">{lesson.name}</span>
                            <span className="text-sm text-gray-500">{lesson.duration}</span>
                            {module.progress > 0 && (
                              <CheckCircle className="w-5 h-5 text-[#009B00]" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Schedule */}
            <section>
              <h3 className="text-2xl font-bold mb-6">Расписание</h3>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    date: '1 февраля 2026',
                    time: '10:00',
                    spots: 12,
                    format: 'Гибрид',
                  },
                  {
                    id: 2,
                    date: '15 февраля 2026',
                    time: '14:00',
                    spots: 8,
                    format: 'Онлайн',
                  },
                  {
                    id: 3,
                    date: '1 марта 2026',
                    time: '10:00',
                    spots: 10,
                    format: 'Очно',
                  },
                ].map((scheduleItem) => (
                  <div
                    key={scheduleItem.id}
                    className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-2 border-[#009B00]/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-6 h-6 text-[#009B00]" />
                        <div>
                          <p className="font-bold">{scheduleItem.date}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {scheduleItem.time} • {scheduleItem.format}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Осталось мест: {scheduleItem.spots}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/courses/schedule"
                className="inline-flex items-center gap-2 mt-4 text-[#009B00] font-bold hover:gap-4 transition-all"
              >
                Подробное расписание
                <ArrowRight className="w-5 h-5" />
              </Link>
            </section>

            {/* Requirements */}
            <section>
              <h3 className="text-2xl font-bold mb-6">Требования к ученикам</h3>
              <div className="space-y-3">
                {course.requirements.map((req, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#009B00] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">{req}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section>
              <h3 className="text-2xl font-bold mb-6">Отзывы выпускников</h3>
              {course.reviews.length > 0 && (
                <div className="flex items-stretch gap-4">
                  <button
                    type="button"
                    onClick={() => setReviewIndex((p) => (p === 0 ? course.reviews.length - 1 : p - 1))}
                    className="flex-shrink-0 w-12 h-12 rounded-full bg-[#009B00] hover:bg-[#40AB40] text-white flex items-center justify-center self-center transition-colors"
                    aria-label="Предыдущий отзыв"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={reviewIndex}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
                      >
                        {(() => {
                          const review = course.reviews[reviewIndex];
                          return (
                            <>
                              <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-[#009B00] rounded-full flex items-center justify-center text-white font-bold">
                                  {review.author[0]}
                                </div>
                                <div className="flex-1">
                                  <p className="font-bold">{review.author}</p>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, j) => (
                                      <Star
                                        key={j}
                                        className={`w-4 h-4 ${j < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.date).toLocaleDateString('ru-RU')}
                                </span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300">{review.text}</p>
                            </>
                          );
                        })()}
                      </motion.div>
                    </AnimatePresence>
                    <div className="flex justify-center gap-2 mt-4">
                      {course.reviews.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setReviewIndex(i)}
                          className={`h-2 rounded-full transition-all ${i === reviewIndex ? 'bg-[#009B00] w-6' : 'bg-gray-300 dark:bg-gray-600 w-2'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReviewIndex((p) => (p + 1) % course.reviews.length)}
                    className="flex-shrink-0 w-12 h-12 rounded-full bg-[#009B00] hover:bg-[#40AB40] text-white flex items-center justify-center self-center transition-colors"
                    aria-label="Следующий отзыв"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="sticky top-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-2 border-[#009B00]">
              <div className="text-center mb-6">
                <p className="text-gray-600 dark:text-gray-300 mb-2">Стоимость курса</p>
                <p className="text-4xl font-bold text-[#009B00]">
                  {course.price.toLocaleString()}₽
                </p>
                <p className="text-sm text-gray-500 mt-1">{course.duration}</p>
              </div>

              <Link
                to={`/book/course/${course.id}`}
                className="block w-full bg-[#009B00] hover:bg-[#40AB40] text-white py-4 rounded-xl font-bold mb-3 transition-colors text-center flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Записаться на курс
              </Link>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{course.students} студентов</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating} рейтинг</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span>Сертификат включен</span>
                </div>
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h4 className="font-bold mb-4">Преподаватель</h4>
              <div className="flex items-center gap-4">
                <img
                  src={course.instructor.image}
                  alt={course.instructor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">{course.instructor.name}</p>
                  <p className="text-sm text-gray-500">
                    Опыт: {course.instructor.experience}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{course.instructor.rating}</span>
                  </div>
                  {instructorMaster && (
                    <Link
                      to={`/book/course/${course.id}?masterId=${instructorMaster.id}`}
                      className="inline-block mt-2 text-sm font-medium text-[#009B00] hover:underline"
                    >
                      Записаться к этому преподавателю
                    </Link>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                {course.instructor.specialization}
              </p>
            </div>

            {/* Bonuses */}
            <div className="bg-gradient-to-br from-[#009B00] to-[#89E689] text-white rounded-2xl p-6">
              <h4 className="font-bold mb-4">Бонусы курса</h4>
              <div className="space-y-2">
                {course.bonuses.map((bonus, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">{bonus}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <ContactForm />
    </div>
  );
}
