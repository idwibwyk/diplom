/**
 * Логика слотов для записи на услуги.
 * Окна времени: 9:00–18:00, шаг 30 минут. При выборе одного слота автоматически занимаются следующие (по длительности услуги).
 */

const SLOT_STEP_MINUTES = 30;
const DEFAULT_START = '10:00';
const DEFAULT_END = '22:00';

/**
 * Генерирует все слоты на день (09:00–18:00, шаг 30 мин).
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {Array<{ time: string, datetime: string }>}
 */
export function getAllSlotsForDay(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return [];

  const [startH, startM] = DEFAULT_START.split(':').map(Number);
  const [endH, endM] = DEFAULT_END.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  const slots = [];
  for (let m = startMinutes; m <= endMinutes - SLOT_STEP_MINUTES; m += SLOT_STEP_MINUTES) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    const time = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    const datetime = new Date(year, month - 1, day, h, min, 0, 0);
    slots.push({
      time,
      datetime: datetime.toISOString(),
      minutesFromMidnight: m,
    });
  }
  return slots;
}

/**
 * Возвращает слоты, доступные для услуги с длительностью durationMinutes.
 * Учитывает: 1) занятые интервалы (каждая запись блокирует свои duration_minutes);
 *            2) слот доступен только если slot + durationMinutes не выходит за 18:00.
 * @param {string} dateStr - YYYY-MM-DD
 * @param {number} durationMinutes - длительность услуги в минутах (из services.duration_minutes)
 * @param {Array<{ start: Date, end: Date }>} blockedRanges - занятые интервалы
 * @returns {Array<{ time: string, datetime: string }>}
 */
export function getSlotsWithAvailabilityForService(dateStr, durationMinutes, blockedRanges = []) {
  const duration = Math.max(SLOT_STEP_MINUTES, durationMinutes || 60);
  const allSlots = getAllSlotsForDay(dateStr);
  const [endH, endM] = DEFAULT_END.split(':').map(Number);
  const endDayMinutes = endH * 60 + endM;

  return allSlots
    .map((slot) => {
      const slotStartMs = new Date(slot.datetime).getTime();
      const slotEndMs = slotStartMs + duration * 60 * 1000;
      if (slot.minutesFromMidnight + duration > endDayMinutes) {
        return { time: slot.time, datetime: slot.datetime, available: false };
      }
      const overlaps = blockedRanges.some(
        (b) => slotStartMs < b.end.getTime() && slotEndMs > b.start.getTime()
      );
      return { time: slot.time, datetime: slot.datetime, available: !overlaps };
    })
    .map(({ time, datetime, available }) => ({ time, datetime, available }));
}

/**
 * Проверяет, что переданное время совпадает с одним из разрешённых слотов дня.
 */
export function isAllowedSlot(dateStr, datetimeIso) {
  const slots = getAllSlotsForDay(dateStr);
  const d = new Date(datetimeIso);
  if (Number.isNaN(d.getTime())) return false;
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return slots.some((s) => s.time === time);
}
