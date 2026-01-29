import { motion } from 'motion/react';

const VISITS = [
  { id: 1, date: '2026-01-05', service: 'Комплексная стрижка', master: 'Анна Петрова', cost: 2500, notes: 'Отличная работа! Барсик доволен' },
  { id: 2, date: '2025-12-10', service: 'Гигиенический уход', master: 'Мария Иванова', cost: 1800, notes: '' },
  { id: 3, date: '2025-11-20', service: 'Стрижка шпица', master: 'Елена Смирнова', cost: 2200, notes: 'Рекомендовали уход за шерстью' },
];

export function DashboardVisitsPage() {
  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        История посещений
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Все визиты в MARS GROOM</p>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="space-y-4">
          {VISITS.map((visit, i) => (
            <motion.div
              key={visit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-l-4 border-[#53C9CA] pl-6 py-4 rounded-r-xl bg-gray-50 dark:bg-gray-700/30"
            >
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <p className="font-bold text-lg">{visit.service}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Мастер: {visit.master}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#53C9CA]">{visit.cost} ₽</p>
                  <p className="text-sm text-gray-500">{new Date(visit.date).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
              {visit.notes && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 italic">«{visit.notes}»</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
