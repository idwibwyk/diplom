/** Доп. поля из course_bookings.notes (JSON), которые может задать грумер. */
export type CourseBookingExtras = {
  homework?: string;
  schedule?: string;
  bulletin?: string;
};

export function parseCourseBookingNotes(notes: string | null): CourseBookingExtras {
  if (!notes?.trim()) return {};
  try {
    const parsed = JSON.parse(notes) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const o = parsed as Record<string, unknown>;
      return {
        homework: typeof o.homework === 'string' ? o.homework : undefined,
        schedule: typeof o.schedule === 'string' ? o.schedule : undefined,
        bulletin: typeof o.bulletin === 'string' ? o.bulletin : undefined,
      };
    }
  } catch {
    /* обычный текст в notes */
  }
  return {};
}

export function difficultyBarsFromLevel(level: string | null | undefined): number {
  const l = (level ?? '').toLowerCase();
  if (l.includes('advanced') || l.includes('проф') || l.includes('pro')) return 5;
  if (l.includes('intermediate') || l.includes('средн')) return 4;
  if (l.includes('beginner') || l.includes('начал') || l.includes('базов')) return 3;
  return 3;
}

/** Визуальная категория сложности для цвета полосок. */
export type DifficultyTier = 'easy' | 'medium' | 'hard';

export function difficultyTierFromLevel(level: string | null | undefined): DifficultyTier {
  const n = difficultyBarsFromLevel(level);
  if (n >= 5) return 'hard';
  if (n >= 4) return 'medium';
  return 'easy';
}

export const DIFFICULTY_BAR_CLASS: Record<
  DifficultyTier,
  { filled: string; muted: string }
> = {
  easy: { filled: 'bg-emerald-200', muted: 'bg-white/20' },
  medium: { filled: 'bg-orange-400', muted: 'bg-white/20' },
  hard: { filled: 'bg-red-500', muted: 'bg-white/25' },
};

export type CourseTopicTestMeta = { index: number; title: string; durationMin: number };

/** Ровно 5 тематических тестов по курсу. */
export function buildCourseTopicTests(courseName: string, moduleTitles: string[]): CourseTopicTestMeta[] {
  const fromModules = moduleTitles.slice(0, 5).map((title, i) => ({
    index: i,
    title: `Тест: ${title}`,
    durationMin: 18 + (i % 4) * 5,
  }));
  const fillers: CourseTopicTestMeta[] = [
    { index: fromModules.length, title: `Тест: ключевые понятия «${courseName}»`, durationMin: 22 },
    { index: fromModules.length + 1, title: `Тест: безопасность и этика (курс «${courseName}»)`, durationMin: 20 },
    { index: fromModules.length + 2, title: `Тест: практические сценарии`, durationMin: 30 },
    { index: fromModules.length + 3, title: `Тест: закрепление материала`, durationMin: 25 },
    { index: fromModules.length + 4, title: `Тест: итоговая проверка темы курса`, durationMin: 35 },
  ];
  const merged = [...fromModules, ...fillers].slice(0, 5);
  return merged.map((t, i) => ({ ...t, index: i }));
}
