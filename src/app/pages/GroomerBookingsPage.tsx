import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Dog, Filter } from 'lucide-react';

const MOCK_BOOKINGS = [
  { id: 1, date: '2026-01-27', time: '10:00', client: 'Мария К.', pet: 'Барсик (Шпиц)', service: 'Комплексная стрижка', status: 'confirmed' },
  { id: 2, date: '2026-01-27', time: '12:00', client: 'Алексей П.', pet: 'Муся (Перс)', service: 'Гигиенический уход', status: 'confirmed' },
  { id: 3, date: '2026-01-27', time: '14:30', client: 'Ольга С.', pet: 'Рекс (Лабрадор)', service: 'Стрижка лабрадора', status: 'pending' },
  { id: 4, date: '2026-01-28', time: '09:00', client: 'Ирина В.', pet: 'Зефирка (Пудель)', service: 'Креативная стрижка', status: 'confirmed' },
];

export function GroomerBookingsPage() {
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('today');

  const filtered = filter === 'today'
    ? MOCK_BOOKINGS.filter((b) => b.date === '2026-01-27')
    : filter === 'week'
      ? MOCK_BOOKINGS
      : MOCK_BOOKINGS;

  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Мои записи и график
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Ведение записей на услуги</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {(['today', 'week', 'all'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              filter === f ? 'bg-[#40AB40] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            {f === 'today' ? 'Сегодня' : f === 'week' ? 'Неделя' : 'Все'}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left px-6 py-4 font-bold text-gray-700 dark:text-gray-200">Дата / Время</th>
                <th className="text-left px-6 py-4 font-bold text-gray-700 dark:text-gray-200">Клиент</th>
                <th className="text-left px-6 py-4 font-bold text-gray-700 dark:text-gray-200">Питомец</th>
                <th className="text-left px-6 py-4 font-bold text-gray-700 dark:text-gray-200">Услуга</th>
                <th className="text-left px-6 py-4 font-bold text-gray-700 dark:text-gray-200">Статус</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <motion.tr
                  key={b.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-[#40AB40]/5"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4 text-[#40AB40]" />
                      {new Date(b.date).toLocaleDateString('ru-RU')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Clock className="w-4 h-4" />
                      {b.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      {b.client}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Dog className="w-4 h-4 text-gray-400" />
                      {b.pet}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{b.service}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      b.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                    }`}>
                      {b.status === 'confirmed' ? 'Подтверждено' : 'Ожидает'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
