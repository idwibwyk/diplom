import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Inbox, Calendar, DollarSign, Users, TrendingUp, FileBarChart, Scissors } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const WEEK_DATA = [
  { day: 'Пн', sum: 85000 },
  { day: 'Вт', sum: 92000 },
  { day: 'Ср', sum: 78000 },
  { day: 'Чт', sum: 105000 },
  { day: 'Пт', sum: 118000 },
  { day: 'Сб', sum: 145000 },
  { day: 'Вс', sum: 97000 },
];

export function AdminDashboardMain() {
  const totalWeek = WEEK_DATA.reduce((a, b) => a + b.sum, 0);

  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Личный кабинет администратора
      </motion.h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Управление заявками, услугами и курсами.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#4A90E2]/20"
        >
          <DollarSign className="w-10 h-10 text-[#4A90E2] mb-2" />
          <p className="text-2xl font-bold text-[#4A90E2]">{totalWeek.toLocaleString('ru-RU')} ₽</p>
          <p className="text-sm text-gray-500">Выручка за неделю</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#4A90E2]/20"
        >
          <Inbox className="w-10 h-10 text-[#4A90E2] mb-2" />
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-gray-500">Заявок за сегодня</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#4A90E2]/20"
        >
          <Calendar className="w-10 h-10 text-[#4A90E2] mb-2" />
          <p className="text-2xl font-bold">34</p>
          <p className="text-sm text-gray-500">Записей на сегодня</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#4A90E2]/20"
        >
          <Users className="w-10 h-10 text-[#4A90E2] mb-2" />
          <p className="text-2xl font-bold">847</p>
          <p className="text-sm text-gray-500">Клиентов в базе</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8"
      >
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#4A90E2]" />
          Выручка по дням (неделя)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WEEK_DATA}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis dataKey="day" className="text-sm" />
              <YAxis className="text-sm" tickFormatter={(v) => `${(v / 1000).toFixed(0)}к`} />
              <Tooltip formatter={(v: number) => [`${v.toLocaleString('ru-RU')} ₽`, 'Выручка']} />
              <Bar dataKey="sum" fill="#4A90E2" radius={[4, 4, 0, 0]} name="Выручка" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/dashboard-admin/applications"
          className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow border-2 border-[#4A90E2]/20 hover:border-[#4A90E2]/50 flex items-center gap-4"
        >
          <Inbox className="w-10 h-10 text-[#4A90E2]" />
          <div>
            <h2 className="font-bold text-lg">Заявки</h2>
            <p className="text-sm text-gray-500">Позвонить сегодня, все заявки</p>
          </div>
        </Link>
        <Link
          to="/dashboard-admin/stats"
          className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow border-2 border-[#4A90E2]/20 hover:border-[#4A90E2]/50 flex items-center gap-4"
        >
          <FileBarChart className="w-10 h-10 text-[#4A90E2]" />
          <div>
            <h2 className="font-bold text-lg">Статистика и аналитика</h2>
            <p className="text-sm text-gray-500">Графики и отчёты</p>
          </div>
        </Link>
        <Link
          to="/dashboard-admin/services-add"
          className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow border-2 border-[#4A90E2]/20 hover:border-[#4A90E2]/50 flex items-center gap-4"
        >
          <Scissors className="w-10 h-10 text-[#4A90E2]" />
          <div>
            <h2 className="font-bold text-lg">Каталог услуг</h2>
            <p className="text-sm text-gray-500">Добавление услуг</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
