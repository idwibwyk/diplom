import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, BookOpen, Calendar } from 'lucide-react';

const MOCK_COURSES = [
  { id: 1, name: 'Базовый курс груминга', students: 12, start: '2026-02-01', status: 'active' },
  { id: 2, name: 'Креативная стрижка', students: 8, start: '2026-03-15', status: 'upcoming' },
];

const MOCK_STUDENTS = [
  { id: 1, name: 'Елена М.', course: 'Базовый курс', progress: 65, lastVisit: '2026-01-20' },
  { id: 2, name: 'Дмитрий К.', course: 'Базовый курс', progress: 40, lastVisit: '2026-01-18' },
];

export function GroomerTeachingPage() {
  const [tab, setTab] = useState<'courses' | 'students'>('courses');

  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Обучение
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Курсы и ученики</p>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setTab('courses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
            tab === 'courses' ? 'bg-[#40AB40] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Курсы
        </button>
        <button
          type="button"
          onClick={() => setTab('students')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
            tab === 'students' ? 'bg-[#40AB40] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Users className="w-4 h-4" />
          Ученики
        </button>
      </div>

      {tab === 'courses' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {MOCK_COURSES.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-[#40AB40]/20"
            >
              <div className="flex items-start justify-between mb-4">
                <GraduationCap className="w-10 h-10 text-[#40AB40]" />
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  c.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-600'
                }`}>
                  {c.status === 'active' ? 'Идёт' : 'Скоро'}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2">{c.name}</h3>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Users className="w-4 h-4" />
                {c.students} учеников
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar className="w-4 h-4" />
                Старт: {new Date(c.start).toLocaleDateString('ru-RU')}
              </div>
              <Link to={`/courses/${c.id}`} className="inline-block mt-4 text-[#40AB40] font-medium hover:underline">
                Подробнее →
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {tab === 'students' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left px-6 py-4 font-bold">Ученик</th>
                  <th className="text-left px-6 py-4 font-bold">Курс</th>
                  <th className="text-left px-6 py-4 font-bold">Прогресс</th>
                  <th className="text-left px-6 py-4 font-bold">Последнее занятие</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_STUDENTS.map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-[#40AB40]/5"
                  >
                    <td className="px-6 py-4 font-medium">{s.name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{s.course}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#40AB40] rounded-full" style={{ width: `${s.progress}%` }} />
                        </div>
                        <span className="text-sm font-medium">{s.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{new Date(s.lastVisit).toLocaleDateString('ru-RU')}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
