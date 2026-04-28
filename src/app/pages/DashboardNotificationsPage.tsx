import { motion } from 'motion/react';
import { Mail, Megaphone, Loader2 } from 'lucide-react';
import { useEntity } from '@/app/hooks';
import { useAuth } from '@/app/context/AuthContext';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

type NotificationRow = {
  id: number;
  user_id: number;
  type: string;
  title: string | null;
  body: string | null;
  created_at: string;
  read_at: string | null;
  reminder_at?: string | null;
  sent_at?: string | null;
  meta?: any;
};

export function DashboardNotificationsPage() {
  const { user } = useAuth();
  const { list: notifications, loadingList, update } = useEntity<NotificationRow>('notifications', {
    fetchListOnMount: !!user,
    enabled: !!user,
    listParams: { limit: 50 },
  });
  const markingRef = useRef(false);

  useEffect(() => {
    if (!user || loadingList || markingRef.current) return;
    const unread = notifications.filter((n) => !n.read_at);
    if (!unread.length) return;
    markingRef.current = true;
    Promise.all(
      unread.map((n) => update(n.id, { read_at: new Date().toISOString() } as Partial<NotificationRow>))
    ).finally(() => {
      markingRef.current = false;
    });
  }, [user, loadingList, notifications, update]);

  const items = notifications
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Уведомления и рассылки
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Сообщения и акции MARS GROOM</p>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        {loadingList ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-[#53C9CA]" />
          </div>
        ) : (
        <div className="space-y-4">
          {items.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border-l-4 border-[#53C9CA]"
            >
              <div className="flex-shrink-0 text-[#53C9CA]">
                {n.type === 'reminder' ? <Mail className="w-6 h-6" /> : <Megaphone className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold">{n.title || (n.type === 'reminder' ? 'Напоминание' : 'Сообщение')}</p>
                {n.body ? <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-line">{n.body}</p> : null}
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span>{new Date(n.created_at).toLocaleDateString('ru-RU')}</span>
                  {n.type === 'reminder' && n.reminder_at ? <span>Напомнить: {new Date(n.reminder_at).toLocaleString('ru-RU')}</span> : null}
                  {n.type === 'reminder' ? <span>{n.sent_at ? 'Доставлено' : 'В ожидании отправки'}</span> : null}
                </div>
                {n.type === 'reminder' ? (
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <p>дата: {n.meta?.scheduled_at ? new Date(n.meta.scheduled_at).toLocaleDateString('ru-RU') : '—'}</p>
                    <p>время: {n.meta?.timeRange || '—'}</p>
                    <p>мастер: {n.meta?.master || '—'}</p>
                    <p>питомец: {n.meta?.pet || '—'}</p>
                  </div>
                ) : null}
                {n.type === 'moderation_result' ? (
                  <Link to="/dashboard/visits" className="mt-2 inline-flex rounded-lg border border-[#53C9CA]/40 px-3 py-1 text-xs font-semibold text-[#53C9CA] hover:bg-[#53C9CA]/10">
                    Перейти к оставлению отзыва
                  </Link>
                ) : null}
              </div>
            </motion.div>
          ))}
          {items.length === 0 ? (
            <div className="py-10 text-center text-gray-500 dark:text-gray-400">Пока нет уведомлений</div>
          ) : null}
        </div>
        )}
      </div>
    </div>
  );
}
