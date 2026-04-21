import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Filter, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

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

const MOCK_TASKS: Task[] = [
  { id: '1', petName: 'Барсик', breed: 'Шпиц', service: 'Комплексная стрижка', time: '10:00', master: 'Анна Петрова', petPhoto: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200', animalType: 'dog' },
  { id: '2', petName: 'Муся', breed: 'Персидская', service: 'Гигиенический уход', time: '11:30', master: 'Елена Смирнова', petPhoto: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200', animalType: 'cat' },
  { id: '3', petName: 'Рекс', breed: 'Лабрадор', service: 'Стрижка лабрадора', time: '14:00', master: 'Мария Иванова', petPhoto: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200', animalType: 'dog', urgent: true },
  { id: '4', petName: 'Зефирка', breed: 'Пудель', service: 'Креативная стрижка', time: '16:00', master: 'Иван Соколов', petPhoto: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200', animalType: 'dog' },
];

export function GroomerBoardPage() {
  const { user } = useAuth();
  const groomerTasks = useMemo(() => {
    if (!user?.name) return [];
    return MOCK_TASKS.filter((t) => t.master === user.name);
  }, [user?.name]);
  const groomerTaskIds = groomerTasks.map((t) => t.id);

  const initialBoard: Record<ColId, string[]> = {
    today: groomerTaskIds,
    progress: [],
    done: [],
    moved: [],
  };

  const [board, setBoard] = useState<Record<ColId, string[]>>(initialBoard);
  const [filterAnimal, setFilterAnimal] = useState<'all' | 'dog' | 'cat'>('all');
  const [filterUrgent, setFilterUrgent] = useState(false);

  useEffect(() => {
    setBoard({ today: groomerTaskIds, progress: [], done: [], moved: [] });
  }, [groomerTaskIds.join(',')]);

  const tasksMap = Object.fromEntries(groomerTasks.map((t) => [t.id, t])) as Record<string, Task>;

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
      if (filterAnimal !== 'all' && t.animalType !== filterAnimal) return false;
      if (filterUrgent && !t.urgent) return false;
      return true;
    });
  };

  const completedCount = board.done.length;
  const revenue = completedCount * 2500;
  const avgTime = completedCount > 0 ? 90 : 0;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard-groomer"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#40AB40]"
            >
              <ArrowLeft className="w-5 h-5" />
              В ЛК грумера
            </Link>
            <h1 className="text-3xl font-bold">Доска планирования</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Завершено: {completedCount}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~{avgTime} мин
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {revenue.toLocaleString()} ₽
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Фильтры:</span>
          </div>
          <select
            value={filterAnimal}
            onChange={(e) => setFilterAnimal(e.target.value as 'all' | 'dog' | 'cat')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800"
          >
            <option value="all">Все животные</option>
            <option value="dog">Собаки</option>
            <option value="cat">Кошки</option>
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterUrgent}
              onChange={(e) => setFilterUrgent(e.target.checked)}
              className="rounded"
            />
            Только срочные
          </label>
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
                        <img
                          src={t.petPhoto}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate">{t.petName}</p>
                          <p className="text-sm text-gray-500">{t.breed} • {t.service}</p>
                          <p className="text-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {t.time} • {t.master}
                          </p>
                          {t.urgent && (
                            <span className="inline-block mt-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded">
                              Срочно
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {COLUMNS.filter((c) => c.id !== col.id).map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => moveTask(t.id, c.id)}
                            className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
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
