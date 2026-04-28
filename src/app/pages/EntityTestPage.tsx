/**
 * Тестовая страница useEntity — техническая проверка связи фронт/бэк и хука.
 * Без привязки к авторизации: хук всегда дергает API; 401/403 отображаются в ошибке.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, AlertCircle, RefreshCw, Trash2, Plus, CheckCircle } from 'lucide-react';
import { useEntity } from '@/app/hooks';
import { AppSelect } from '@/app/components/ui/AppSelect';

/** Все 44 роутера (порядок как в server/routes/index.js) */
const ENTITIES = [
  'users', 'masters', 'services', 'courses', 'course_schedules', 'master_services', 'course_instructors',
  'pets', 'service_bookings', 'course_bookings', 'visits', 'reviews', 'favorite_services', 'favorite_courses',
  'loyalty_accounts', 'pet_mood_entries', 'pet_observations', 'shelter_applications', 'zone_rental_applications',
  'leads', 'lead_call_tasks', 'blog_posts', 'faq_items', 'library_articles', 'notifications', 'master_schedules',
  'gallery_items', 'documents', 'contacts', 'course_quiz_questions', 'course_quiz_options', 'course_quiz_answers',
  'education_org_info', 'course_modules', 'course_content', 'user_course_progress', 'groomer_portfolio',
  'messages', 'sms_campaigns', 'sms_recipients', 'warehouse_items', 'warehouse_transactions',
  'financial_transactions', 'reports',
] as const;

/** Минимальные тестовые тела для POST. Для сущностей без payload или с неполным — бэкенд вернёт 400, это тоже проверка. */
function getTestPayload(entity: string): Record<string, unknown> {
  const slug = `test-${Date.now()}`;
  const base: Record<string, Record<string, unknown>> = {
    leads: { name: 'Тест', email: 'test@test.ru', phone: '+79000000000', source: 'contact_form', status: 'new' },
    reviews: { rating: 5, text: 'Тестовый отзыв', type: 'service' },
    faq_items: { question: 'Тест?', answer: 'Тест', category: 'test', sort_order: 0 },
    contacts: { type: 'phone', label: 'Тест', value: '+79000000000', sort_order: 0, is_active: true },
    blog_posts: { title: 'Тест', excerpt: 'Тест', content: 'Тест', category: 'test' },
    library_articles: { title: 'Тест', slug, excerpt: 'Тест', content: 'Тест', category: 'test' },
    documents: { title: 'Тест', slug, type: 'other', is_active: true, sort_order: 0 },
    education_org_info: { org_name: 'Тест' },
    course_quiz_questions: { question: 'Тест?', type: 'single', sort_order: 0 },
    shelter_applications: { org_name: 'Тест', contact_name: 'Тест', phone: '+79000000000', email: 'test@test.ru' },
    zone_rental_applications: { name: 'Тест', phone: '+79000000000', email: 'test@test.ru', hours: 1 },
    services: { name: 'Тест услуга', category: 'dogs', type: 'grooming', price: 100 },
    courses: { name: 'Тест курс', level: 'beginner', format: 'online', price: 1000 },
    course_schedules: { course_id: 1, start_date: new Date().toISOString().slice(0, 10), spots: 5 },
    master_services: { master_id: 1, service_id: 1 },
    course_instructors: { course_id: 1, master_id: 1 },
    course_quiz_options: { question_id: 1, option_text: 'Тест', points: 0, sort_order: 0 },
    course_modules: { course_id: 1, title: 'Тест', sort_order: 0 },
    course_content: { module_id: 1, title: 'Тест', type: 'article', sort_order: 0 },
  };
  return base[entity] ?? { name: 'Тест' };
}

export function EntityTestPage() {
  const [entityName, setEntityName] = useState<string>(ENTITIES[0]);
  const [createMessage, setCreateMessage] = useState<string | null>(null);

  const {
    list,
    loadingList,
    loadingListError,
    refetchList,
    create,
    remove,
    creating,
    createError,
    deleting,
    deleteError,
  } = useEntity(entityName, {
    fetchListOnMount: false,
    listParams: { limit: 50 },
    enabled: true,
  });

  const handleLoadList = () => {
    setCreateMessage(null);
    refetchList();
  };

  const handleCreateTest = async () => {
    setCreateMessage(null);
    const payload = getTestPayload(entityName);
    const { error } = await create(payload as Record<string, unknown>);
    if (error) setCreateMessage(`Ошибка: ${error}`);
    else setCreateMessage('Запись успешно создана');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] bg-clip-text text-transparent"
        >
          Проверка useEntity и API (44 сущности)
        </motion.h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Техническая проверка: связь фронт/бэк, запросы хука, состояния loading/error. Защита роутов — на бэкенде; 401/403 отобразятся в ошибке.
        </p>

        

        {/* Выбор сущности */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Сущность (44 роутера):</label>
          <div className="w-full max-w-md">
            <AppSelect
              value={entityName}
              onChange={(v) => {
                setEntityName(v as any);
                setCreateMessage(null);
              }}
              options={ENTITIES.map((name) => ({ value: String(name), label: String(name) }))}
            />
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            type="button"
            onClick={handleLoadList}
            disabled={loadingList}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-xl hover:bg-[#3a7bc8] disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loadingList ? 'animate-spin' : ''}`} />
            Загрузить список
          </button>
         
        </div>

        {createMessage && (
          <div className={`mb-4 p-4 rounded-xl flex items-center gap-2 ${createMessage.startsWith('Ошибка') ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'}`}>
            {createMessage.startsWith('Ошибка') ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            <span>{createMessage}</span>
          </div>
        )}

        {loadingList && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-[#4A90E2] animate-spin" />
          </div>
        )}

        {loadingListError && (
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span><strong>Ошибка загрузки списка:</strong> {loadingListError}. Защита роутов на бэкенде; без авторизации 401/403 ожидаемы.</span>
          </div>
        )}

        {createError && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>Создание: {createError}</span>
          </div>
        )}

        {deleteError && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>Удаление: {deleteError}</span>
          </div>
        )}

        {!loadingList && !loadingListError && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-[#4A90E2]/10 to-transparent">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Список: {entityName} ({list.length})
              </h2>
            </div>
            <div className="overflow-x-auto max-h-[50vh] overflow-y-auto">
              {list.length === 0 ? (
                <p className="p-8 text-gray-500 dark:text-gray-400 text-center">Нет записей. Нажмите «Загрузить список».</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left p-3">ID</th>
                      <th className="text-left p-3">Данные (кратко)</th>
                      <th className="text-left p-3 w-24">Удалить</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((row: Record<string, unknown>) => (
                      <tr
                        key={String(row.id)}
                        className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="p-3">{String(row.id)}</td>
                        <td className="p-3">
                          <pre className="text-xs truncate max-w-md">
                            {JSON.stringify(
                              Object.fromEntries(
                                Object.entries(row).filter(
                                  ([k]) => !['created_at', 'updated_at', 'created_by', 'password_hash'].includes(k)
                                )
                              )
                            )}
                          </pre>
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => remove(Number(row.id))}
                            disabled={deleting}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50"
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EntityTestPage;
