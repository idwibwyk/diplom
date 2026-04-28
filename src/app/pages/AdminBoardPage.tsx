import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Filter, Clock, RussianRuble, CheckCircle, Users } from 'lucide-react';
import { AppSelect } from '@/app/components/ui/AppSelect';

const COLUMNS = [
  { id: 'today', title: 'Записи на сегодня', color: 'bg-blue-500/20 border-blue-500/50' },
  { id: 'progress', title: 'В процессе', color: 'bg-amber-500/20 border-amber-500/50' },
  { id: 'done', title: 'Завершено', color: 'bg-green-500/20 border-green-500/50' },
  { id: 'moved', title: 'Перенесено', color: 'bg-gray-500/20 border-gray-500/50' },
] as const;

type ColId = (typeof COLUMNS)[number]['id'];

interface Task {
  id: string;
  petName: string;
  breed: string;
  service: string;
  time: string;
  master: string;
  petPhoto: string;
  animalType: 'dog' | 'cat';
  urgent?: boolean;
}

const ALL_TASKS: Task[] = [
  { id: '1', petName: 'Барсик', breed: 'Шпиц', service: 'Комплексная стрижка', time: '10:00', master: 'Анна Петрова', petPhoto: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200', animalType: 'dog' },
  { id: '2', petName: 'Муся', breed: 'Персидская', service: 'Гигиенический уход', time: '11:30', master: 'Елена Смирнова', petPhoto: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200', animalType: 'cat' },
  { id: '3', petName: 'Рекс', breed: 'Лабрадор', service: 'Стрижка лабрадора', time: '14:00', master: 'Мария Иванова', petPhoto: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200', animalType: 'dog', urgent: true },
  { id: '4', petName: 'Зефирка', breed: 'Пудель', service: 'Креативная стрижка', time: '16:00', master: 'Иван Соколов', petPhoto: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200', animalType: 'dog' },
  { id: '5', petName: 'Лора', breed: 'Йорк', service: 'Стрижка йорка', time: '09:00', master: 'Ольга Козлова', petPhoto: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200', animalType: 'dog' },
  { id: '6', petName: 'Том', breed: 'Мейн-кун', service: 'Стрижка кошки', time: '13:00', master: 'Елена Смирнова', petPhoto: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200', animalType: 'cat' },
];

const initialBoard: Record<ColId, string[]> = {
  today: ['1', '2', '3', '4', '5', '6'],
  progress: [],
  done: [],
  moved: [],
};

export function AdminBoardPage() {
  const [board, setBoard] = useState<Record<ColId, string[]>>(initialBoard);
  const [filterMaster, setFilterMaster] = useState<string>('all');
  const [filterAnimal, setFilterAnimal] = useState<'all' | 'dog' | 'cat'>('all');

  const tasksMap = Object.fromEntries(ALL_TASKS.map((t) => [t.id, t])) as Record<string, Task>;

  const moveTask = (taskId: string, toCol: ColId) => {
    setBoard((prev) => {
      const next = { ...prev };
      for (const c of COLUMNS) {
        next[c.id] = next[c.id].filter((id) => id !== taskId);
      }
      next[toCol] = [...next[toCol], taskId];
      return next;
    });
  };

  const filtered = (colId: ColId) => {
    const ids = board[colId];
    return ids.filter((id) => {
      const t = tasksMap[id];
      if (!t) return false;
      if (filterMaster !== 'all' && t.master !== filterMaster) return false;
      if (filterAnimal !== 'all' && t.animalType !== filterAnimal) return false;
      return true;
    });
  };

  const completedCount = board.done.length;
  const revenue = completedCount * 2500;
  const mastersList = Array.from(new Set(ALL_TASKS.map((t) => t.master)));

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard-admin"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#4A90E2]"
            >
              <ArrowLeft className="w-5 h-5" />
              В ЛК админа
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="w-8 h-8 text-[#4A90E2]" />
              Доска планирования (все мастера)
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Завершено: {completedCount}
            </span>
            <span className="flex items-center gap-1">
              <RussianRuble className="w-4 h-4" />
              {revenue.toLocaleString()} ₽
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#4A90E2]" />
            <span className="font-medium">Фильтры:</span>
          </div>
          <div className="min-w-[220px]">
            <AppSelect
              value={filterMaster}
              onChange={setFilterMaster}
              options={[
                { value: 'all', label: 'Все мастера' },
                ...mastersList.map((m) => ({ value: m, label: m })),
              ]}
            />
          </div>
          <div className="min-w-[220px]">
            <AppSelect
              value={filterAnimal}
              onChange={(v) => setFilterAnimal(v as 'all' | 'dog' | 'cat')}
              options={[
                { value: 'all', label: 'Все животные' },
                { value: 'dog', label: 'Собаки' },
                { value: 'cat', label: 'Кошки' },
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map((col) => (
            <div
              key={col.id}
              className={`rounded-2xl border-2 p-4 min-h-[320px] ${col.color}`}
            >
              <h2 className="font-bold mb-4">{col.title}</h2>
              <div className="space-y-3">
                {filtered(col.id).map((taskId) => {
                  const t = tasksMap[taskId];
                  if (!t) return null;
                  return (
                    <motion.div
                      key={t.id}
                      layout
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow flex flex-col gap-2"
                    >
                      <div className="flex gap-3">
                        <img src={t.petPhoto} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate">{t.petName}</p>
                          <p className="text-sm text-gray-500">{t.breed} • {t.service}</p>
                          <p className="text-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {t.time} • {t.master}
                          </p>
                          {t.urgent && (
                            <span className="inline-block mt-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded">Срочно</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {COLUMNS.filter((c) => c.id !== col.id).map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => moveTask(t.id, c.id)}
                            className="text-xs px-2 py-1 bg-[#4A90E2]/20 hover:bg-[#4A90E2]/30 text-[#4A90E2] rounded transition-colors"
                          >
                            → {c.title}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
