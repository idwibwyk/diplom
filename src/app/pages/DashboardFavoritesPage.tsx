import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Scissors, BookOpen, Search, Filter, Calendar, ArrowRight, Clock, Users, Star } from 'lucide-react';
import { useFavoritesContext } from '@/app/context/FavoritesContext';
import { FavoriteButton } from '@/app/components/FavoriteButton';
import { useEntity } from '@/app/hooks';
import { useMemo, useState } from 'react';

export function DashboardFavoritesPage() {
  const formatPriceLabel = (value: string | null | undefined, fallback: number) => {
    const v = String(value || '').trim();
    if (!v) return `${fallback}₽`;
    if (/[₽р]/i.test(v)) return v;
    if (v.includes('-')) return `${v}₽`;
    if (v.startsWith('от ')) return `${v}₽`;
    return `${v}₽`;
  };
  const { favorites } = useFavoritesContext();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'services' | 'courses'>('all');

  const { list: services } = useEntity<any>('services', { fetchListOnMount: true, listParams: { limit: 200 } });
  const { list: courses } = useEntity<any>('courses', { fetchListOnMount: true, listParams: { limit: 200 } });

  const favServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services
      .filter((s: any) => favorites.services.includes(s.id))
      .filter((s: any) => !q || String(s.name || '').toLowerCase().includes(q) || String(s.description || '').toLowerCase().includes(q));
  }, [services, favorites.services, query]);

  const favCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses
      .filter((c: any) => favorites.courses.includes(c.id))
      .filter((c: any) => !q || String(c.name || '').toLowerCase().includes(q) || String(c.description || '').toLowerCase().includes(q));
  }, [courses, favorites.courses, query]);

  const showServices = typeFilter === 'all' || typeFilter === 'services';
  const showCourses = typeFilter === 'all' || typeFilter === 'courses';

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

      {(favServices.length > 0 || favCourses.length > 0) && (
        <div className="mb-8 rounded-2xl bg-white p-5 shadow-lg dark:bg-gray-800">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск в избранном…"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#53C9CA] dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  typeFilter === 'all' ? 'bg-[#53C9CA] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Filter className="h-4 w-4" />
                Всё
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('services')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  typeFilter === 'services' ? 'bg-[#53C9CA] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Scissors className="h-4 w-4" />
                Услуги
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('courses')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  typeFilter === 'courses' ? 'bg-[#53C9CA] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Курсы
              </button>
            </div>
          </div>
        </div>
      )}

      {(showServices && favServices.length > 0) || (showCourses && favCourses.length > 0) ? (
        <div className="grid gap-8 xl:grid-cols-2">
      {showServices && favServices.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg h-full"
        >
          <h2 className="mb-5 text-3xl font-extrabold text-black dark:text-white">
            Услуги
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {favServices.map((service: any, index: number) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/services/${service.id}`)}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl cursor-pointer group flex flex-col h-full border border-[#4A90E2]/10"
              >
                <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
                  <img
                    src={service.image || '/pictures/hero-section groom room services.jpg'}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-[#4A90E2] text-white px-3 py-1.5 rounded-full font-bold text-sm">
                    {formatPriceLabel(service.price_range, service.price)}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration}</span>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <FavoriteButton type="service" id={service.id} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{service.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm flex-1 line-clamp-3">{service.description}</p>
                  <div className="flex items-center gap-3 flex-wrap mt-4" onClick={(e) => e.stopPropagation()}>
                    <Link
                      to={`/services/${service.id}`}
                      className="flex items-center gap-2 text-[#4A90E2] font-bold hover:gap-4 transition-all text-sm"
                    >
                      Подробнее
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/book/service/${service.id}`}
                      className="flex items-center gap-2 px-3 py-2 bg-[#4A90E2] hover:bg-[#9EC3EF] text-white rounded-xl font-medium transition-colors text-sm"
                    >
                      <Calendar className="w-4 h-4" />
                      Записаться
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {showCourses && favCourses.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg h-full"
        >
          <h2 className="mb-5 text-3xl font-extrabold text-black dark:text-white">
            Курсы
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {favCourses.map((course: any, index: number) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/courses/${course.id}`)}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl cursor-pointer group flex flex-col h-full border border-[#53C9CA]/15"
              >
                <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
                  <img
                    src={course.image ?? '/pictures/The basics of dog grooming.jpg'}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white text-[#2b9fa0] px-3 py-1.5 rounded-full font-bold text-sm">
                    {Number(course.price || 0).toLocaleString()}₽
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" />{course.duration}</span>
                      <span className="inline-flex items-center gap-1"><Users className="w-4 h-4" />курс</span>
                      <span className="inline-flex items-center gap-1"><Star className="w-4 h-4 fill-[#EF476F] text-[#EF476F]" />4.8</span>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <FavoriteButton type="course" id={course.id} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{course.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm flex-1 line-clamp-3">{course.description}</p>
                  <div className="flex items-center gap-3 flex-wrap mt-4" onClick={(e) => e.stopPropagation()}>
                    <Link
                      to={`/courses/${course.id}`}
                      className="flex items-center gap-2 text-[#53C9CA] font-bold hover:gap-4 transition-all text-sm"
                    >
                      Подробнее
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/book/course/${course.id}`}
                      className="flex items-center gap-2 px-3 py-2 bg-[#53C9CA] hover:bg-[#9ADFE0] text-white rounded-xl font-medium transition-colors text-sm"
                    >
                      <Calendar className="w-4 h-4" />
                      Записаться
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
        </div>
      ) : null}

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

      {(query.trim() && favServices.length === 0 && favCourses.length === 0) ? (
        <div className="mt-8 rounded-2xl bg-white p-10 text-center text-gray-500 shadow-lg dark:bg-gray-800 dark:text-gray-400">
          По запросу «{query.trim()}» ничего не найдено.
        </div>
      ) : null}
    </div>
  );
}
