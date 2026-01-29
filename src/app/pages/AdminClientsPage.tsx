import { motion } from 'motion/react';
import { Database } from 'lucide-react';

export function AdminClientsPage() {
  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Базы клиентов
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Клиентская база и контакты</p>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg text-center text-gray-500">
        <Database className="w-16 h-16 mx-auto mb-4 text-[#4A90E2] opacity-60" />
        <p>Раздел в разработке</p>
      </div>
    </div>
  );
}
