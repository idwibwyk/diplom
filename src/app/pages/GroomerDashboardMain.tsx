import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutList, Calendar, GraduationCap, Image, Star, MessageCircle, TrendingUp, RussianRuble, Scissors } from 'lucide-react';

const QUICK = [
  { to: '/dashboard-groomer/board', label: 'Доска планирования', icon: LayoutList, desc: 'Записи на сегодня, в процессе, завершено' },
  { to: '/dashboard-groomer/bookings', label: 'Мои записи и график', icon: Calendar, desc: 'Ведение записей на услуги' },
  { to: '/dashboard-groomer/teaching', label: 'Обучение', icon: GraduationCap, desc: 'Курсы и ученики' },
  { to: '/dashboard-groomer/portfolio', label: 'Портфолио работ', icon: Image, desc: 'Лучшие работы' },
  { to: '/dashboard-groomer/reviews', label: 'Отзывы и рейтинг', icon: Star, desc: 'Отзывы клиентов' },
  { to: '/dashboard-groomer/chat', label: 'Чат с администратором', icon: MessageCircle, desc: 'Общение с админом' },
  { to: '/dashboard-groomer/stats', label: 'Статистика доходов', icon: TrendingUp, desc: 'Доходы и объём работ' },
];

export function GroomerDashboardMain() {
  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Личный кабинет грумера
      </motion.h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Добро пожаловать! Выберите раздел в меню слева.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#40AB40]/20"
        >
          <RussianRuble className="w-10 h-10 text-[#40AB40] mb-2" />
          <p className="text-2xl font-bold text-[#40AB40]">125 000 ₽</p>
          <p className="text-sm text-gray-500">За неделю</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#40AB40]/20"
        >
          <Scissors className="w-10 h-10 text-[#40AB40] mb-2" />
          <p className="text-2xl font-bold">50</p>
          <p className="text-sm text-gray-500">Процедур за неделю</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#40AB40]/20"
        >
          <Calendar className="w-10 h-10 text-[#40AB40] mb-2" />
          <p className="text-2xl font-bold">7</p>
          <p className="text-sm text-gray-500">Записей на сегодня</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#40AB40]/20"
        >
          <Star className="w-10 h-10 text-amber-400 mb-2" />
          <p className="text-2xl font-bold">4.9</p>
          <p className="text-sm text-gray-500">Рейтинг</p>
        </motion.div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUICK.map((q, i) => {
          const Icon = q.icon;
          return (
            <motion.div
              key={q.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.03 }}
            >
              <Link
                to={q.to}
                className="block p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow border-2 border-[#40AB40]/20 hover:border-[#40AB40]/50"
              >
                <Icon className="w-10 h-10 text-[#40AB40] mb-3" />
                <h2 className="font-bold text-lg mb-1">{q.label}</h2>
                <p className="text-sm text-gray-500">{q.desc}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
