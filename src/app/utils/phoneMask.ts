/**
 * Единая маска телефона: +7 (XXX) XXX-XX-XX.
 * В БД сохраняем в том же формате для одинакового вида у всех пользователей.
 */

/** Привести к единому виду для БД: +7 (XXX) XXX-XX-XX */
export function normalizePhoneForDb(value: string): string {
  const digits = value.replace(/\D/g, '');
  let d = digits;
  if (d.startsWith('8')) d = '7' + d.slice(1);
  if (!d.startsWith('7')) d = '7' + d;
  d = d.slice(0, 11);
  if (d.length < 11) return value.trim() || '';
  return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
}

/** Форматировать ввод по маске +7 (XXX) XXX-XX-XX */
export function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  let d = digits;
  if (d.startsWith('8')) d = '7' + d.slice(1);
  if (!d.startsWith('7')) d = '7' + d;
  if (d.length <= 1) return d === '7' ? '+7' : '+7 (' + d.slice(1);
  if (d.length <= 4) return `+7 (${d.slice(1)}`;
  if (d.length <= 7) return `+7 (${d.slice(1, 4)}) ${d.slice(4)}`;
  if (d.length <= 9) return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
}

/** Проверка: валидный ли номер (11 цифр, начинается с 7) */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  const d = digits.startsWith('8') ? '7' + digits.slice(1) : digits.startsWith('7') ? digits : '7' + digits;
  return d.length === 11 && d.startsWith('7');
}
