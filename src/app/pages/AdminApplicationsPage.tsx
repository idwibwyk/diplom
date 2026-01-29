import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, FileText, Trash2, CheckCircle } from 'lucide-react';

interface Application {
  id: string;
  type: 'booking' | 'contact' | 'shelter' | 'zone';
  name: string;
  phone: string;
  email?: string;
  date: string;
  summary: string;
}

const MOCK_APPLICATIONS: Application[] = [
  { id: '1', type: 'booking', name: 'Мария Иванова', phone: '+7 999 111-22-33', email: 'm@mail.ru', date: '2026-01-26', summary: 'Запись на стрижку шпица, 27.01' },
  { id: '2', type: 'contact', name: 'Алексей Петров', phone: '+7 999 444-55-66', date: '2026-01-26', summary: 'Вопрос по курсам' },
  { id: '3', type: 'shelter', name: 'Приют «Добрый дом»', phone: '+7 999 777-88-99', email: 'shelter@mail.ru', date: '2026-01-25', summary: 'Заявка на выездной груминг, 15 собак' },
  { id: '4', type: 'zone', name: 'Ольга К.', phone: '+7 999 000-11-22', email: 'o@mail.ru', date: '2026-01-26', summary: 'Аренда зоны на 4 часа, 28.01' },
];

export function AdminApplicationsPage() {
  const [toCall, setToCall] = useState<string[]>(['1', '2', '4']);
  const [done, setDone] = useState<string[]>([]);
  const [applications] = useState<Application[]>(MOCK_APPLICATIONS);

  const appMap = Object.fromEntries(applications.map((a) => [a.id, a]));

  const moveToDone = (id: string) => {
    setToCall((prev) => prev.filter((x) => x !== id));
    setDone((prev) => [...prev, id]);
  };

  const removeFromToCall = (id: string) => {
    setToCall((prev) => prev.filter((x) => x !== id));
  };

  const clearDone = () => setDone([]);

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
            <h1 className="text-3xl font-bold">Заявки</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Все заявки
              </h2>
              <ul className="space-y-4">
                {applications.map((app) => (
                  <motion.li
                    key={app.id}
                    layout
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex flex-wrap justify-between gap-2">
                      <div>
                        <p className="font-bold">{app.name}</p>
                        <p className="text-sm text-gray-500">{app.summary}</p>
                        <p className="text-sm mt-1 flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {app.phone}
                          {app.email && (
                            <>
                              <Mail className="w-4 h-4 ml-2" />
                              {app.email}
                            </>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{app.date} • {app.type}</p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 shadow-lg border-2 border-amber-500/50">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Позвонить сегодня
              </h2>
              <div className="space-y-3 mb-4">
                {toCall.map((id) => {
                  const app = appMap[id];
                  if (!app) return null;
                  return (
                    <motion.div
                      key={id}
                      layout
                      className="p-3 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="font-medium truncate">{app.name}</p>
                        <p className="text-sm text-gray-500">{app.phone}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => moveToDone(id)}
                          className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                          title="Позвонил"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromToCall(id)}
                          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                          title="Убрать"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              {toCall.length === 0 && (
                <p className="text-gray-500 text-sm">Нет задач на сегодня</p>
              )}
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Завершённые</h2>
              <div className="space-y-2 mb-4">
                {done.map((id) => {
                  const app = appMap[id];
                  if (!app) return null;
                  return (
                    <div
                      key={id}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-between text-sm"
                    >
                      <span className="truncate">{app.name}</span>
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
              {done.length > 0 && (
                <button
                  type="button"
                  onClick={clearDone}
                  className="text-sm text-gray-500 hover:text-red-500"
                >
                  Очистить
                </button>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
