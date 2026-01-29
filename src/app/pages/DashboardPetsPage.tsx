import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Dog, Heart } from 'lucide-react';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200';

const PETS = [
  { id: 1, name: 'Барсик', breed: 'Шпиц', age: 3, photo: 'https://images.unsplash.com/photo-1728448644193-34eb04460c95?w=400', loyaltyPoints: 85 },
];

export function DashboardPetsPage() {
  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Питомцы
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Ваши питомцы и дневники</p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PETS.map((pet, i) => (
          <motion.div
            key={pet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg flex flex-col"
          >
            <img
              src={pet.photo || DEFAULT_AVATAR}
              alt={pet.name}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-center">{pet.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm">{pet.breed} · {pet.age} года</p>
            <div className="flex items-center justify-center gap-2 mt-2 text-[#53C9CA]">
              <Heart className="w-5 h-5" />
              <span className="font-medium">{pet.loyaltyPoints} лапок</span>
            </div>
            <Link
              to="/dashboard/health"
              className="mt-4 mx-auto px-4 py-2 btn-gradient-teal text-white rounded-xl text-sm font-medium text-center"
            >
              Дневник питомца
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
