import { motion } from 'motion/react';
import { CalendarClock, Clock } from 'lucide-react';

const UPCOMING = [
  { id: 1, date: '2026-02-05', time: '10:00', service: 'Комплексная стрижка', master: 'Анна Петрова', pet: 'Барсик' },
  { id: 2, date: '2026-02-12', time: '14:30', service: 'Гигиенический уход', master: 'Мария Иванова', pet: 'Барсик' },
];

export function DashboardSchedulePage() {
  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Расписание записей
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Ближайшие визиты</p>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="space-y-4">
          {UPCOMING.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-[#53C9CA]/10 dark:bg-[#53C9CA]/20 border border-[#53C9CA]/30"
            >
              <div className="flex items-center gap-2 text-[#53C9CA]">
                <CalendarClock className="w-5 h-5" />
                <span className="font-medium">{new Date(b.date).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Clock className="w-5 h-5" />
                <span>{b.time}</span>
              </div>
              <div className="flex-1">
                <p className="font-bold">{b.service}</p>
                <p className="text-sm text-gray-500">{b.master} · {b.pet}</p>
              </div>
              <button type="button" className="px-4 py-2 bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors">
                Отменить
              </button>
            </motion.div>
          ))}
        </div>
        {UPCOMING.length === 0 && (
          <p className="text-center text-gray-500 py-8">Нет предстоящих записей</p>
        )}
      </div>
    </div>
  );
}
