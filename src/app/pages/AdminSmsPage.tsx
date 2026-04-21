import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/app/api/client';

type SmsCampaign = {
  id: number;
  title: string;
  message: string;
  status: string;
  scheduled_at: string | null;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  created_at?: string;
};

const statusLabel: Record<string, string> = {
  draft: 'Черновик',
  scheduled: 'Запланирована',
  sending: 'Отправка',
  completed: 'Завершена',
  cancelled: 'Отменена',
};

export function AdminSmsPage() {
  const [campaigns, setCampaigns] = useState<SmsCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const res = await api.get<{ data?: SmsCampaign[] }>('/sms_campaigns?limit=50');
      if (cancelled) return;
      if ('error' in res) {
        setError(res.error);
        setCampaigns([]);
      } else {
        setCampaigns(Array.isArray(res.data?.data) ? res.data.data : []);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-10 h-10 text-[#4A90E2] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] bg-clip-text text-transparent">
        SMS-рассылки
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Рассылки клиентам</p>

      {error && (
        <div className="mb-6 flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-gray-800 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-[#4A90E2]/10 to-transparent">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Кампании</h2>
        </div>
        {campaigns.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Send className="w-16 h-16 mx-auto mb-4 text-[#4A90E2] opacity-60" />
            <p>Нет кампаний</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="text-left p-3">Название</th>
                  <th className="text-left p-3">Статус</th>
                  <th className="text-left p-3">Отправлено</th>
                  <th className="text-left p-3">Ошибки</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="p-3 font-medium">{c.title}</td>
                    <td className="p-3">{statusLabel[c.status] ?? c.status}</td>
                    <td className="p-3">{c.sent_count} / {c.total_recipients}</td>
                    <td className="p-3">{c.failed_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
