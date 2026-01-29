import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Heart, Award, Users, ArrowRight, Star, Calendar, Clock, Shield, Smile, DollarSign, Phone, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';
import { faqItems, reviews, services, courses } from '@/app/data/mockData';
import { MainGallery } from '@/app/components/MainGallery';
import { ContactForm } from '@/app/components/ContactForm';
import { useState, useEffect } from 'react';

export function LandingPage() {
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const navigate = useNavigate();

  const stats = [
    { value: 5000, label: 'стрижек в год' },
    { value: 10000, label: 'ухоженных лапок' },
    { value: 200, label: 'обученных грумеров' },
    { value: 24, label: 'породы в работе' },
  ];

  // Только первые 6 FAQ вопросов
  const mainFaqItems = faqItems.slice(0, 6);

  // Популярные услуги (первые 6)
  const popularServices = services.slice(0, 6);

  // Популярные курсы (первые 6)
  const popularCourses = courses.slice(0, 6);

  useEffect(() => {
    // Animate stats when component mounts
    stats.forEach((stat, index) => {
      let start = 0;
      const end = stat.value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }
        setAnimatedStats(prev => {
          const newStats = [...prev];
          newStats[index] = Math.floor(start);
          return newStats;
        });
      }, 16);
    });
  }, []);

  // Автоматическая прокрутка отзывов
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const milestones = [
    {
      year: '2016',
      title: 'Открытие салона',
      description: 'Мы начали свой путь с небольшого салона и большой мечты - создать место, где каждый питомец будет чувствовать себя любимым.',
      icon: Sparkles,
    },
    {
      year: '2018',
      title: 'Первая школа груминга',
      description: 'Открыли первую обучающую программу для будущих грумеров. За год обучили 20 специалистов.',
      icon: Users,
    },
    {
      year: '2020',
      title: '1000-й клиент',
      description: 'Достигли важной вехи - 1000 довольных клиентов. Это был важный момент в нашей истории.',
      icon: Heart,
    },
    {
      year: '2022',
      title: 'Признание в индустрии',
      description: 'Получили награду "Лучший груминг-салон года" от профессионального сообщества.',
      icon: Award,
    },
    {
      year: '2024',
      title: 'Расширение',
      description: 'Открыли филиал и запустили онлайн-обучение. Теперь наши курсы доступны по всей стране.',
      icon: Sparkles,
    },
    {
      year: '2026',
      title: 'Сегодня',
      description: 'Продолжаем расти и развиваться, обучая новых специалистов и радуя тысячи питомцев.',
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* HERO Section */}
      <section
        className="relative flex items-center justify-center overflow-hidden bg-[#53C9CA]"
        style={{ minHeight: 'calc(100vh - 7rem)' }}
      >
        {/* Фоновое изображение */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/pictures/hero-section groom room.jpg')",
          }}
        />
        
        {/* Полупрозрачная бирюзовая накладка */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#53C9CA]/80 via-[#53C9CA]/70 to-[#9ADFE0]/80" />
        
        <div className="container mx-auto px-4 z-10 text-white text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              MARS GROOM
            </h1>
            <p className="text-2xl md:text-3xl mb-8 max-w-3xl mx-auto">
              Профессиональный груминг и обучение грумеров с 2016 года
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <div className="flex flex-col gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/services"
                    className="inline-block bg-white text-[#53C9CA] px-12 py-6 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transition-all"
                  >
                    Услуги груминга
                    <ArrowRight className="inline-block ml-2" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/book/service"
                    className="inline-block bg-white/20 hover:bg-white/30 text-white border-2 border-white px-12 py-6 rounded-full text-xl font-bold shadow-2xl transition-all"
                  >
                    Записаться на услугу
                  </Link>
                </motion.div>
              </div>
              <div className="flex flex-col gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/courses"
                    className="inline-block bg-[#3F3F3F] text-white px-12 py-6 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transition-all"
                  >
                    Обучение грумингу
                    <ArrowRight className="inline-block ml-2" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/book/course"
                    className="inline-block bg-white/20 hover:bg-white/30 text-white border-2 border-white px-12 py-6 rounded-full text-xl font-bold shadow-2xl transition-all"
                  >
                    Записаться на курс
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section - обновленное оформление */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-6">
            
             
            </div>
            <h2 className="text-5xl font-bold mb-6">Наша миссия</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Создавать красоту и комфорт для ваших питомцев, обучая новое поколение 
              профессиональных грумеров с заботой и любовью к животным
            </p>
          </motion.div>

          {/* Статистика - обновленное оформление */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
              >
                <div className="text-5xl font-bold text-[#53C9CA] mb-2">{animatedStats[index]}{stat.value > 100 ? '+' : ''}</div>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Наша история</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Путь от маленького салона до ведущей школы груминга
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#53C9CA] to-[#9ADFE0]"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-20"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-[#53C9CA] to-[#9ADFE0] rounded-full flex items-center justify-center z-10">
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-l-4 border-[#53C9CA]">
                      <div className="flex items-center gap-4 mb-4">
                        <Calendar className="w-6 h-6 text-[#53C9CA]" />
                        <span className="text-2xl font-bold text-[#53C9CA]">{milestone.year}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{milestone.title}</h3>
                      <p className="text-lg text-gray-600 dark:text-gray-300">{milestone.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Нас выбирают за...</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Award,
                title: 'Профессионализм',
                description: 'Мы предоставляем комплексные услуги по уходу за собаками и кошками любых пород и размеров.',
              },
              {
                icon: Shield,
                title: 'Качество',
                description: 'Мы используем безопасные и экологичные шампуни, кондиционеры и средства гигиены.',
              },
              {
                icon: Smile,
                title: 'Индивидуальность',
                description: 'Мы обеспечим вашему питомцу комфортные и приятные условия с индивидуальным подходом.',
              },
              {
                icon: Clock,
                title: 'Доступность',
                description: 'Для вашего удобства наши салоны работают 7 дней в неделю без перерывов и выходных.',
              },
              {
                icon: Heart,
                title: 'Заботу',
                description: 'Мы позаботимся о вашем питомце и проведем все необходимые процедуры, пока вы занимаетесь своими делами.',
              },
              {
                icon: Phone,
                title: 'Отзывчивость',
                description: 'Мы с радостью проконсультируем вас по вопросам ухода за вашим питомцем.',
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#53C9CA] to-[#9ADFE0] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Популярные услуги</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Профессиональный уход за вашими питомцами
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 items-stretch">
            {popularServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => navigate(`/services/${service.id}`)}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl cursor-pointer group flex flex-col h-full"
              >
                <div className="relative h-64 overflow-hidden flex-shrink-0">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[#53C9CA] text-white px-4 py-2 rounded-full font-bold">
                    {service.priceRange || `${service.price}₽`}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{service.duration}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-3 flex-wrap mt-auto pt-2" onClick={(e) => e.stopPropagation()}>
                    <Link
                      to={`/services/${service.id}`}
                      className="flex items-center gap-2 text-[#53C9CA] font-bold hover:gap-4 transition-all"
                    >
                      Подробнее
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to={`/book/service/${service.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-[#53C9CA] hover:bg-[#9ADFE0] text-white rounded-xl font-medium transition-colors"
                    >
                      Записаться
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center flex flex-wrap justify-center gap-4">
            <Link
              to="/services"
              className="inline-block bg-[#53C9CA] text-white px-12 py-4 rounded-full text-lg font-bold hover:bg-[#9ADFE0] transition-colors"
            >
              Весь каталог услуг
            </Link>
            <Link
              to="/book/service"
              className="inline-block bg-[#3F3F3F] hover:bg-gray-700 text-white px-12 py-4 rounded-full text-lg font-bold transition-colors"
            >
              Записаться на услугу
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Популярные курсы</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Станьте профессиональным грумером
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 items-stretch">
            {popularCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => navigate(`/courses/${course.id}`)}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl cursor-pointer group flex flex-col h-full"
              >
                <div className="relative h-64 overflow-hidden flex-shrink-0">
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#EF476F] text-white px-4 py-2 rounded-full font-bold text-sm">
                    {course.level === 'beginner' ? 'Начальный' : 'Продвинутый'}
                  </div>
                  <div className="absolute top-4 right-4 bg-white text-[#53C9CA] px-4 py-2 rounded-full font-bold">
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
                      {course.format === 'hybrid' ? 'Гибрид' : course.format === 'online' ? 'Онлайн' : 'Очно'}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{course.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-3 flex-wrap mt-auto pt-2" onClick={(e) => e.stopPropagation()}>
                    <Link
                      to={`/courses/${course.id}`}
                      className="flex items-center gap-2 text-[#53C9CA] font-bold hover:gap-4 transition-all"
                    >
                      Подробнее
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to={`/book/course/${course.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-[#53C9CA] hover:bg-[#9ADFE0] text-white rounded-xl font-medium transition-colors"
                    >
                      Записаться
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center flex flex-wrap justify-center gap-4">
            <Link
              to="/courses"
              className="inline-block bg-[#53C9CA] text-white px-12 py-4 rounded-full text-lg font-bold hover:bg-[#9ADFE0] transition-colors"
            >
              Все обучающие программы
            </Link>
            <Link
              to="/book/course"
              className="inline-block bg-[#3F3F3F] hover:bg-gray-700 text-white px-12 py-4 rounded-full text-lg font-bold transition-colors"
            >
              Записаться на курс
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews - карусель с автоматической прокруткой */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Отзывы наших клиентов</h2>
          </div>

          <div className="max-w-4xl mx-auto relative flex items-center gap-4">
            <button
              type="button"
              onClick={() => setCurrentReviewIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1))}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-[#53C9CA] hover:bg-[#9ADFE0] text-white flex items-center justify-center transition-colors"
              aria-label="Предыдущий отзыв"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1 min-w-0">
              <motion.div
                key={currentReviewIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
              >
                <div className="flex items-center mb-4">
                  {[...Array(reviews[currentReviewIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-[#53C9CA] text-[#53C9CA]" />
                  ))}
                </div>
                <p className="text-xl mb-6 italic">
                  "{reviews[currentReviewIndex].text}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">{reviews[currentReviewIndex].author}</p>
                    <p className="text-gray-500">{reviews[currentReviewIndex].pet}</p>
                  </div>
                  <p className="text-gray-500">
                    {new Date(reviews[currentReviewIndex].date).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </motion.div>
              <div className="flex justify-center gap-2 mt-6">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentReviewIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentReviewIndex
                        ? 'bg-[#53C9CA] w-8'
                        : 'bg-gray-300 dark:bg-gray-600 w-2'
                    }`}
                  />
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCurrentReviewIndex((prev) => (prev + 1) % reviews.length)}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-[#53C9CA] hover:bg-[#9ADFE0] text-white flex items-center justify-center transition-colors"
              aria-label="Следующий отзыв"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ - только 4-6 вопросов */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Частые вопросы</h2>
          </div>

          <Accordion.Root type="single" collapsible className="space-y-4">
            {mainFaqItems.map((item, index) => (
              <Accordion.Item
                key={index}
                value={`item-${index}`}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="w-full px-6 py-4 text-left font-bold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex justify-between items-center">
                    {item.question}
                    <span className="text-2xl">+</span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="px-6 py-4">
                  {item.answer}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </section>

      {/* Services Gallery */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold mb-6">Галерея работ</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Просматривайте наши работы в интерактивной галерее
              </p>
            </motion.div>
          </div>

          <div className="max-w-6xl mx-auto">
            <MainGallery />
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />
    </div>
  );
}