import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Calculator, 
  FileText, 
  Truck, 
  Phone, 
  CheckCircle, 
  PawPrint, 
  Users,
  Calendar,
  Clock,
  Shield,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export function SheltersGroomingPage() {
  const [petsCount, setPetsCount] = useState(10);
  const [discount, setDiscount] = useState(15);
  const [activeTab, setActiveTab] = useState('calculator');

  const basePrice = 1500;
  const total = basePrice * petsCount;
  const withDiscount = total * (1 - discount / 100);

  const features = [
    { icon: Users, title: "От 5 питомцев", desc: "Скидки при групповом обслуживании" },
    { icon: Truck, title: "Выезд на место", desc: "Работаем в вашем приюте" },
    { icon: Calendar, title: "Гибкий график", desc: "В удобное для вас время" },
    { icon: Shield, title: "Гарантия", desc: "Все процедуры безопасны" },
    { icon: Clock, title: "Экономия времени", desc: "Одновременная работа с несколькими животными" },
    { icon: Heart, title: "Особый уход", desc: "Индивидуальный подход к каждому питомцу" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10" />
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-blue-600 dark:text-blue-400 font-medium">Специальные условия</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Груминг для приютов
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
              Профессиональный уход за питомцами в приютах и питомниках. 
              <span className="text-blue-500 font-semibold"> Скидки до 30%</span> при оптовых заказах
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Phone className="w-5 h-5" />
                Оставить заявку
                <ChevronRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('calculator')}
                className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl font-bold text-lg hover:border-blue-500/40 transition-all duration-300"
              >
                Рассчитать стоимость
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-blue-500/10 hover:border-blue-500/30 hover:shadow-xl transition-all duration-300"
            >
              <div className="inline-flex p-3 rounded-xl bg-blue-500/10 mb-4 group-hover:bg-blue-500/20 transition-colors">
                <feature.icon className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Interactive Calculator */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-cyan-500">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-500/10">
                      <Calculator className="w-6 h-6 text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                      Калькулятор скидок
                    </h2>
                  </div>
                  <div className="text-sm text-blue-500 font-semibold">
                    Скидка автоматически рассчитывается
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-gray-700 dark:text-gray-300 font-medium">
                          Количество питомцев: <span className="text-blue-500 font-bold">{petsCount}</span>
                        </label>
                        <span className="text-sm text-gray-500">до 200</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="200"
                        value={petsCount}
                        onChange={(e) => setPetsCount(parseInt(e.target.value))}
                        className="w-full h-3 bg-blue-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-cyan-500"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>1</span>
                        <span>100</span>
                        <span>200+</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-gray-700 dark:text-gray-300 font-medium">
                          Скидка: <span className="text-blue-500 font-bold">{discount}%</span>
                        </label>
                        <span className="text-sm text-gray-500">до 50%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={discount}
                        onChange={(e) => setDiscount(parseInt(e.target.value))}
                        className="w-full h-3 bg-blue-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Базовая стоимость:</span>
                        <span className="text-xl font-bold text-gray-800 dark:text-white">
                          {total.toLocaleString()} ₽
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Скидка {discount}%:</span>
                        <span className="text-xl font-bold text-green-500">
                          -{(total * discount / 100).toLocaleString()} ₽
                        </span>
                      </div>
                      <div className="border-t border-blue-500/20 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-800 dark:text-white">Итого:</span>
                          <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                            {Math.round(withDiscount).toLocaleString()} ₽
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          ~ {Math.round(withDiscount / petsCount).toLocaleString()} ₽ за питомца
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Application Form */}
        <motion.section
          id="application-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-2/5">
                <div className="sticky top-8">
                  
                  <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                    Оставьте заявку
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Наш администратор свяжется с вами в течение часа для уточнения деталей и составления графика работ.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">Быстрый расчёт</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">Гибкий график</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">Все документы</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-3/5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Заявка отправлена! Администратор свяжется с вами в ближайшее время.');
                  }}
                  className="space-y-4"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Название организации *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400"
                      />
                    </div>
                    
                    <div className="group">
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        ИНН *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Контактное лицо *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400"
                      />
                    </div>
                    
                    <div className="group">
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Телефон *
                      </label>
                      <input
                        type="tel"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Дополнительная информация
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 resize-none"
                      placeholder="Количество питомцев, пожелания, особенности..."
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                    <input 
                      type="checkbox" 
                      required 
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500" 
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Я согласен на обработку персональных данных в соответствии с{' '}
                      <Link to="/privacy" className="underline font-medium text-blue-500 hover:text-blue-600">
                        политикой конфиденциальности
                      </Link>
                    </span>
                  </label>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <Phone className="w-5 h-5" />
                    Отправить заявку
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-8 md:p-12 shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Готовы преобразить питомцев вашего приюта?
            </h3>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Свяжитесь с нами прямо сейчас и получите бесплатную консультацию
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+79991234567" 
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-3"
              >
                <Phone className="w-5 h-5" />
                +7 (999) 123-45-67
              </a>
              <button className="px-8 py-4 bg-blue-600/20 text-white border-2 border-white/30 rounded-xl font-bold text-lg hover:bg-blue-600/30 transition-colors">
                Заказать обратный звонок
              </button>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="mt-16 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-blue-500 font-medium hover:text-blue-600 transition-colors group"
          >
            <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Вернуться к услугам
          </Link>
        </div>
      </div>
    </div>
  );
}