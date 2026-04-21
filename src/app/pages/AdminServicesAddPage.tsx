import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PlusCircle, Loader2, AlertCircle, Scissors } from 'lucide-react';
import { api } from '@/app/api/client';

type Service = {
  id: number;
  name: string;
  category: string;
  type: string;
  price: number;
  duration?: string | null;
  breed?: string | null;
};

export function AdminServicesAddPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const res = await api.get<{ data?: Service[] }>('/services?limit=100');
      if (cancelled) return;
      if ('error' in res) {
        setError(res.error);
        setServices([]);
      } else {
        setServices(Array.isArray((res.data as { data?: Service[] })?.data) ? (res.data as { data: Service[] }).data : []);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] bg-clip-text text-transparent">
        Каталог услуг
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Прайс-лист услуг груминга</p>

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
            <Scissors className="w-5 h-5 text-[#4A90E2]" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Услуги</h2>
          </div>
          {services.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <PlusCircle className="w-16 h-16 mx-auto mb-4 text-[#4A90E2] opacity-60" />
              <p>Нет услуг. Добавление новой услуги — в разработке.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="text-left p-3">Название</th>
                    <th className="text-left p-3">Категория</th>
                    <th className="text-left p-3">Тип</th>
                    <th className="text-left p-3">Цена</th>
                    <th className="text-left p-3">Длительность</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s) => (
                    <tr key={s.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="p-3 font-medium">{s.name}</td>
                      <td className="p-3">{s.category}</td>
                      <td className="p-3">{s.type}</td>
                      <td className="p-3">{s.price} ₽</td>
                      <td className="p-3">{s.duration ?? '—'}</td>
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
