import { useState, useMemo } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/app/context/AuthContext';
import { useEntity } from '@/app/hooks';
import { 
  Heart, 
  Calculator, 
  Truck, 
  Phone, 
  CheckCircle, 
  Users,
  Calendar,
  Clock,
  Shield,
  ChevronRight
} from 'lucide-react';

/** Скидка: от 10 питомцев = 5%, от 25 = 10%, от 30 = 15% */
function getDiscountForPets(count: number): number {
  if (count >= 30) return 15;
  if (count >= 25) return 10;
  if (count >= 10) return 5;
  return 0;
}

export function SheltersGroomingPage() {
  const { user } = useAuth();
  const { create: createShelterApplication, creating } = useEntity<any>('shelter_applications', { fetchListOnMount: false });
  const [petsCount, setPetsCount] = useState(10);
  const [orgName, setOrgName] = useState('');
  const [inn, setInn] = useState('');
  const [contactName, setContactName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [agree, setAgree] = useState(false);
  const [formError, setFormError] = useState('');
  const [sent, setSent] = useState(false);

  const basePrice = 1500;
  const discount = useMemo(() => getDiscountForPets(petsCount), [petsCount]);
  const total = basePrice * petsCount;
  const withDiscount = total * (1 - discount / 100);

  const features = [
    { icon: Users, title: "От 10 питомцев", desc: "Скидки при групповом обслуживании" },
    { icon: Truck, title: "Выезд на место", desc: "Работаем в вашем приюте" },
    { icon: Calendar, title: "Гибкий график", desc: "В удобное для вас время" },
    { icon: Shield, title: "Гарантия", desc: "Все процедуры безопасны" },
    { icon: Clock, title: "Экономия времени", desc: "Одновременная работа с несколькими животными" },
    { icon: Heart, title: "Особый уход", desc: "Индивидуальный подход к каждому питомцу" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A90E2]/5 via-white to-[#357ABD]/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero в стиле /services/list */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative py-20 md:py-28 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/20 via-transparent to-[#357ABD]/10 dark:from-[#4A90E2]/30 dark:to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] bg-clip-text text-transparent">  Груминг для приютов
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
              Профессиональный уход за питомцами в приютах и питомниках. Скидки до 30% при оптовых заказах.
            </p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap justify-center gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] text-white rounded-2xl font-bold text-lg shadow-lg shadow-[#4A90E2]/30 hover:shadow-xl transition-shadow">
                Оставить заявку
                <ChevronRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-10 py-4 bg-white dark:bg-gray-800 border-2 border-[#4A90E2]/30 text-[#4A90E2] dark:text-[#4A90E2] rounded-2xl font-bold text-lg hover:border-[#4A90E2]/50 transition-all"
              >
                Рассчитать стоимость
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

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
              className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-[#4A90E2]/10 hover:border-[#4A90E2]/30 hover:shadow-xl transition-all duration-300"
            >
              <div className="inline-flex p-3 rounded-xl bg-[#4A90E2]/10 mb-4 group-hover:bg-[#4A90E2]/20 transition-colors">
                <feature.icon className="w-6 h-6 text-[#4A90E2]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Interactive Calculator */}
        <motion.section
          id="calculator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-[#4A90E2] to-[#357ABD]">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-[#4A90E2]/10">
                      <Calculator className="w-6 h-6 text-[#4A90E2]" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                      Калькулятор скидок
                    </h2>
                  </div>
                  <div className="text-sm text-[#4A90E2] font-semibold">
                    Скидка по количеству: от 10 питомцев 5%, от 25 — 10%, от 30 — 15%
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-gray-700 dark:text-gray-300 font-medium">
                          Количество питомцев: <span className="text-[#4A90E2] font-bold">{petsCount}</span>
                        </label>
                        <span className="text-sm text-gray-500">до 50</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={petsCount}
                        onChange={(e) => setPetsCount(parseInt(e.target.value, 10))}
                        className="w-full h-3 bg-[#4A90E2]/20 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-[#4A90E2] [&::-webkit-slider-thumb]:to-[#357ABD]"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>1</span>
                        <span>25</span>
                        <span>50</span>
                      </div>
                      <p className="text-sm text-[#4A90E2] font-medium mt-2">
                        Текущая скидка: {discount}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#4A90E2]/5 to-[#357ABD]/10 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Базовая стоимость:</span>
                        <span className="text-xl font-bold text-gray-800 dark:text-white">
                          {total.toLocaleString()} ₽
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Скидка {discount}%:</span>
                        <span className="text-xl font-bold text-[#4A90E2]">
                          -{(total * discount / 100).toLocaleString()} ₽
                        </span>
                      </div>
                      <div className="border-t border-[#4A90E2]/20 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-800 dark:text-white">Итого:</span>
                          <span className="text-3xl font-bold bg-gradient-to-r from-[#4A90E2] to-[#357ABD] bg-clip-text text-transparent">
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
          <div className="bg-gradient-to-br from-white to-[#4A90E2]/5 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-2xl">
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
                      <CheckCircle className="w-5 h-5 text-[#4A90E2]" />
                      <span className="text-gray-700 dark:text-gray-300">Быстрый расчёт</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#4A90E2]" />
                      <span className="text-gray-700 dark:text-gray-300">Гибкий график</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#4A90E2]" />
                      <span className="text-gray-700 dark:text-gray-300">Все документы</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-3/5">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setFormError('');
                    setSent(false);
                    const digits = phone.replace(/\D/g, '');
                    if (orgName.trim().length < 3) return setFormError('Введите корректное название организации (минимум 3 символа).');
                    if (!/^\d{10,12}$/.test(inn.trim())) return setFormError('ИНН должен содержать 10 или 12 цифр.');
                    if (contactName.trim().length < 2) return setFormError('Введите контактное лицо.');
                    if (digits.length < 10 || digits.length > 15) return setFormError('Введите корректный номер телефона.');
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setFormError('Введите корректный email.');
                    if (!agree) return setFormError('Необходимо согласие на обработку персональных данных.');
                    const result = await createShelterApplication({
                      org_name: orgName.trim(),
                      inn: inn.trim(),
                      contact_name: contactName.trim(),
                      phone: phone.trim(),
                      email: email.trim(),
                      message: message.trim() || null,
                      status: 'new',
                      created_by: user?.id ?? null,
                    } as any);
                    if (result.error) return setFormError(result.error);
                    setSent(true);
                    setMessage('');
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
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent transition-all duration-300 group-hover:border-[#4A90E2]/50"
                      />
                    </div>
                    
                    <div className="group">
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        ИНН *
                      </label>
                      <input
                        type="text"
                        required
                        value={inn}
                        onChange={(e) => setInn(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent transition-all duration-300 group-hover:border-[#4A90E2]/50"
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
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent transition-all duration-300 group-hover:border-[#4A90E2]/50"
                      />
                    </div>
                    
                    <div className="group">
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Телефон *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent transition-all duration-300 group-hover:border-[#4A90E2]/50"
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent transition-all duration-300 group-hover:border-[#4A90E2]/50"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Дополнительная информация
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent transition-all duration-300 group-hover:border-[#4A90E2]/50 resize-none"
                      placeholder="Количество питомцев, пожелания, особенности..."
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-[#4A90E2] focus:ring-[#4A90E2]" 
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Я согласен на обработку персональных данных в соответствии с{' '}
                      <Link to="/privacy" className="underline font-medium text-[#4A90E2] hover:text-[#357ABD]">
                        политикой конфиденциальности
                      </Link>
                    </span>
                  </label>
                  {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
                  {sent ? <p className="text-sm text-emerald-600">Заявка отправлена. Ответ администратора придет в уведомления.</p> : null}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={creating}
                    className="w-full py-4 bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#4A90E2]/25 hover:shadow-xl hover:shadow-[#4A90E2]/35 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60"
                  >
                    {creating ? 'Отправка...' : 'Отправить заявку'}
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </motion.section>

        
        {/* Navigation */}
        <div className="mt-16 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-[#4A90E2] font-medium hover:text-[#357ABD] transition-colors group"
          >
            <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Вернуться к услугам
          </Link>
        </div>
      </div>
    </div>
  );
}