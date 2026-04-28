import { motion } from 'motion/react';
import { BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { useEntity } from '@/app/hooks';
import { useAuth } from '@/app/context/AuthContext';
import { api } from '@/app/api/client';

type CourseBooking = {
  id: number;
  user_id: number;
  course_id: number;
  course_schedule_id: number | null;
  master_id: number | null;
  status: string;
  notes?: string | null;
};

const statusLabel: Record<string, string> = {
  pending: 'Ожидает',
  'ожидает оплату': 'Ожидает оплату',
  оплачен: 'Оплачен',
  confirmed: 'Подтверждена',
  in_progress: 'В работе',
  completed: 'Завершена',
  cancelled: 'Отменена',
  postponed: 'Перенесена',
};

export function AdminCourseBookingsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const {
    list: courseBookings,
    loadingList: loadingCourses,
    loadingListError: courseError,
    refetchList: refetchCourseBookings,
    update: updateCourseBooking,
  } = useEntity<CourseBooking>('course_bookings', { listParams: { limit: 50 }, enabled: isAdmin });
  const { list: courses } = useEntity<{ id: number; name: string }>('courses', { listParams: { limit: 200 }, enabled: isAdmin });
  const { list: users } = useEntity<{ id: number; name: string; email: string }>('users', { listParams: { limit: 200 }, enabled: isAdmin });

  if (!isAdmin) {
    return (
      <div className="p-8">
        <p className="text-gray-500 dark:text-gray-400">Войдите как администратор для просмотра записей.</p>
      </div>
    );
  }

  if (loadingCourses) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-10 h-10 text-[#40AB40] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#40AB40] to-[#89E689] bg-clip-text text-transparent"
      >
        Записи на курсы
      </motion.h1>
      <p className="text-[#40AB40]/90 dark:text-green-300/80 mb-8">Подтверждение оплаты и статусы обучения</p>

      {courseError && (
        <div className="mb-6 flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-gray-800 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{courseError}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-2 border-[#40AB40]/30">
        <div className="px-6 py-4 border-b border-[#40AB40]/25 bg-gradient-to-r from-[#40AB40]/15 to-transparent flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#40AB40]" />
          <h2 className="text-xl font-bold text-[#40AB40]">Все записи на курсы</h2>
        </div>
        <div className="overflow-x-auto max-h-[min(70vh,720px)] overflow-y-auto">
          {courseBookings.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">Нет записей</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#40AB40]/12 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-3">Курс</th>
                  <th className="text-left p-3">Пользователь</th>
                  <th className="text-left p-3">Статус</th>
                </tr>
              </thead>
              <tbody>
                {courseBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="border-t border-gray-100 dark:border-gray-700 hover:bg-[#40AB40]/5 dark:hover:bg-gray-700/50"
                  >
                    <td className="p-3">{courses.find((c) => c.id === b.course_id)?.name ?? `Курс #${b.course_id}`}</td>
                    <td className="p-3">
                      {users.find((u) => u.id === b.user_id)?.name ?? `Пользователь #${b.user_id}`}
                      <p className="text-xs text-gray-500">{users.find((u) => u.id === b.user_id)?.email ?? ''}</p>
                    </td>
                    <td className="p-3">
                      <select
                        value={b.status}
                        onChange={async (e) => {
                          const nextStatus = e.target.value;
                          const res = await api.patch<{ success?: boolean; data?: CourseBooking }>(`/course_bookings/${b.id}/status`, { status: nextStatus });
                          if ('error' in res) {
                            await updateCourseBooking(b.id, { status: nextStatus } as Partial<CourseBooking>);
                          }
                          await refetchCourseBookings({ limit: 50 });
                        }}
                        className="px-3 py-1.5 rounded-lg border border-[#40AB40]/50 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#40AB40]"
                      >
                        <option value="ожидает оплату">Ожидает оплату</option>
                        <option value="оплачен">Оплачен</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">{statusLabel[b.status] ?? b.status}</p>
                    </td>
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
