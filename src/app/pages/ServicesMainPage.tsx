import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Calendar, Star, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { PriceCalculator } from '@/app/components/PriceCalculator';
import { masters, reviews } from '@/app/data/mockData';
import { ServicesGallery } from '@/app/components/ServicesGallery';
import { ContactForm } from '@/app/components/ContactForm';
import { useState, useEffect } from 'react';

export function ServicesMainPage() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const serviceReviews = reviews.filter((r: any) => r.type === 'service' || !r.type);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % serviceReviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [serviceReviews.length]);

  return (
    <div className="min-h-screen">
      {/* Hero Block */}
      <section
        className="relative flex items-center justify-center overflow-hidden bg-[#4A90E2]"
        style={{ minHeight: 'calc(100vh - 7rem)' }}
      >
        {/* Фоновое изображение */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/pictures/hero-section groom room services.jpg')",
          }}
        />
        
        {/* Полупрозрачная градиентная накладка */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#4A90E2]/80 via-[#4A90E2]/70 to-[#9EC3EF]/80" />
        
        <div className="container mx-auto px-4 text-center text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">MARS GROOM Услуги</h1>
            <p className="text-2xl mb-12 max-w-3xl mx-auto">
              Профессиональный груминг для всех видов животных с заботой и любовью
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/services/list"
                className="inline-block bg-white text-[#4A90E2] px-12 py-6 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transition-all"
              >
                Список всех услуг
                <ArrowRight className="inline-block ml-2" />
              </Link>
              <Link
                to="/book/service"
                className="inline-block bg-[#3F3F3F] text-white px-12 py-6 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transition-all"
              >
                Запись на услугу
                <ArrowRight className="inline-block ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Masters Cards */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Наши мастера</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Профессионалы с многолетним опытом работы
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <div className="absolute top-4 right-4 bg-[#4A90E2] text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
                    <Star className="w-4 h-4 fill-white" />
                    {master.rating}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{master.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{master.specialization}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Sparkles className="w-4 h-4" />
                    <span>Опыт: {master.experience}</span>
                  </div>
                  <Link
                    to={`/book/service?masterId=${master.id}`}
                    className="inline-flex items-center gap-2 text-[#4A90E2] font-bold hover:underline"
                  >
                    <Calendar className="w-4 h-4" />
                    Записаться к этому мастеру
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/book/service"
              className="inline-block bg-[#4A90E2] hover:bg-[#9EC3EF] text-white px-10 py-4 rounded-full text-lg font-bold transition-colors"
            >
              Записаться на услугу
            </Link>
          </div>
        </div>
      </section>

      {/* Price Calculator */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Калькулятор стоимости</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Узнайте примерную стоимость услуг для вашего питомца
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <PriceCalculator />
          </div>
          <div className="text-center mt-12">
            <Link
              to="/book/service"
              className="inline-block bg-[#4A90E2] hover:bg-[#9EC3EF] text-white px-10 py-4 rounded-full text-lg font-bold transition-colors"
            >
              Записаться на услугу
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Галерея работ</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Примеры наших работ по грумингу
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <ServicesGallery />
          </div>
          <div className="text-center mt-12">
            <Link
              to="/book/service"
              className="inline-block bg-[#4A90E2] hover:bg-[#9EC3EF] text-white px-10 py-4 rounded-full text-lg font-bold transition-colors"
            >
              Записаться на услугу
            </Link>
          </div>
        </div>
      </section>

      {/* Service Reviews */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Отзывы о наших услугах</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Что говорят наши клиенты о качестве услуг
            </p>
          </div>

          {serviceReviews.length > 0 && (
            <div className="max-w-4xl mx-auto relative flex items-center gap-4">
              <button
                type="button"
                onClick={() => setCurrentReviewIndex((prev) => (prev === 0 ? serviceReviews.length - 1 : prev - 1))}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-[#4A90E2] hover:bg-[#9EC3EF] text-white flex items-center justify-center transition-colors"
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
                      {[...Array(serviceReviews[currentReviewIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 fill-[#4A90E2] text-[#4A90E2]" />
                      ))}
                    </div>
                    <p className="text-xl mb-6 italic">
                      "{serviceReviews[currentReviewIndex].text}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-lg">{serviceReviews[currentReviewIndex].author}</p>
                        <p className="text-gray-500">{serviceReviews[currentReviewIndex].pet}</p>
                      </div>
                      <p className="text-gray-500">
                        {new Date(serviceReviews[currentReviewIndex].date).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="flex justify-center gap-2 mt-6">
                  {serviceReviews.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentReviewIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentReviewIndex
                          ? 'bg-[#4A90E2] w-8'
                          : 'bg-gray-300 dark:bg-gray-600 w-2'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCurrentReviewIndex((prev) => (prev + 1) % serviceReviews.length)}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-[#4A90E2] hover:bg-[#9EC3EF] text-white flex items-center justify-center transition-colors"
                aria-label="Следующий отзыв"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />
    </div>
  );
}