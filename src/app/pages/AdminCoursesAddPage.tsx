import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/app/api/client';

type Course = {
  id: number;
  name: string;
  level: string;
  format: string;
  duration?: string | null;
  price: number;
  description?: string | null;
};

export function AdminCoursesAddPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const res = await api.get<{ data?: Course[] }>('/courses?limit=100');
      if (cancelled) return;
      if ('error' in res) {
        setError(res.error);
        setCourses([]);
      } else {
        setCourses(Array.isArray((res.data as { data?: Course[] })?.data) ? (res.data as { data: Course[] }).data : []);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] bg-clip-text text-transparent">
        Каталог курсов
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Курсы обучения</p>

      {error && (
        <div className="mb-6 flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-gray-800 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-10 h-10 text-[#4A90E2] animate-spin" />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-[#4A90E2]/10 to-transparent flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#4A90E2]" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Курсы</h2>
          </div>
          {courses.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-[#4A90E2] opacity-60" />
              <p>Нет курсов. Добавление нового курса — в разработке.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="text-left p-3">Название</th>
                    <th className="text-left p-3">Уровень</th>
                    <th className="text-left p-3">Формат</th>
                    <th className="text-left p-3">Длительность</th>
                    <th className="text-left p-3">Цена</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="p-3 font-medium">{c.name}</td>
                      <td className="p-3">{c.level}</td>
                      <td className="p-3">{c.format}</td>
                      <td className="p-3">{c.duration ?? '—'}</td>
                      <td className="p-3">{c.price.toLocaleString('ru-RU')} ₽</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
