import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  LayoutList,
  Calendar,
  GraduationCap,
  Image,
  Star,
  MessageCircle,
  TrendingUp,
  MessagesSquare,
} from 'lucide-react';
import React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { api } from '@/app/api/client';

const SIDEBAR = [
  { to: '/dashboard-groomer', label: 'Главная', icon: LayoutDashboard },
  { to: '/dashboard-groomer/board', label: 'Доска планирования', icon: LayoutList },
  { to: '/dashboard-groomer/bookings', label: 'Мои записи и график', icon: Calendar },
  { to: '/dashboard-groomer/teaching', label: 'Обучение', icon: GraduationCap },
  { to: '/dashboard-groomer/portfolio', label: 'Портфолио работ', icon: Image },
  { to: '/dashboard-groomer/reviews', label: 'Отзывы и рейтинг', icon: Star },
  { to: '/dashboard-groomer/chat', label: 'Заметки грумера', icon: MessageCircle },
  { to: '/dashboard-groomer/work-chats', label: 'Рабочие чаты', icon: MessagesSquare },
  { to: '/dashboard-groomer/stats', label: 'Статистика доходов', icon: TrendingUp },
];

export function DashboardGroomerLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const [hasTeachingDot, setHasTeachingDot] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const onHomeworkReviewed = () => setRefreshTick((v) => v + 1);
    window.addEventListener('homework:reviewed', onHomeworkReviewed as EventListener);
    return () => window.removeEventListener('homework:reviewed', onHomeworkReviewed as EventListener);
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'groomer') return;
    void (async () => {
      const unreadRes = await api.get<{ success?: boolean; data?: Array<{ sender_id: number; unread_count: number }> }>('/conversations/unread-summary');
      const unreadCount = 'error' in unreadRes ? 0 : (Array.isArray(unreadRes.data?.data) ? unreadRes.data.data.reduce((s, r) => s + Number(r.unread_count || 0), 0) : 0);
      const pendingRes = await api.get<{ success?: boolean; data?: { count?: number } }>('/course_homework_submissions/groomer/pending-count');
      const pendingCount = 'error' in pendingRes ? 0 : Number(pendingRes.data?.data?.count ?? 0);
      setHasTeachingDot(unreadCount > 0 || pendingCount > 0);
    })();
  }, [user, location.pathname, refreshTick]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex">
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <h2 className="font-bold text-lg mb-4 text-[#40AB40]">Навигация</h2>
        <nav className="space-y-1">
          {SIDEBAR.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to || (to !== '/dashboard-groomer' && location.pathname.startsWith(to));
            const showDot = to === '/dashboard-groomer/teaching' && hasTeachingDot;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  active ? 'bg-[#40AB40]/20 text-[#40AB40]' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="truncate">{label}</span>
                {showDot ? <span className="ml-auto h-2.5 w-2.5 rounded-full bg-red-500" /> : null}
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
