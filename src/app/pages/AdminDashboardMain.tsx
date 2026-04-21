import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Inbox, Calendar, DollarSign, Users, TrendingUp, FileBarChart, Scissors, LayoutList, BookOpen, Send } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

const WEEK_DATA = [
  { day: 'Пн', sum: 85000, bookings: 28 },
  { day: 'Вт', sum: 92000, bookings: 32 },
  { day: 'Ср', sum: 78000, bookings: 25 },
  { day: 'Чт', sum: 105000, bookings: 38 },
  { day: 'Пт', sum: 118000, bookings: 42 },
  { day: 'Сб', sum: 145000, bookings: 51 },
  { day: 'Вс', sum: 97000, bookings: 33 },
];

const MONTH_DATA = [
  { month: 'Янв', revenue: 320000, courses: 180000 },
  { month: 'Фев', revenue: 380000, courses: 220000 },
  { month: 'Мар', revenue: 410000, courses: 250000 },
  { month: 'Апр', revenue: 395000, courses: 230000 },
  { month: 'Май', revenue: 450000, courses: 270000 },
  { month: 'Июн', revenue: 480000, courses: 290000 },
];

const CATEGORY_DATA = [
  { name: 'Услуги груминга', value: 62, color: '#4A90E2' },
  { name: 'Курсы', value: 28, color: '#40AB40' },
  { name: 'Другое', value: 10, color: '#53C9CA' },
];

export function AdminDashboardMain() {
  const totalWeek = WEEK_DATA.reduce((a, b) => a + b.sum, 0);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] bg-clip-text text-transparent">
        Личный кабинет администратора
      </motion.h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Управление заявками, услугами, курсами и аналитика.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#4A90E2]/20 hover:shadow-xl transition-shadow">
          <DollarSign className="w-10 h-10 text-[#4A90E2] mb-2" />
          <p className="text-2xl font-bold text-[#4A90E2]">{totalWeek.toLocaleString('ru-RU')} ₽</p>
          <p className="text-sm text-gray-500">Выручка за неделю</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#4A90E2]/20 hover:shadow-xl transition-shadow">
          <Inbox className="w-10 h-10 text-[#4A90E2] mb-2" />
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-gray-500">Заявок за сегодня</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#4A90E2]/20 hover:shadow-xl transition-shadow">
          <Calendar className="w-10 h-10 text-[#4A90E2] mb-2" />
          <p className="text-2xl font-bold">34</p>
          <p className="text-sm text-gray-500">Записей на сегодня</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#4A90E2]/20 hover:shadow-xl transition-shadow">
          <Users className="w-10 h-10 text-[#4A90E2] mb-2" />
          <p className="text-2xl font-bold">847</p>
          <p className="text-sm text-gray-500">Клиентов в базе</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-[#4A90E2]" />
            Структура выручки
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`, 'Доля']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#4A90E2]" />
          Выручка за полгода (услуги и курсы)
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MONTH_DATA}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis dataKey="month" className="text-sm" />
              <YAxis className="text-sm" tickFormatter={(v) => `${(v / 1000).toFixed(0)}к`} />
              <Tooltip formatter={(v: number) => [v.toLocaleString('ru-RU') + ' ₽', '']} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#4A90E2" strokeWidth={2} name="Всего выручка" dot={{ fill: '#4A90E2' }} />
              <Line type="monotone" dataKey="courses" stroke="#40AB40" strokeWidth={2} name="Курсы" dot={{ fill: '#40AB40' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/dashboard-admin/board" className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow border-2 border-[#4A90E2]/20 hover:border-[#4A90E2]/50 flex items-center gap-4">
          <LayoutList className="w-10 h-10 text-[#4A90E2]" />
          <div>
            <h2 className="font-bold text-lg">Доска планирования</h2>
            <p className="text-sm text-gray-500">Все мастера, записи по колонкам</p>
          </div>
        </Link>
        <Link to="/dashboard-admin/applications" className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow border-2 border-[#4A90E2]/20 hover:border-[#4A90E2]/50 flex items-center gap-4">
          <Inbox className="w-10 h-10 text-[#4A90E2]" />
          <div>
            <h2 className="font-bold text-lg">Заявки</h2>
            <p className="text-sm text-gray-500">Позвонить сегодня, все заявки</p>
          </div>
        </Link>
        <Link to="/dashboard-admin/stats" className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow border-2 border-[#4A90E2]/20 hover:border-[#4A90E2]/50 flex items-center gap-4">
          <FileBarChart className="w-10 h-10 text-[#4A90E2]" />
          <div>
            <h2 className="font-bold text-lg">Статистика и аналитика</h2>
            <p className="text-sm text-gray-500">Графики и отчёты</p>
          </div>
        </Link>
        <Link to="/dashboard-admin/services-add" className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow border-2 border-[#4A90E2]/20 hover:border-[#4A90E2]/50 flex items-center gap-4">
          <Scissors className="w-10 h-10 text-[#4A90E2]" />
          <div>
            <h2 className="font-bold text-lg">Каталог услуг</h2>
            <p className="text-sm text-gray-500">Добавление услуг</p>
          </div>
        </Link>
        <Link to="/dashboard-admin/courses-add" className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow border-2 border-[#4A90E2]/20 hover:border-[#4A90E2]/50 flex items-center gap-4">
          <BookOpen className="w-10 h-10 text-[#4A90E2]" />
          <div>
            <h2 className="font-bold text-lg">Каталог курсов</h2>
            <p className="text-sm text-gray-500">Добавление курсов</p>
          </div>
        </Link>
        <Link to="/dashboard-admin/sms" className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow border-2 border-[#4A90E2]/20 hover:border-[#4A90E2]/50 flex items-center gap-4">
          <Send className="w-10 h-10 text-[#4A90E2]" />
          <div>
            <h2 className="font-bold text-lg">SMS-рассылки</h2>
            <p className="text-sm text-gray-500">Кампании и получатели</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
