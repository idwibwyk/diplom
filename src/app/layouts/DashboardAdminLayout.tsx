import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  LayoutList,
  Calendar,
  FileBarChart,
  Users,
  MessageSquare,
  Send,
  Database,
  Package,
  Wallet,
  Scissors,
  BookOpen,
  TrendingUp,
  FilePenLine,
  ShieldCheck,
} from 'lucide-react';
import React from 'react';
const SIDEBAR = [
  { to: '/dashboard-admin', label: 'Главная', icon: LayoutDashboard },
  { to: '/dashboard-admin/board', label: 'Доска планирования', icon: LayoutList },
  { to: '/dashboard-admin/applications', label: 'Заявки', icon: MessageSquare },
  { to: '/dashboard-admin/bookings', label: 'Управление записями', icon: Calendar },
  { to: '/dashboard-admin/reports', label: 'Отчёты', icon: FileBarChart },
  { to: '/dashboard-admin/staff', label: 'Сотрудники', icon: Users },
  { to: '/dashboard-admin/sms', label: 'SMS-рассылки', icon: Send },
  { to: '/dashboard-admin/clients', label: 'Базы клиентов', icon: Database },
  { to: '/dashboard-admin/warehouse', label: 'Склад', icon: Package },
  { to: '/dashboard-admin/finance', label: 'Финансы', icon: Wallet },
  { to: '/dashboard-admin/services-add', label: 'Каталог услуг', icon: Scissors },
  { to: '/dashboard-admin/services-blog', label: 'Блог услуг (редактор)', icon: FilePenLine },
  { to: '/dashboard-admin/courses-add', label: 'Каталог курсов', icon: BookOpen },
  { to: '/dashboard-admin/moderation', label: 'Модерация', icon: ShieldCheck },
  { to: '/dashboard-admin/stats', label: 'Статистика и аналитика', icon: TrendingUp },
];

export function DashboardAdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex">
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto max-h-screen">
        <h2 className="font-bold text-lg mb-4 text-[#4A90E2]">Навигация</h2>
        <nav className="space-y-1">
          {SIDEBAR.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to || (to !== '/dashboard-admin' && location.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  active ? 'bg-[#4A90E2]/20 text-[#4A90E2]' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate text-sm">{label}</span>
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
