import nodemailer from 'nodemailer';

function env(name, fallback = '') {
  return process.env[name] ?? fallback;
}

let transporter = null;

export function getMailer() {
  if (transporter) return transporter;

  const host = env('SMTP_HOST');
  const port = Number(env('SMTP_PORT', '587'));
  const user = env('SMTP_USER');
  const pass = env('SMTP_PASS');

  if (!host || !user || !pass) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

export async function sendMail({ to, subject, text, html }) {
  const t = getMailer();
  if (!t) {
    // В dev без SMTP просто считаем отправку успешной, но логируем.
    console.log('[mailer] SMTP не настроен, письмо не отправлено:', { to, subject });
    return { ok: false, skipped: true };
  }
  const from = env('SMTP_FROM', env('SMTP_USER'));
  await t.sendMail({ from, to, subject, text, html });
  return { ok: true };
}

