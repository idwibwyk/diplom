import { motion } from 'motion/react';
import { Image } from 'lucide-react';

const MOCK_WORKS = [
  { id: 1, title: 'Стрижка шпица', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', date: '2026-01-15', likes: 24 },
  { id: 2, title: 'Креативная стрижка пуделя', img: 'https://images.unsplash.com/photo-1622286342621-4bd786d24494?w=400', date: '2026-01-10', likes: 18 },
  { id: 3, title: 'Гигиенический уход', img: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400', date: '2026-01-05', likes: 12 },
];

export function GroomerPortfolioPage() {
  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Портфолио работ
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Ваши лучшие работы</p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_WORKS.map((w, i) => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg group"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img src={w.img} alt={w.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{w.title}</h3>
              <p className="text-sm text-gray-500">{new Date(w.date).toLocaleDateString('ru-RU')} · {w.likes} ❤️</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
