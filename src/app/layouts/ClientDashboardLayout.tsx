import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  Calendar,
  CalendarClock,
  Bell,
  Star,
  CreditCard,
  FileText,
  BookOpen,
  Dog,
} from 'lucide-react';

const SIDEBAR = [
  { to: '/dashboard', label: 'Обзор', icon: LayoutDashboard },
  { to: '/dashboard/favorites', label: 'Избранное', icon: Heart },
  { to: '/dashboard/visits', label: 'История посещений', icon: Calendar },
  { to: '/dashboard/schedule', label: 'Расписание записей', icon: CalendarClock },
  { to: '/dashboard/notifications', label: 'Уведомления и рассылки', icon: Bell },
  { to: '/dashboard/reviews', label: 'Отзывы', icon: Star },
  { to: '/dashboard/pets', label: 'Питомцы', icon: Dog },
  { to: '/dashboard/health', label: 'Дневник питомца', icon: Heart },
  { to: '/book/service', label: 'Записаться на услугу', icon: CreditCard },
  { to: '/services/list', label: 'Прайс-лист', icon: CreditCard },
  { to: '/services/blog', label: 'Блог', icon: FileText },
  { to: '/courses', label: 'Курсы', icon: BookOpen },
];

export function ClientDashboardLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex">
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <h2 className="font-bold text-lg mb-4 text-[#53C9CA]">Личный кабинет</h2>
        <nav className="space-y-1">
          {SIDEBAR.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
            return (
              <Link
                key={to + label}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  active ? 'bg-[#53C9CA]/20 text-[#53C9CA]' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
