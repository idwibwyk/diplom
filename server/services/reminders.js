import db from '../db/knex.js';
import { sendMail } from './mailer.js';

function formatRuDateTime(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString('ru-RU');
  const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  return { date, time };
}

export async function processDueReminders(now = new Date()) {
  const nowIso = now.toISOString();

  // Берём пачку непросланных reminder-уведомлений
  const due = await db('notifications')
    .where({ type: 'reminder' })
    .whereNull('sent_at')
    .whereNotNull('reminder_at')
    .andWhere('reminder_at', '<=', nowIso)
    .orderBy('reminder_at', 'asc')
    .limit(50);

  for (const n of due) {
    try {
      const email = n.email;
      if (!email) {
        await db('notifications').where({ id: n.id }).update({ sent_at: db.raw('now()'), updated_at: db.raw('now()') });
        continue;
      }
      const { date, time } = formatRuDateTime(n.reminder_at);
      const subject = n.title || 'Напоминание от MARS GROOM';
      const text = `${n.body || 'Напоминание.'}\n\nВремя: ${date} ${time}\n\nMARS GROOM`;
      await sendMail({ to: email, subject, text });
      await db('notifications').where({ id: n.id }).update({ sent_at: db.raw('now()'), updated_at: db.raw('now()') });
    } catch (e) {
      console.error('[reminders] failed to send reminder', n?.id, e?.message || e);
      // не ставим sent_at — попробуем снова позже
    }
  }
}

export function startRemindersWorker() {
  const intervalMs = Number(process.env.REMINDER_WORKER_INTERVAL_MS || 15000);
  const timer = setInterval(() => {
    processDueReminders().catch((e) => console.error('[reminders] tick error', e?.message || e));
  }, Math.max(5000, intervalMs));

  // не держим процесс живым только из-за таймера (для тестов/скриптов)
  timer.unref?.();
  console.log(`[reminders] worker started (every ${Math.max(5000, intervalMs)}ms)`);
  return timer;
}

