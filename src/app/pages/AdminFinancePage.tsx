import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/app/api/client';

type FinancialTransaction = {
  id: number;
  type: string;
  amount: number;
  category?: string | null;
  description?: string | null;
  transaction_date: string;
  payment_method?: string | null;
  service_booking_id?: number | null;
  course_booking_id?: number | null;
  master_id?: number | null;
};

const typeLabel: Record<string, string> = { income: 'Доход', expense: 'Расход', refund: 'Возврат' };

export function AdminFinancePage() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const res = await api.get<{ data?: FinancialTransaction[] }>('/financial_transactions?limit=100');
      if (cancelled) return;
      if ('error' in res) {
        setError(res.error);
        setTransactions([]);
      } else {
        setTransactions(Array.isArray((res.data as { data?: FinancialTransaction[] })?.data) ? (res.data as { data: FinancialTransaction[] }).data : []);
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

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const totalRefund = transactions.filter((t) => t.type === 'refund').reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] bg-clip-text text-transparent">
        Финансы
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Доходы, расходы, отчётность</p>

      {error && (
        <div className="mb-6 flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-gray-800 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Доходы</p>
          <p className="text-2xl font-bold text-emerald-600">{totalIncome.toLocaleString('ru-RU')} ₽</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Расходы</p>
          <p className="text-2xl font-bold text-red-600">{totalExpense.toLocaleString('ru-RU')} ₽</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Возвраты</p>
          <p className="text-2xl font-bold text-amber-600">{totalRefund.toLocaleString('ru-RU')} ₽</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-[#4A90E2]/10 to-transparent">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Транзакции</h2>
        </div>
        {transactions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-[#4A90E2] opacity-60" />
            <p>Нет транзакций</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="text-left p-3">Дата</th>
                  <th className="text-left p-3">Тип</th>
                  <th className="text-left p-3">Сумма</th>
                  <th className="text-left p-3">Категория</th>
                  <th className="text-left p-3">Описание</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="p-3">{t.transaction_date}</td>
                    <td className="p-3">{typeLabel[t.type] ?? t.type}</td>
                    <td className="p-3 font-medium">{t.amount.toLocaleString('ru-RU')} ₽</td>
                    <td className="p-3">{t.category ?? '—'}</td>
                    <td className="p-3">{t.description ?? '—'}</td>
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
