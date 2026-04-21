import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Award,
  Settings,
  Calendar,
  FileText,
  Star,
  GraduationCap,
  Library,
  Video,
} from 'lucide-react';
import { useFavoritesContext } from '@/app/context/FavoritesContext';
import { FavoriteButton } from '@/app/components/FavoriteButton';
import { courses as allCourses } from '@/app/data/mockData';

const SIDEBAR_LINKS = [
  { to: '/dashboard-courses', label: 'Мои курсы', icon: BookOpen },
  { to: '/dashboard-courses', label: 'Прогресс', icon: Award },
  { to: '/courses/schedule', label: 'Расписание', icon: Calendar },
  { to: '/book/course', label: 'Записаться на курс', icon: Calendar },
  { to: '/courses/list', label: 'Все курсы', icon: GraduationCap },
  { to: '/courses/library', label: 'Библиотека знаний', icon: Library },
  { to: '/courses/blog', label: 'Блог', icon: FileText },
  { to: '/courses/reviews', label: 'Отзывы', icon: Star },
  { to: '/licenses', label: 'Сведения об организации', icon: FileText },
];

const MOCK_MY_COURSES = [
  { id: 1, name: 'Основы груминга собак', progress: 40, nextLesson: 'Урок 4' },
  { id: 2, name: 'Креативный груминг', progress: 0, nextLesson: 'Старт 1 марта' },
];

export function ClientDashboardCourses() {
  const [activeTab, setActiveTab] = useState<'courses' | 'progress'>('courses');
  const { favorites } = useFavoritesContext();
  const favCourses = allCourses.filter((c) => favorites.courses.includes(c.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#009B00]/5 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Личный кабинет</h1>
            <p className="text-gray-600 dark:text-gray-300">Обучение в MARS GROOM</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/book/course"
              className="flex items-center gap-2 px-6 py-3 bg-[#40AB40] text-white rounded-xl hover:bg-[#89E689] transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Записаться на курс
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
          {/* Левое меню */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg sticky top-6 border-2 border-[#40AB40]/20">
              <h3 className="font-bold mb-4 px-2 text-[#40AB40]">Меню</h3>
              <ul className="space-y-1">
                {SIDEBAR_LINKS.map(({ to, label, icon: Icon }) => (
                  <li key={to + label}>
                    <Link
                      to={to}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#40AB40]/10 dark:hover:bg-[#40AB40]/20 text-gray-700 dark:text-gray-300 hover:text-[#40AB40] transition-colors"
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Основной контент */}
          <div className="flex-1 min-w-0 space-y-8">
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="flex gap-2 mb-6">
                {(['courses', 'progress'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-[#40AB40] text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tab === 'courses' ? 'Мои курсы' : 'Прогресс'}
                  </button>
                ))}
              </div>

              {activeTab === 'courses' && (
                <div className="space-y-4">
                  {MOCK_MY_COURSES.map((c) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 border-[#40AB40]/20"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold">{c.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Следующее: {c.nextLesson}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#40AB40] rounded-full"
                              style={{ width: `${c.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{c.progress}%</span>
                          <Link
                            to={`/courses/${c.id}`}
                            className="px-4 py-2 bg-[#40AB40] hover:bg-[#89E689] text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Продолжить
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'progress' && (
                <div className="text-center py-12 text-gray-500">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Статистика по прохождению курсов (мок)</p>
                </div>
              )}
            </section>

            {favCourses.length > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="font-bold mb-4">Избранное</h3>
                <ul className="space-y-2">
                  {favCourses.map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Link to={`/courses/${c.id}`} className="text-[#40AB40] hover:underline truncate flex-1">
                        {c.name}
                      </Link>
                      <FavoriteButton type="course" id={c.id} onClick={(e) => e.stopPropagation()} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="bg-gradient-to-br from-[#40AB40] to-[#89E689] text-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Сертификаты</h3>
              <p className="mb-4 opacity-90">
                После прохождения курса вы получите сертификат MARS GROOM.
              </p>
              <Link
                to="/certificates"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#40AB40] rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                Подробнее
                <Award className="w-5 h-5" />
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
