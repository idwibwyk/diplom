import { useState, useCallback } from 'react';
import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Scissors, Clock, Calendar, MapPin, Mail, CheckCircle, Sparkles, Wifi } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useEntity } from '@/app/hooks';
import { api } from '@/app/api/client';

const FEATURES = [
  { icon: Scissors, label: 'Профессиональный стол для груминга', desc: 'Удобная высота, фиксация' },
  { icon: CheckCircle, label: 'Ванна и сушильная камера', desc: 'Всё необходимое для мытья и сушки' },
  { icon: Sparkles, label: 'Базовый набор инструментов', desc: 'Ножницы, машинки, расчёски' },
  { icon: Wifi, label: 'Wi‑Fi, раздевалка', desc: 'Комфортная рабочая зона' },
];

export function ZoneRentalPage() {
  const { user } = useAuth();
  const [hours, setHours] = useState(4);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [pointsToSpend, setPointsToSpend] = useState(0);
  const [notice, setNotice] = useState('');
  const { list: loyaltyRows } = useEntity<{ user_id: number; points: number }>('loyalty_accounts', {
    fetchListOnMount: !!user,
    enabled: !!user,
    listParams: { limit: 50 },
  });
  const availablePoints = loyaltyRows.find((r) => r.user_id === user?.id)?.points ?? 0;
  const scrollToForm = useCallback(() => {
    const form = document.getElementById('form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const pricePerHour = 1500;
  const total = pricePerHour * hours;

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
              Аренда профессиональной зоны
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
              Рабочее место с оборудованием для грумеров: стол, ванна, сушка, инструменты. Идеально для практики и приёма клиентов.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                type="button"
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 px-10 py-4 btn-gradient-green text-white rounded-2xl font-bold text-lg shadow-lg shadow-[#40AB40]/30 hover:shadow-xl transition-shadow"
              >
                <Calendar className="w-6 h-6" />
                Оставить заявку
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-16">
        {/* Что входит */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold flex items-center gap-3 text-[#40AB40]">
            <Scissors className="w-9 h-9" />
            Что входит
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-4 p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border-2 border-[#40AB40]/20 hover:border-[#40AB40]/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#40AB40]/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#40AB40]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{f.label}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Расходники (шампуни, полотенца) — по договорённости. Зона аренды в учебном центре MARS GROOM.
          </p>
        </motion.section>

        {/* Стоимость — интерактивный калькулятор */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 shadow-xl border-2 border-[#40AB40]/20"
        >
          <h2 className="text-3xl font-bold flex items-center gap-3 text-[#40AB40] mb-6">
            <Clock className="w-9 h-9" />
            Стоимость
          </h2>
          <div className="flex flex-wrap items-center gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Часов</label>
              <input
                type="range"
                min={1}
                max={12}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-48 h-3 rounded-full accent-[#40AB40]"
              />
              <p className="text-2xl font-bold text-[#40AB40] mt-2">{hours} ч</p>
            </div>
            <div className="text-xl text-gray-600 dark:text-gray-300">
              {pricePerHour} ₽/ч → <span className="font-bold text-[#40AB40]">{total.toLocaleString()} ₽</span>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-[#40AB40]/10 dark:bg-[#40AB40]/20">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
              Итого: <span className="text-2xl font-bold text-[#40AB40]">{total.toLocaleString()} ₽</span>
            </p>
          </div>
        </motion.section>

        {/* Где находимся */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-l-4 border-[#40AB40]"
        >
          <h2 className="text-3xl font-bold flex items-center gap-3 text-[#40AB40] mb-4">
            <MapPin className="w-9 h-9" />
            Где находимся
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Зона аренды — в учебном центре MARS GROOM. Запись по согласованию с администрацией.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Оставьте заявку — мы подберём удобное время и отправим подтверждение.
          </p>
        </motion.section>

        {/* Форма заявки */}
        <motion.section
          id="form"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 shadow-xl border-2 border-[#40AB40]/20"
        >
          <h2 className="text-3xl font-bold flex items-center gap-3 text-[#40AB40] mb-6">
            Оставьте свою заявку на аренду стола!
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void (async () => {
                const res = await api.post('/zone_rental_applications', {
                  user_id: user?.id ?? null,
                  name,
                  phone,
                  email,
                  hours,
                  message: message || null,
                  points_to_spend: Math.max(0, Math.min(pointsToSpend, availablePoints)),
                });
                if ('error' in res) setNotice(res.error || 'Не удалось отправить заявку');
                else setNotice('Заявка отправлена! Мы свяжемся с вами для подтверждения.');
              })();
            }}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Ваше имя"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#40AB40] focus:border-transparent transition-shadow"
            />
            <input
              type="tel"
              placeholder="Телефон"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#40AB40] focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#40AB40] focus:border-transparent"
            />
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Желаемое кол-во часов</label>
              <input
                type="number"
                min={1}
                max={12}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value) || 1)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#40AB40]"
              />
            </div>
            <textarea
              placeholder="Даты, пожелания"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#40AB40]"
            />
            {user ? (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Списать лапки</label>
                <input
                  type="number"
                  min={0}
                  max={availablePoints}
                  value={pointsToSpend}
                  onChange={(e) => setPointsToSpend(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#40AB40]"
                />
                <p className="text-xs text-gray-500 mt-1">Доступно: {availablePoints} лапок</p>
              </div>
            ) : null}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="mt-1 w-5 h-5 rounded border-gray-300 accent-[#40AB40]" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Даю согласие на{' '}
                <Link to="/personal-data" className="underline font-medium text-[#40AB40] hover:opacity-80">
                  обработку персональных данных
                </Link>
              </span>
            </label>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 btn-gradient-green text-white rounded-xl font-bold text-lg"
            >
              <Mail className="w-5 h-5" />
              Отправить заявку
            </button>
            {notice ? <p className="text-sm text-[#40AB40]">{notice}</p> : null}
          </form>
        </motion.section>

        <div className="text-center pb-12">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-[#40AB40] font-medium hover:underline"
          >
            ← Обучение и курсы
          </Link>
        </div>
      </div>
    </div>
  );
}
