import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Scissors, BookOpen } from 'lucide-react';
import { useFavoritesContext } from '@/app/context/FavoritesContext';
import { FavoriteButton } from '@/app/components/FavoriteButton';
import { services as allServices, courses as allCourses } from '@/app/data/mockData';

export function DashboardFavoritesPage() {
  const { favorites } = useFavoritesContext();
  const favServices = allServices.filter((s) => favorites.services.includes(s.id));
  const favCourses = allCourses.filter((c) => favorites.courses.includes(c.id));

  return (
    <div className="p-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-2"
      >
        Избранное
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Услуги и курсы, которые вы добавили в избранное
      </p>

      {favServices.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#53C9CA]">
            <Scissors className="w-6 h-6" />
            Услуги
          </h2>
          <ul className="space-y-3">
            {favServices.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Link to={`/services/${s.id}`} className="text-[#53C9CA] hover:underline font-medium flex-1">
                  {s.name}
                </Link>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/book/service/${s.id}`}
                    className="px-4 py-2 btn-gradient-teal text-white rounded-lg text-sm font-medium"
                  >
                    Записаться
                  </Link>
                  <FavoriteButton type="service" id={s.id} onClick={(e) => e.stopPropagation()} />
                </div>
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      {favCourses.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#53C9CA]">
            <BookOpen className="w-6 h-6" />
            Курсы
          </h2>
          <ul className="space-y-3">
            {favCourses.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Link to={`/courses/${c.id}`} className="text-[#53C9CA] hover:underline font-medium flex-1">
                  {c.name}
                </Link>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/book/course/${c.id}`}
                    className="px-4 py-2 btn-gradient-teal text-white rounded-lg text-sm font-medium"
                  >
                    Записаться
                  </Link>
                  <FavoriteButton type="course" id={c.id} onClick={(e) => e.stopPropagation()} />
                </div>
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      {favServices.length === 0 && favCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg text-center text-gray-500"
        >
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Пока ничего в избранном</p>
          <p className="text-sm mt-2">Добавляйте услуги и курсы на их страницах</p>
          <Link to="/services" className="inline-block mt-6 btn-gradient-teal text-white px-6 py-3 rounded-xl font-medium">
            К услугам
          </Link>
        </motion.div>
      )}
    </div>
  );
}
