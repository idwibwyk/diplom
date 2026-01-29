import { motion } from 'motion/react';
import { FileBarChart } from 'lucide-react';

export function AdminReportsPage() {
  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Отчёты
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Отчёты по заявкам, записям и доходам</p>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg text-center text-gray-500">
        <FileBarChart className="w-16 h-16 mx-auto mb-4 text-[#4A90E2] opacity-60" />
        <p>Раздел в разработке</p>
      </div>
    </div>
  );
}
