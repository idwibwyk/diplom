import { motion } from 'motion/react';
import { CalendarClock, Clock, Loader2, BellPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useEntity } from '@/app/hooks';
import { useAuth } from '@/app/context/AuthContext';

type Booking = { id: number; service_id: number; master_id: number | null; pet_id: number | null; scheduled_at: string; status: string; notes: string | null };
type Service = { id: number; name: string; duration_minutes?: number | null; duration_slots?: number | null };
type Master = { id: number; full_name: string };
type Pet = { id: number; name: string };
type ReminderForm = { email: string; reminderAt: string; text: string };
type NotificationRow = { id: number; type: string; booking_type?: string | null; booking_id?: number | null; reminder_at?: string | null; email?: string | null; sent_at?: string | null; created_at: string; title?: string | null; body?: string | null; meta?: any };

export function DashboardSchedulePage() {
  const { user } = useAuth();
  const { list: bookings, loadingList: loadingBookings, refetchList } = useEntity<Booking>('service_bookings', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 100 } });
  const { list: services } = useEntity<Service>('services', { fetchListOnMount: true, listParams: { limit: 200 } });
  const { list: masters } = useEntity<Master>('masters', { fetchListOnMount: true, listParams: { limit: 200 } });
  const { list: pets } = useEntity<Pet>('pets', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 200 } });
  const { list: notifications, refetchList: refetchNotifications, create: createNotification } = useEntity<NotificationRow>('notifications', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 200 } });
  const [reminderLoadingId, setReminderLoadingId] = useState<number | null>(null);
  const [reminderBooking, setReminderBooking] = useState<any | null>(null);
  const [reminderForm, setReminderForm] = useState<ReminderForm>({ email: '', reminderAt: '', text: '' });

  const getDurationMinutes = (service?: Service) => {
    if (!service) return 60;
    if (service.duration_slots != null) return Math.max(30, Number(service.duration_slots) * 30);
    if (service.duration_minutes != null) return Math.max(30, Number(service.duration_minutes));
    return 60;
  };

  const formatTimeRange = (startIso: string, durationMinutes: number) => {
    const start = new Date(startIso);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
    const format = (d: Date) => d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    return `${format(start)}-${format(end)}`;
  };

  const upcoming = useMemo(() => {
    return bookings
      .filter((b) => new Date(b.scheduled_at).getTime() >= Date.now() && b.status !== 'cancelled')
      .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
      .map((b) => {
        const serviceObj = services.find((s) => s.id === b.service_id);
        const durationMinutes = getDurationMinutes(serviceObj);
        return {
          ...b,
          service: serviceObj?.name ?? 'Услуга',
          durationMinutes,
          timeRange: formatTimeRange(b.scheduled_at, durationMinutes),
          master: masters.find((m) => m.id === b.master_id)?.full_name ?? 'Любой мастер',
          pet: pets.find((p) => p.id === b.pet_id)?.name ?? 'Питомец',
        };
      });
  }, [bookings, services, masters, pets]);

  const handleReminder = async (booking: any, payload?: ReminderForm) => {
    if (!user) return;
    setReminderLoadingId(booking.id);
    const date = new Date(booking.scheduled_at);
    const userText = payload?.text?.trim() || 'Напоминание о визите';
    const reminderAt = payload?.reminderAt || 'по времени записи';
    const email = (payload?.email || user.email || '').trim();
    const reminderAtIso = payload?.reminderAt ? new Date(payload.reminderAt).toISOString() : date.toISOString();

    await createNotification({
      user_id: user.id,
      type: 'reminder',
      booking_type: 'service',
      booking_id: booking.id,
      email,
      reminder_at: reminderAtIso,
      title: `Напоминание о записи: ${booking.service}`,
      body: `${userText}\n\n${date.toLocaleDateString('ru-RU')}\n${booking.timeRange}\n${booking.master} · ${booking.pet}`,
      meta: {
        service: booking.service,
        master: booking.master,
        pet: booking.pet,
        scheduled_at: booking.scheduled_at,
        timeRange: booking.timeRange,
      },
    } as any);
    setReminderLoadingId(null);
    refetchList();
    refetchNotifications();
  };

  if (loadingBookings) {
    return <div className="p-8 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#53C9CA]" /></div>;
  }

  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Расписание записей
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Записи на услуги из вашей базы данных</p>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="space-y-4">
          {upcoming.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-[#53C9CA]/10 dark:bg-[#53C9CA]/20 border border-[#53C9CA]/30"
            >
              <div className="flex items-center gap-2 text-[#53C9CA]">
                <CalendarClock className="w-5 h-5" />
                <span className="font-medium">{new Date(b.scheduled_at).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Clock className="w-5 h-5" />
                <span>{b.timeRange}</span>
              </div>
              <div className="flex-1">
                <p className="font-bold">{b.service}</p>
                <p className="text-sm text-gray-500">{b.master} · {b.pet}</p>
                {b.notes ? <p className="text-xs text-gray-500 mt-1">{b.notes}</p> : null}
                {(() => {
                  const byBooking = notifications
                    .filter((n) => n.type === 'reminder' && (n.booking_type || 'service') === 'service' && n.booking_id === b.id)
                    .sort((a, b2) => new Date(b2.created_at).getTime() - new Date(a.created_at).getTime());
                  if (!byBooking.length) return null;
                  return (
                    <div className="mt-3 space-y-2">
                      {byBooking.slice(0, 3).map((n) => (
                        <div key={n.id} className="rounded-xl border border-[#53C9CA]/20 bg-white/60 px-3 py-2 text-xs text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="font-semibold text-[#2b9fa0] dark:text-[#9ADFE0]">
                              Напоминание: {n.reminder_at ? new Date(n.reminder_at).toLocaleString('ru-RU') : '—'}
                            </span>
                            <span className="text-gray-500">{n.sent_at ? 'доставлено' : 'ожидает отправки'}</span>
                          </div>
                          <div className="mt-1 grid gap-1 text-[11px]">
                            <p>дата: {new Date(b.scheduled_at).toLocaleDateString('ru-RU')}</p>
                            <p>время: {b.timeRange}</p>
                            <p>мастер: {b.master}</p>
                            <p>питомец: {b.pet}</p>
                          </div>
                        </div>
                      ))}
                      {byBooking.length > 3 ? (
                        <div className="text-xs text-[#2b9fa0] dark:text-[#9ADFE0]">Ещё: {byBooking.length - 3}</div>
                      ) : null}
                    </div>
                  );
                })()}
              </div>
              <button
                type="button"
                disabled={reminderLoadingId === b.id}
                onClick={() => {
                  setReminderBooking(b);
                  setReminderForm({
                    email: user?.email ?? '',
                    reminderAt: b.scheduled_at.slice(0, 16),
                    text: `Напоминание о записи на услугу "${b.service}"`,
                  });
                }}
                className="px-4 py-2 bg-[#53C9CA]/20 text-[#53C9CA] rounded-lg text-sm font-medium hover:bg-[#53C9CA]/30 transition-colors disabled:opacity-60"
              >
                {reminderLoadingId === b.id ? 'Создание...' : (
                  <span className="inline-flex items-center gap-2"><BellPlus className="w-4 h-4" />Напоминание</span>
                )}
              </button>
            </motion.div>
          ))}
        </div>
        {upcoming.length === 0 && (
          <p className="text-center text-gray-500 py-8">Нет предстоящих записей</p>
        )}
      </div>
      {reminderBooking && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Создать напоминание</h3>
            <div className="space-y-3">
              <input
                type="email"
                required
                value={reminderForm.email}
                onChange={(e) => setReminderForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="Email для отправки"
                className="w-full px-4 py-3 rounded-xl border border-[#53C9CA]/30 focus:ring-2 focus:ring-[#53C9CA] outline-none"
              />
              <input
                type="datetime-local"
                required
                value={reminderForm.reminderAt}
                onChange={(e) => setReminderForm((p) => ({ ...p, reminderAt: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[#53C9CA]/30 focus:ring-2 focus:ring-[#53C9CA] outline-none"
              />
              <textarea
                required
                rows={4}
                value={reminderForm.text}
                onChange={(e) => setReminderForm((p) => ({ ...p, text: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[#53C9CA]/30 focus:ring-2 focus:ring-[#53C9CA] outline-none"
                placeholder="Текст напоминания"
              />
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setReminderBooking(null)} className="px-4 py-2 rounded-xl border border-gray-300">
                Отмена
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!reminderForm.email || !reminderForm.reminderAt || !reminderForm.text.trim()) return;
                  await handleReminder(reminderBooking, reminderForm);
                  setReminderBooking(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#53C9CA] text-white"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
