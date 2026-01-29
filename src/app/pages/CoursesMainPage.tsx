import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Calendar, Award, BookOpen, Users, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { CoursesGallery } from '@/app/components/CoursesGallery';
import { ContactForm } from '@/app/components/ContactForm';
import { GroomerPath } from '@/app/components/GroomerPath';
import { masters, reviews } from '@/app/data/mockData';
import { useState, useEffect } from 'react';

export function CoursesMainPage() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const navigate = useNavigate();

  const courseReviews = reviews.filter((r: any) => r.type === 'course');

  useEffect(() => {
    if (courseReviews.length === 0) return;
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % courseReviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [courseReviews.length]);

  return (
    <div className="min-h-screen">
      {/* Hero Block */}
      <section
        className="relative flex items-center justify-center overflow-hidden bg-[#40AB40]"
        style={{ minHeight: 'calc(100vh - 7rem)' }}
      >
        {/* Фоновое изображение */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/pictures/hero-section groom room courses.jpg')",
          }}
        />
        
        {/* Полупрозрачная градиентная накладка */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#40AB40]/80 via-[#40AB40]/70 to-[#89E689]/80" />
        
        <div className="container mx-auto px-4 text-center text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">MARS GROOM Курсы</h1>
            <p className="text-2xl mb-12 max-w-3xl mx-auto">
              Станьте профессиональным грумером с нашей академией
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/courses/list"
                className="inline-block bg-white text-[#40AB40] px-12 py-6 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transition-all"
              >
                Список всех курсов
                <ArrowRight className="inline-block ml-2" />
              </Link>
              <Link
                to="/book/course"
                className="inline-block bg-[#3F3F3F] text-white px-12 py-6 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transition-all"
              >
                Запись на курс
                <ArrowRight className="inline-block ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Groomer Path */}
      <GroomerPath />

      {/* Test Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#40AB40]/10 to-[#89E689]/10 rounded-2xl p-12"
            >
              <h2 className="text-4xl font-bold mb-6">Не знаете какой курс выбрать?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Пройдите наш тест и получите персонализированные рекомендации курсов, которые подходят именно вам
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button
                  onClick={() => navigate('/courses/test')}
                  className="inline-block bg-[#40AB40] hover:bg-[#89E689] text-white px-12 py-4 rounded-full text-lg font-bold transition-colors"
                >
                  Пройти тест
                  <ArrowRight className="inline-block ml-2" />
                </button>
                <Link
                  to="/book/course"
                  className="inline-block bg-[#3F3F3F] text-white px-12 py-4 rounded-full text-lg font-bold transition-colors"
                >
                  Записаться на курс
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Наши преподаватели</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Профессионалы с многолетним опытом работы
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {masters.slice(0, 6).map((master, index) => (
              <motion.div
                key={master.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={master.image}
                    alt={master.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-[#40AB40] text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
                    <Star className="w-4 h-4 fill-white" />
                    {master.rating}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{master.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{master.specialization}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Award className="w-4 h-4" />
                    <span>Опыт: {master.experience} лет</span>
                  </div>
                  <Link
                    to={`/book/course?masterId=${master.id}`}
                    className="inline-flex items-center gap-2 text-[#40AB40] font-bold hover:underline"
                  >
                    <Calendar className="w-4 h-4" />
                    Записаться к этому преподавателю
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/book/course"
              className="inline-block bg-[#40AB40] hover:bg-[#89E689] text-white px-10 py-4 rounded-full text-lg font-bold transition-colors"
            >
              Записаться на курс
            </Link>
          </div>
        </div>
      </section>

      {/* Course Reviews */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Отзывы о курсах</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Что говорят наши студенты
            </p>
          </div>

          {courseReviews.length > 0 && (
            <div className="max-w-4xl mx-auto relative flex items-center gap-4">
              <button
                type="button"
                onClick={() => setCurrentReviewIndex((prev) => (prev === 0 ? courseReviews.length - 1 : prev - 1))}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-[#40AB40] hover:bg-[#89E689] text-white flex items-center justify-center transition-colors"
                aria-label="Предыдущий отзыв"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentReviewIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
                  >
                    <div className="flex items-center mb-4">
                      {[...Array(courseReviews[currentReviewIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 fill-[#40AB40] text-[#40AB40]" />
                      ))}
                    </div>
                    <p className="text-xl mb-6 italic">
                      "{courseReviews[currentReviewIndex].text}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-lg">{courseReviews[currentReviewIndex].author}</p>
                        {courseReviews[currentReviewIndex].pet && (
                          <p className="text-gray-500">{courseReviews[currentReviewIndex].pet}</p>
                        )}
                      </div>
                      <p className="text-gray-500">
                        {new Date(courseReviews[currentReviewIndex].date).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="flex justify-center gap-2 mt-6">
                  {courseReviews.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentReviewIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentReviewIndex
                          ? 'bg-[#40AB40] w-8'
                          : 'bg-gray-300 dark:bg-gray-600 w-2'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCurrentReviewIndex((prev) => (prev + 1) % courseReviews.length)}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-[#40AB40] hover:bg-[#89E689] text-white flex items-center justify-center transition-colors"
                aria-label="Следующий отзыв"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Расписание курсов</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Запишитесь на ближайший поток
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                id: 1,
                course: 'Основы груминга собак',
                date: '1 февраля 2026',
                spots: 12,
                duration: '3 месяца',
                price: 35000,
                format: 'Гибрид',
              },
              {
                id: 2,
                course: 'Профессиональный груминг',
                date: '15 февраля 2026',
                spots: 8,
                duration: '6 месяцев',
                price: 65000,
                format: 'Онлайн',
              },
              {
                id: 3,
                course: 'Креативный груминг',
                date: '1 марта 2026',
                spots: 15,
                duration: '1 месяц',
                price: 28000,
                format: 'Гибрид',
              },
            ].map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-[#40AB40] rounded-xl flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-1">{item.course}</h3>
                        <p className="text-gray-600 dark:text-gray-300">Старт: {item.date}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{item.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Осталось {item.spots} мест</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        <span>{item.format}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-[#40AB40] mb-2">{item.price.toLocaleString()}₽</p>
                    <Link
                      to={`/book/course/${item.id}`}
                      className="inline-block bg-[#40AB40] hover:bg-[#89E689] text-white px-6 py-3 rounded-full font-bold transition-colors"
                    >
                      Записаться
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/courses/schedule"
              className="inline-block bg-[#40AB40] hover:bg-[#89E689] text-white px-8 py-4 rounded-full text-lg font-bold transition-colors"
            >
              Подробное расписание
              <ArrowRight className="inline-block ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Галерея обучения</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Фото с наших занятий и мероприятий
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <CoursesGallery />
          </div>
          <div className="text-center mt-12">
            <Link
              to="/book/course"
              className="inline-block bg-[#40AB40] hover:bg-[#89E689] text-white px-10 py-4 rounded-full text-lg font-bold transition-colors"
            >
              Записаться на курс
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />
    </div>
  );
}