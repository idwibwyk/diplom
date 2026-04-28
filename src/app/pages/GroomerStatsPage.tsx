import { motion } from 'motion/react';
import { TrendingUp, Calendar, RussianRuble, Scissors } from 'lucide-react';
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
  { day: 'Пн', sum: 12000, count: 5 },
  { day: 'Вт', sum: 15000, count: 6 },
  { day: 'Ср', sum: 18000, count: 7 },
  { day: 'Чт', sum: 14000, count: 6 },
  { day: 'Пт', sum: 22000, count: 9 },
  { day: 'Сб', sum: 28000, count: 11 },
  { day: 'Вс', sum: 16000, count: 6 },
];

export function GroomerStatsPage() {
  const totalWeek = WEEK_DATA.reduce((a, b) => a + b.sum, 0);
  const totalCount = WEEK_DATA.reduce((a, b) => a + b.count, 0);

  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Статистика доходов
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Доходы и объём работ</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#40AB40]/20"
        >
          <RussianRuble className="w-10 h-10 text-[#40AB40] mb-3" />
          <p className="text-2xl font-bold text-[#40AB40]">{totalWeek.toLocaleString('ru-RU')} ₽</p>
          <p className="text-sm text-gray-500">За неделю</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#40AB40]/20"
        >
          <Scissors className="w-10 h-10 text-[#40AB40] mb-3" />
          <p className="text-2xl font-bold">{totalCount}</p>
          <p className="text-sm text-gray-500">Процедур за неделю</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#40AB40]/20"
        >
          <TrendingUp className="w-10 h-10 text-[#40AB40] mb-3" />
          <p className="text-2xl font-bold">{Math.round(totalWeek / totalCount).toLocaleString('ru-RU')} ₽</p>
          <p className="text-sm text-gray-500">Средний чек</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#40AB40]/20"
        >
          <Calendar className="w-10 h-10 text-[#40AB40] mb-3" />
          <p className="text-2xl font-bold">3</p>
          <p className="text-sm text-gray-500">Записей на завтра</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <h3 className="font-bold text-lg mb-4">Доход по дням (неделя)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WEEK_DATA}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis dataKey="day" className="text-sm" />
              <YAxis className="text-sm" tickFormatter={(v) => `${v / 1000}к`} />
              <Tooltip formatter={(v: number) => [`${v.toLocaleString('ru-RU')} ₽`, 'Доход']} />
              <Bar dataKey="sum" fill="#40AB40" radius={[4, 4, 0, 0]} name="Доход" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
