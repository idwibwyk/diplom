import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  Calendar,
  CalendarClock,
  Bell,
  Star,
  Dog,
  GraduationCap,
} from 'lucide-react';
<<<<<<< Updated upstream
import { useEntity } from '@/app/hooks';
import { useAuth } from '@/app/context/AuthContext';
import { getUploadBaseUrl } from '@/app/api/client';
=======
import { useAuth } from '@/app/context/AuthContext';
import { useEntity } from '@/app/hooks';
import { api } from '@/app/api/client';
import { useEffect, useMemo, useState } from 'react';
import { homeworkFromBooking } from '@/app/lib/learnerBookingFields';
>>>>>>> Stashed changes

const SIDEBAR = [
  { to: '/dashboard', label: 'Обзор', icon: LayoutDashboard },
  { to: '/dashboard/favorites', label: 'Избранное', icon: Heart },
  { to: '/dashboard/schedule', label: 'Записи на услугу', icon: CalendarClock },
  { to: '/dashboard/notifications', label: 'Уведомления и рассылки', icon: Bell },
  { to: '/dashboard/reviews', label: 'Отзывы', icon: Star },
  { to: '/dashboard/pets', label: 'Питомцы', icon: Dog },
<<<<<<< Updated upstream
  // История посещений — последним пунктом меню
  { to: '/dashboard/visits', label: 'История посещений', icon: Calendar },
=======
  { to: '/dashboard/my-courses', label: 'Мои курсы', icon: GraduationCap },
  { to: '/dashboard/health', label: 'Дневник питомца', icon: Heart },
  { to: '/book/service', label: 'Записаться на услугу', icon: CreditCard },
  { to: '/services/list', label: 'Прайс-лист', icon: CreditCard },
  { to: '/services/blog', label: 'Блог', icon: FileText },
  { to: '/courses', label: 'Курсы', icon: BookOpen },
>>>>>>> Stashed changes
];

export function ClientDashboardLayout() {
  const location = useLocation();
  const { user } = useAuth();
<<<<<<< Updated upstream
  const { list: pets } = useEntity<{ id: number; name: string; photo?: string | null }>('pets', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 100 } });
  const { list: notifications } = useEntity<{ id: number; read_at?: string | null }>('notifications', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 100 } });
  const unreadCount = notifications.filter((n) => !n.read_at).length;
  const petPhotoUrl = (photo?: string | null) => {
    if (!photo) return 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200';
    if (photo.startsWith('http')) return photo;
    return getUploadBaseUrl() + photo;
  };
=======
  const { list: bookings } = useEntity<{ id: number; user_id: number; course_id: number; status: string; homework_text?: string | null }>('course_bookings', {
    fetchListOnMount: !!user,
    enabled: !!user,
    listParams: { limit: 300 },
  });
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [hasPendingHomework, setHasPendingHomework] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  const myPaidBookings = useMemo(
    () => bookings.filter((b) => b.user_id === user?.id && b.status === 'оплачен'),
    [bookings, user?.id]
  );

  useEffect(() => {
    const onHomeworkUpdated = () => setRefreshTick((v) => v + 1);
    window.addEventListener('homework:updated', onHomeworkUpdated as EventListener);
    return () => window.removeEventListener('homework:updated', onHomeworkUpdated as EventListener);
  }, []);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const unreadRes = await api.get<{ success?: boolean; data?: Array<{ sender_id: number; unread_count: number }> }>('/conversations/unread-summary');
      if (!('error' in unreadRes)) {
        const rows = Array.isArray(unreadRes.data?.data) ? unreadRes.data.data : [];
        setUnreadMessages(rows.reduce((sum, r) => sum + Number(r.unread_count || 0), 0));
      }
      const courseIds = myPaidBookings.map((b) => b.course_id);
      if (courseIds.length === 0) {
        setHasPendingHomework(false);
        return;
      }
      const submissionRes = await api.get<{ success?: boolean; data?: Array<{ course_id: number }> }>('/course_homework_submissions/mine');
      const submittedCourseIds = new Set(
        'error' in submissionRes ? [] : (Array.isArray(submissionRes.data?.data) ? submissionRes.data.data.map((s) => s.course_id) : [])
      );
      const hasHomeworkFromGroomer = myPaidBookings.some((b) => homeworkFromBooking(b).length > 0);
      const hasUnsentHomework = myPaidBookings.some((b) => homeworkFromBooking(b).length > 0 && !submittedCourseIds.has(b.course_id));
      setHasPendingHomework(hasHomeworkFromGroomer && hasUnsentHomework);
    })();
  }, [user, myPaidBookings, location.pathname, refreshTick]);

  const hasCoursesDot = unreadMessages > 0 || hasPendingHomework;
>>>>>>> Stashed changes

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
            const showDot = to === '/dashboard/my-courses' && hasCoursesDot;
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
<<<<<<< Updated upstream
                {to === '/dashboard/notifications' && unreadCount > 0 ? (
                  <span className="ml-auto inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                ) : null}
=======
                {showDot ? <span className="ml-auto h-2.5 w-2.5 rounded-full bg-red-500" /> : null}
>>>>>>> Stashed changes
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
