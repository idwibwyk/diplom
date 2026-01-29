import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Settings,
  Trash2,
  Calendar,
  Star,
  CreditCard,
} from 'lucide-react';
import { LoyaltySystem } from '@/app/components/LoyaltySystem';
import { PersonalRecommendations, getRecommendations } from '@/app/components/PersonalRecommendations';
import { useFavoritesContext } from '@/app/context/FavoritesContext';
import { FavoriteButton } from '@/app/components/FavoriteButton';
import { services as allServices } from '@/app/data/mockData';

const DEFAULT_PET_AVATAR = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200';

export function ClientDashboard() {
  const [pets] = useState([
    {
      id: 1,
      name: 'Барсик',
      breed: 'Шпиц',
      age: 3,
      photo: 'https://images.unsplash.com/photo-1728448644193-34eb04460c95?w=400',
      loyaltyPoints: 85,
    },
  ]);

  const { favorites } = useFavoritesContext();
  const favServices = allServices.filter((s) => favorites.services.includes(s.id));

  const [visits] = useState([
    { id: 1, date: '2026-01-05', service: 'Комплексная стрижка', master: 'Анна Петрова', cost: 2500, notes: 'Отличная работа! Барсик доволен' },
    { id: 2, date: '2025-12-10', service: 'Гигиенический уход', master: 'Мария Иванова', cost: 1800, notes: '' },
  ]);

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Обзор</h1>
          <p className="text-gray-600 dark:text-gray-300">Добро пожаловать, Мария!</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/book/service"
            className="flex items-center gap-2 px-6 py-3 btn-gradient-teal text-white rounded-xl font-medium"
          >
            <Calendar className="w-5 h-5" />
            Записаться на услугу
          </Link>
          <button
            type="button"
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <Settings className="w-5 h-5" />
            Настройки
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0 space-y-8">
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Мой питомец</h2>
            {pets.map((pet) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-gradient-to-r from-[#53C9CA]/10 to-[#9ADFE0]/10 dark:from-[#53C9CA]/20 dark:to-[#9ADFE0]/20 rounded-2xl"
              >
                <img
                  src={pet.photo || DEFAULT_PET_AVATAR}
                  alt={pet.name}
                  className="w-24 h-24 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{pet.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{pet.breed} · {pet.age} года</p>
                  <div className="flex items-center gap-2 text-[#53C9CA] font-medium mb-3">
                    <Heart className="w-5 h-5" />
                    {pet.loyaltyPoints} лапок
                  </div>
                  <Link
                    to="/dashboard/health"
                    className="inline-flex items-center gap-2 px-4 py-2 btn-gradient-teal text-white rounded-xl font-medium"
                  >
                    <Heart className="w-4 h-4" />
                    Дневник питомца
                  </Link>
                </div>
                <button type="button" className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg" aria-label="Удалить">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </motion.div>
            ))}
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">История посещений</h2>
              <Link to="/dashboard/visits" className="text-[#53C9CA] hover:underline text-sm font-medium">
                Вся история →
              </Link>
            </div>
            <div className="space-y-4">
              {visits.slice(0, 2).map((visit) => (
                <motion.div
                  key={visit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border-l-4 border-[#53C9CA] pl-6 py-4"
                >
                  <div className="flex flex-wrap justify-between gap-4">
                    <div>
                      <p className="font-bold text-lg">{visit.service}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Мастер: {visit.master}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#53C9CA]">{visit.cost}₽</p>
                      <p className="text-sm text-gray-500">{new Date(visit.date).toLocaleDateString('ru-RU')}</p>
                    </div>
                  </div>
                  {visit.notes && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 italic">«{visit.notes}»</p>}
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:w-80 flex-shrink-0 space-y-6">
          {favServices.length > 0 && (
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold mb-4">Избранное</h3>
              <ul className="space-y-2">
                {favServices.slice(0, 5).map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Link to={`/services/${s.id}`} className="text-[#53C9CA] hover:underline truncate flex-1">{s.name}</Link>
                    <FavoriteButton type="service" id={s.id} onClick={(e) => e.stopPropagation()} />
                  </li>
                ))}
              </ul>
              <Link to="/dashboard/favorites" className="block mt-3 text-[#53C9CA] hover:underline text-sm font-medium">
                Всё избранное →
              </Link>
            </section>
          )}
          <LoyaltySystem points={85} totalForDiscount={100} discountPercent={15} />
          <PersonalRecommendations recommendations={getRecommendations(['shpitz'], [])} />
        </div>
      </div>
    </div>
  );
}
