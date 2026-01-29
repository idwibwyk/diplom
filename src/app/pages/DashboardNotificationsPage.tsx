import { motion } from 'motion/react';
import { Bell, Mail, Megaphone } from 'lucide-react';

const NOTIFICATIONS = [
  { id: 1, type: 'mail', title: 'Напоминание о визите', text: 'Барсик записан на 5 февраля, 10:00. Комплексная стрижка.', date: '2026-01-25' },
  { id: 2, type: 'promo', title: 'Скидка 10%', text: 'До конца месяца скидка на гигиенический уход для новых клиентов.', date: '2026-01-20' },
];

export function DashboardNotificationsPage() {
  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Уведомления и рассылки
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Сообщения и акции MARS GROOM</p>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="space-y-4">
          {NOTIFICATIONS.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border-l-4 border-[#53C9CA]"
            >
              <div className="flex-shrink-0 text-[#53C9CA]">
                {n.type === 'mail' ? <Mail className="w-6 h-6" /> : <Megaphone className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold">{n.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{n.text}</p>
                <p className="text-xs text-gray-500 mt-2">{new Date(n.date).toLocaleDateString('ru-RU')}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
