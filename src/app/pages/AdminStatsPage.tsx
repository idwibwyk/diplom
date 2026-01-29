import { motion } from 'motion/react';
import { TrendingUp, DollarSign, Users, Calendar, Inbox } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

const MONTH_DATA = [
  { month: 'Янв', revenue: 320000, bookings: 128 },
  { month: 'Фев', revenue: 380000, bookings: 152 },
  { month: 'Мар', revenue: 410000, bookings: 164 },
  { month: 'Апр', revenue: 350000, bookings: 140 },
  { month: 'Май', revenue: 440000, bookings: 176 },
  { month: 'Июн', revenue: 480000, bookings: 192 },
];

export function AdminStatsPage() {
  const totalRevenue = MONTH_DATA.reduce((a, b) => a + b.revenue, 0);
  const totalBookings = MONTH_DATA.reduce((a, b) => a + b.bookings, 0);

  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Статистика и аналитика
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Ключевые показатели и графики</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#4A90E2]/20"
        >
          <DollarSign className="w-10 h-10 text-[#4A90E2] mb-2" />
          <p className="text-2xl font-bold text-[#4A90E2]">{totalRevenue.toLocaleString('ru-RU')} ₽</p>
          <p className="text-sm text-gray-500">Выручка за 6 мес.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#4A90E2]/20"
        >
          <Calendar className="w-10 h-10 text-[#4A90E2] mb-2" />
          <p className="text-2xl font-bold">{totalBookings}</p>
          <p className="text-sm text-gray-500">Записей за 6 мес.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#4A90E2]/20"
        >
          <Users className="w-10 h-10 text-[#4A90E2] mb-2" />
          <p className="text-2xl font-bold">847</p>
          <p className="text-sm text-gray-500">Клиентов в базе</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#4A90E2]/20"
        >
          <Inbox className="w-10 h-10 text-[#4A90E2] mb-2" />
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-gray-500">Заявок за сегодня</p>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#4A90E2]" />
            Выручка по месяцам
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTH_DATA}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="month" className="text-sm" />
                <YAxis className="text-sm" tickFormatter={(v) => `${(v / 1000).toFixed(0)}к`} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString('ru-RU')} ₽`, 'Выручка']} />
                <Bar dataKey="revenue" fill="#4A90E2" radius={[4, 4, 0, 0]} name="Выручка" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="font-bold text-lg mb-4">Записи по месяцам</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTH_DATA}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="month" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#4A90E2" strokeWidth={2} dot={{ fill: '#4A90E2' }} name="Записи" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
