import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  Calendar,
  CalendarClock,
  Bell,
  Star,
  Dog,
} from 'lucide-react';
import { useEntity } from '@/app/hooks';
import { useAuth } from '@/app/context/AuthContext';
import { getUploadBaseUrl } from '@/app/api/client';

const SIDEBAR = [
  { to: '/dashboard', label: 'Обзор', icon: LayoutDashboard },
  { to: '/dashboard/favorites', label: 'Избранное', icon: Heart },
  { to: '/dashboard/schedule', label: 'Записи на услугу', icon: CalendarClock },
  { to: '/dashboard/notifications', label: 'Уведомления и рассылки', icon: Bell },
  { to: '/dashboard/reviews', label: 'Отзывы', icon: Star },
  { to: '/dashboard/pets', label: 'Питомцы', icon: Dog },
  // История посещений — последним пунктом меню
  { to: '/dashboard/visits', label: 'История посещений', icon: Calendar },
];

export function ClientDashboardLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const { list: pets } = useEntity<{ id: number; name: string; photo?: string | null }>('pets', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 100 } });
  const { list: notifications } = useEntity<{ id: number; read_at?: string | null }>('notifications', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 100 } });
  const unreadCount = notifications.filter((n) => !n.read_at).length;
  const petPhotoUrl = (photo?: string | null) => {
    if (!photo) return 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200';
    if (photo.startsWith('http')) return photo;
    return getUploadBaseUrl() + photo;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex">
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <h2 className="font-bold text-lg mb-4 text-[#53C9CA]">Личный кабинет</h2>
        <div className="mb-4 rounded-xl border border-[#53C9CA]/25 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#53C9CA]">Мои питомцы</p>
          <div className="flex flex-wrap gap-3">
            {pets.map((p) => (
              <Link key={p.id} to={`/dashboard/health?petId=${p.id}`} className="flex flex-col items-center gap-1 w-14">
                <img
                  src={petPhotoUrl(p.photo)}
                  alt={p.name}
                  className={`h-12 w-12 rounded-full object-cover border-2 ${
                    location.pathname.startsWith('/dashboard/health') ? 'border-[#53C9CA]' : 'border-gray-200 dark:border-gray-700'
                  }`}
                />
                <span className="text-[10px] leading-tight text-center text-gray-600 dark:text-gray-300">{p.name}</span>
              </Link>
            ))}
            <Link to="/dashboard/pets" className="flex flex-col items-center gap-1 w-14">
              <span className="h-12 w-12 rounded-full border-2 border-dashed border-[#53C9CA] text-[#53C9CA] flex items-center justify-center text-xl">+</span>
              <span className="text-[10px] leading-tight text-center text-gray-600 dark:text-gray-300">Добавить</span>
            </Link>
          </div>
        </div>
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
                {to === '/dashboard/notifications' && unreadCount > 0 ? (
                  <span className="ml-auto inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                ) : null}
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
