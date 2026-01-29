import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const MOCK_REVIEWS = [
  { id: 1, client: 'Мария К.', rating: 5, text: 'Анна — профессионал! Барсик в восторге после каждой стрижки.', date: '2026-01-20' },
  { id: 2, client: 'Алексей П.', rating: 5, text: 'Очень аккуратно и внимательно. Рекомендую.', date: '2026-01-15' },
];

export function GroomerReviewsPage() {
  const avg = 4.9;
  const total = 127;

  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Отзывы и рейтинг
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Отзывы клиентов о вашей работе</p>

      <div className="flex flex-wrap gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#40AB40]/20">
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={`w-8 h-8 ${i <= Math.round(avg) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
            ))}
          </div>
          <p className="text-3xl font-bold text-[#40AB40]">{avg}</p>
          <p className="text-sm text-gray-500">Средний рейтинг · {total} отзывов</p>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_REVIEWS.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-l-4 border-[#40AB40]"
          >
            <div className="flex items-center gap-2 mb-2">
              {Array.from({ length: r.rating }).map((_, k) => (
                <Star key={k} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
              <span className="font-bold ml-2">{r.client}</span>
              <span className="text-sm text-gray-500 ml-auto">{new Date(r.date).toLocaleDateString('ru-RU')}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
              <Quote className="w-5 h-5 text-[#40AB40] flex-shrink-0 mt-0.5" />
              {r.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
