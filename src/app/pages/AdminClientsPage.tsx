import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Database, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/app/api/client';

type User = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  created_at?: string;
};

export function AdminClientsPage() {
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const res = await api.get<{ data?: User[] }>('/users?limit=100');
      if (cancelled) return;
      if ('error' in res) {
        setError(res.error);
        setClients([]);
      } else {
        const list = Array.isArray((res.data as { data?: User[] })?.data) ? (res.data as { data: User[] }).data : [];
        setClients(list.filter((u) => u.role === 'client'));
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

  const list = clients.filter((u) => u.role === 'client').length ? clients : (clients as User[]);

  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] bg-clip-text text-transparent">
        Базы клиентов
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Клиентская база и контакты</p>

      {error && (
        <div className="mb-6 flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-gray-800 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-[#4A90E2]/10 to-transparent">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Клиенты</h2>
        </div>
        {clients.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Database className="w-16 h-16 mx-auto mb-4 text-[#4A90E2] opacity-60" />
            <p>Нет клиентов</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="text-left p-3">Имя</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Телефон</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((u) => (
                  <tr key={u.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="p-3 font-medium">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.phone ?? '—'}</td>
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
