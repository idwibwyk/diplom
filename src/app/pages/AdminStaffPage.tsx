import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/app/api/client';

type User = { id: number; name: string; email: string; phone?: string | null; role: string };
type Master = { id: number; full_name: string; phone?: string | null; experience?: number | null; specialization?: string | null; rating?: number | null; user_id?: number | null };

export function AdminStaffPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const [ur, mr] = await Promise.all([
        api.get<{ data?: User[] }>('/users?limit=100'),
        api.get<{ data?: Master[] }>('/masters?limit=50'),
      ]);
      if (cancelled) return;
      if ('error' in ur) { setError(ur.error); setUsers([]); } else setUsers(Array.isArray((ur.data as { data?: User[] })?.data) ? (ur.data as { data: User[] }).data : []);
      if ('error' in mr) { if (!error) setError(mr.error); setMasters([]); } else setMasters(Array.isArray((mr.data as { data?: Master[] })?.data) ? (mr.data as { data: Master[] }).data : []);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return (<div className="p-8 flex items-center justify-center min-h-[40vh]"><Loader2 className="w-10 h-10 text-[#4A90E2] animate-spin" /></div>);

  const staffUsers = users.filter((u) => u.role === 'groomer' || u.role === 'admin');
  const roleLabel: Record<string, string> = { admin: 'Администратор', groomer: 'Грумер', client: 'Клиент' };

  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] bg-clip-text text-transparent">Сотрудники</motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Управление персоналом</p>
      {error && (<div className="mb-6 flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-gray-800 rounded-xl p-4"><AlertCircle className="w-5 h-5 flex-shrink-0" /><span>{error}</span></div>)}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-[#4A90E2]/10 to-transparent"><h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Пользователи (роли)</h2></div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            {staffUsers.length === 0 ? <p className="p-6 text-gray-500 text-center">Нет сотрудников</p> : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800"><tr><th className="text-left p-3">Имя</th><th className="text-left p-3">Email</th><th className="text-left p-3">Роль</th></tr></thead>
                <tbody>
                  {staffUsers.map((u) => (<tr key={u.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-3 font-medium">{u.name}</td><td className="p-3">{u.email}</td><td className="p-3">{roleLabel[u.role] ?? u.role}</td></tr>))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-[#4A90E2]/10 to-transparent"><h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Мастера (профили)</h2></div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            {masters.length === 0 ? <p className="p-6 text-gray-500 text-center">Нет мастеров</p> : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800"><tr><th className="text-left p-3">Имя</th><th className="text-left p-3">Опыт</th><th className="text-left p-3">Рейтинг</th></tr></thead>
                <tbody>
                  {masters.map((m) => (<tr key={m.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-3 font-medium">{m.full_name}</td><td className="p-3">{m.experience ?? '—'} лет</td><td className="p-3">{m.rating ?? '—'}</td></tr>))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
