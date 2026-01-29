import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const REVIEWS = [
  { id: 1, service: 'Комплексная стрижка', master: 'Анна Петрова', rating: 5, text: 'Барсик в восторге, всё прошло отлично!', date: '2026-01-06' },
  { id: 2, service: 'Гигиенический уход', master: 'Мария Иванова', rating: 5, text: 'Быстро и аккуратно, рекомендую.', date: '2025-12-11' },
];

export function DashboardReviewsPage() {
  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Отзывы
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Ваши отзывы о визитах</p>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="space-y-4">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30"
            >
              <div className="flex items-center gap-2 mb-2">
                {Array.from({ length: r.rating }).map((_, k) => (
                  <Star key={k} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="font-bold">{r.service} · {r.master}</p>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{r.text}</p>
              <p className="text-sm text-gray-500 mt-2">{new Date(r.date).toLocaleDateString('ru-RU')}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
