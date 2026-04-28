export function estimateReadTimeFromHtml(html: string | null | undefined): string {
  const plain = (html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = plain ? plain.split(' ').length : 0;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} мин`;
}
