import { motion } from 'motion/react';
import { Star, Loader2, Trash2 } from 'lucide-react';
import { useEntity } from '@/app/hooks';
import { useAuth } from '@/app/context/AuthContext';
import { useMemo } from 'react';

type ReviewRow = {
  id: number;
  user_id: number | null;
  service_id: number | null;
  course_id: number | null;
  master_id: number | null;
  rating: number;
  text: string;
  type: string;
  created_at: string;
  pet_name: string | null;
  service_booking_id?: number | null;
  course_booking_id?: number | null;
};
type ServiceRow = { id: number; name: string };
type CourseRow = { id: number; name: string };
type MasterRow = { id: number; full_name: string };

export function DashboardReviewsPage() {
  const { user } = useAuth();
  const { list: reviews, loadingList, remove, deleting } = useEntity<ReviewRow>('reviews', {
    fetchListOnMount: !!user,
    enabled: !!user,
    listParams: { limit: 200 },
  });
  const { list: services } = useEntity<ServiceRow>('services', { fetchListOnMount: true, listParams: { limit: 200 } });
  const { list: courses } = useEntity<CourseRow>('courses', { fetchListOnMount: true, listParams: { limit: 200 } });
  const { list: masters } = useEntity<MasterRow>('masters', { fetchListOnMount: true, listParams: { limit: 200 } });

  const items = useMemo(() => {
    return reviews
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((r) => {
        const service = r.service_id ? services.find((s) => s.id === r.service_id)?.name : null;
        const course = r.course_id ? courses.find((c) => c.id === r.course_id)?.name : null;
        const master = r.master_id ? masters.find((m) => m.id === r.master_id)?.full_name : null;
        return { ...r, serviceName: service, courseName: course, masterName: master };
      });
  }, [reviews, services, courses, masters]);

  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Отзывы
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Ваши отзывы о визитах</p>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        {loadingList ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-[#53C9CA]" />
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-5 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-200/60 dark:border-gray-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <Star
                          key={k}
                          className={`w-5 h-5 ${k < Number(r.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                        />
                      ))}
                    </div>
                    <p className="font-bold">
                      {r.serviceName || r.courseName || 'Удаленная услуга/курс'}{r.masterName ? ` · ${r.masterName}` : ''}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-line">{r.text}</p>
                    <p className="text-sm text-gray-500 mt-2">{new Date(r.created_at).toLocaleDateString('ru-RU')}</p>
                  </div>
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={async () => {
                      if (!confirm('Удалить этот отзыв?')) return;
                      await remove(r.id);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                    Удалить
                  </button>
                </div>
              </motion.div>
            ))}

            {items.length === 0 ? (
              <div className="py-10 text-center text-gray-500 dark:text-gray-400">Пока нет отзывов</div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
