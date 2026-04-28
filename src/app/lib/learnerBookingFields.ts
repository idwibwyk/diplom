import { parseCourseBookingNotes } from '@/app/lib/courseStudentDashboard';

type NotesRow = { notes?: string | null };

export function homeworkFromBooking(
  b: NotesRow & { homework_text?: string | null }
): string {
  return (b.homework_text?.trim() || parseCourseBookingNotes(b.notes ?? null).homework || '').trim();
}

export function scheduleNotesFromBooking(
  b: NotesRow & { schedule_notes?: string | null }
): string {
  return (b.schedule_notes?.trim() || parseCourseBookingNotes(b.notes ?? null).schedule || '').trim();
}

export function bulletinFromBooking(
  b: NotesRow & { bulletin_text?: string | null }
): string {
  return (b.bulletin_text?.trim() || parseCourseBookingNotes(b.notes ?? null).bulletin || '').trim();
}

export function parseGalleryImages(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
  } catch {
    return [];
  }
}
