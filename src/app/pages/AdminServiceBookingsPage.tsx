import { motion } from 'motion/react';
import { Calendar, Loader2, AlertCircle } from 'lucide-react';
import { useEntity } from '@/app/hooks';
import { useAuth } from '@/app/context/AuthContext';

type ServiceBooking = {
  id: number;
  user_id: number;
  service_id: number;
  master_id: number | null;
  pet_id: number | null;
  scheduled_at: string;
  status: string;
  contact_method?: string;
  notes?: string | null;
};

const statusLabel: Record<string, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждена',
  in_progress: 'В работе',
  completed: 'Завершена',
  cancelled: 'Отменена',
  postponed: 'Перенесена',
};

export function AdminServiceBookingsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const {
    list: serviceBookings,
    loadingList: loading,
    loadingListError: error,
  } = useEntity<ServiceBooking>('service_bookings', { listParams: { limit: 50 }, enabled: isAdmin });

  if (!isAdmin) {
    return (
      <div className="p-8">
        <p className="text-gray-500 dark:text-gray-400">Войдите как администратор для просмотра записей.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-10 h-10 text-[#4A90E2] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#4A90E2] to-[#6BB3F0] bg-clip-text text-transparent"
      >
        Записи на услуги
      </motion.h1>
      <p className="text-[#4A90E2]/80 dark:text-blue-300/80 mb-8">Управление записями клиентов на услуги груминга</p>

      {error && (
        <div className="mb-6 flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-gray-800 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-2 border-[#4A90E2]/25">
        <div className="px-6 py-4 border-b border-[#4A90E2]/20 bg-gradient-to-r from-[#4A90E2]/12 to-transparent flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#4A90E2]" />
          <h2 className="text-xl font-bold text-[#4A90E2]">Все записи на услуги</h2>
        </div>
        <div className="overflow-x-auto max-h-[min(70vh,720px)] overflow-y-auto">
          {serviceBookings.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">Нет записей</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#4A90E2]/10 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Дата/время</th>
                  <th className="text-left p-3">Статус</th>
                </tr>
              </thead>
              <tbody>
                {serviceBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="border-t border-gray-100 dark:border-gray-700 hover:bg-[#4A90E2]/5 dark:hover:bg-gray-700/50"
                  >
                    <td className="p-3">{b.id}</td>
                    <td className="p-3">{new Date(b.scheduled_at).toLocaleString('ru-RU')}</td>
                    <td className="p-3">{statusLabel[b.status] ?? b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
