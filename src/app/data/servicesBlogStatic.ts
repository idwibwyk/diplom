// Реэкспорт статей и утилиты для блога услуг.
import { SERVICES_BLOG_ARTICLES } from './servicesBlogArticlesBody';

export type { StaticServicesArticle } from './servicesBlogArticlesBody';

export const SERVICES_BLOG_STATIC = SERVICES_BLOG_ARTICLES;

export const SERVICES_BLOG_STATIC_MAP = new Map(
  SERVICES_BLOG_STATIC.map((a) => [a.title.toLowerCase(), a])
);

export function usesStructuredFormat(raw: string): boolean {
  return raw.split('\n').some((l) => l.trim().startsWith('## '));
}

/** Тело статьи со структурой: всё от первого ## (ввод остаётся в intro). */
export function getStructuredBody(raw: string): string {
  const lines = raw.split('\n');
  const idx = lines.findIndex((l) => l.trim().startsWith('## '));
  if (idx === -1) return raw.trim();
  return lines.slice(idx).join('\n').trim();
}

/** Вводные абзацы до первого ## (структура) или первые два текстовых блока (legacy). */
export function getIntroFromRaw(raw: string): string {
  if (usesStructuredFormat(raw)) {
    const paras: string[] = [];
    for (const line of raw.split('\n')) {
      const t = line.trim();
      if (t.startsWith('## ')) break;
      if (!t || t.startsWith('http://') || t.startsWith('https://')) continue;
      paras.push(t);
    }
    return paras.slice(0, 2).join('\n\n');
  }
  const parts = raw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const paras: string[] = [];
  for (const p of parts) {
    if (p.startsWith('http://') || p.startsWith('https://')) continue;
    paras.push(p);
    if (paras.length >= 2) break;
  }
  return paras.join('\n\n');
}

export function takeFirstSentences(text: string, count: number): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (!t || count <= 0) return '';
  const parts = t.split(/(?<=[.!?])\s+/);
  const out = parts.slice(0, count).join(' ').trim();
  return out || t.slice(0, 160);
}

/** Одно предложение для карточки на /services/blog. */
export function getCardExcerptForServicesPost(title: string, excerptFallback: string): string {
  const a = SERVICES_BLOG_STATIC_MAP.get(title.toLowerCase());
  const base = a ? getIntroFromRaw(a.raw) : excerptFallback;
  return takeFirstSentences(base, 1);
}

export function extractImageUrlsFromRaw(raw: string): string[] {
  const lines = raw.split('\n').map((l) => l.trim());
  return lines.filter((l) => l.startsWith('https://') || l.startsWith('http://'));
}
