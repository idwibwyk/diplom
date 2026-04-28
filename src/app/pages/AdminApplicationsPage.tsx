import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, FileText } from 'lucide-react';
import { useEntity } from '@/app/hooks';
import { useAuth } from '@/app/context/AuthContext';

export function AdminApplicationsPage() {
  const { user } = useAuth();
  const { list: shelterApplications, update: updateShelter } = useEntity<any>('shelter_applications', { fetchListOnMount: true, listParams: { limit: 300 } });
  const { create: createNotification } = useEntity<any>('notifications', { fetchListOnMount: false });

  const applications = useMemo(
    () =>
      shelterApplications.map((app) => ({
        id: app.id,
        userId: app.created_by,
        type: 'shelter',
        name: app.org_name,
        phone: app.phone,
        email: app.email,
        date: String(app.created_at || '').slice(0, 10),
        summary: app.message || 'Заявка на груминг для приюта',
        status: app.status || 'new',
      })),
    [shelterApplications]
  );

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
                        <p className="text-xs mt-1">
                          Статус: <span className={app.status === 'answered' ? 'text-emerald-600' : 'text-amber-600'}>{app.status === 'answered' ? 'Отвечено' : 'Новая'}</span>
                        </p>
                        <button
                          type="button"
                          className="mt-3 rounded-xl bg-[#4A90E2] px-4 py-2 text-sm font-semibold text-white"
                          onClick={async () => {
                            const answer = window.prompt('Ответ клиенту по заявке');
                            if (!answer?.trim()) return;
                            if (app.userId) {
                              await createNotification({
                                user_id: app.userId,
                                type: 'shelter_application_reply',
                                title: `Ответ по заявке приюта: ${app.name}`,
                                body: answer.trim(),
                                meta: { application_id: app.id, answered_by: user?.id ?? null },
                              } as any);
                            }
                            await updateShelter(app.id, {
                              status: 'answered',
                              admin_reply: answer.trim(),
                              answered_at: new Date().toISOString(),
                            } as any);
                          }}
                        >
                          Ответить клиенту
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
