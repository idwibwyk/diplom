import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  Clock,
  Share2,
  BookmarkPlus,
  ChevronRight,
} from 'lucide-react';
import { useEntity } from '@/app/hooks';
import {
  SERVICES_BLOG_STATIC_MAP,
  getIntroFromRaw,
  extractImageUrlsFromRaw,
  usesStructuredFormat,
  getStructuredBody,
} from '@/app/data/servicesBlogStatic';
import { parseStructuredArticle, ServicesBlogArticleBlocks, type ArticleBlock } from '@/app/components/ServicesBlogArticleBlocks';

type BlogPostRow = {
  id: number;
  title: string;
  excerpt: string | null;
  content: string | null;
  author_id: number | null;
  category: string | null;
  read_time: string | null;
  image: string | null;
  published_at: string | null;
};
type MasterRow = { id: number; full_name: string };

const BOOKMARKS_KEY = 'mars-groom-blog-bookmarks';

/** Убирает из тела первые N текстовых блоков (не URL), совпадающие по количеству с абзацами intro — чтобы не дублировать вводный блок. */
function getBodyAfterIntro(raw: string, intro: string): string {
  const n = intro.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).length;
  if (n === 0) return raw;
  const parts = raw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const kept: string[] = [];
  let skipped = 0;
  for (const p of parts) {
    if (p.startsWith('http://') || p.startsWith('https://')) {
      kept.push(p);
      continue;
    }
    if (skipped < n) {
      skipped++;
      continue;
    }
    kept.push(p);
  }
  return kept.join('\n\n');
}

function stripHtmlToIntro(html: string, maxLen = 420): string {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trim()}…`;
}

function isUrlLine(line: string): boolean {
  return line.startsWith('http://') || line.startsWith('https://');
}

function isHeadingH3(line: string): boolean {
  return (
    line.startsWith('Тип ') ||
    line.startsWith('Совет №') ||
    line.startsWith('Этап ') ||
    line.startsWith('Процедура ') ||
    line.startsWith('Компонент ') ||
    line.startsWith('Вариант ') ||
    line.startsWith('Миф №')
  );
}

function isHeadingH2(line: string): boolean {
  if (isHeadingH3(line)) return false;
  if (line.includes('Что такое')) return true;
  if (line.endsWith(':') && line.length > 48) return true;
  if (/^Как\s/.test(line) && line.length < 120) return true;
  if (/^Почему /.test(line) && line.length < 120) return true;
  if (/^Когда /.test(line) && line.length < 160) return true;
  if (/^Стрижка кошки|^Гигиенический груминг|^Мир кошачьего|^Груминг кошек|^Сезонные|^Индивидуальные|^Особые случаи|^Идеальный возраст|^Медицинские|^Что делать, если/i.test(line)) return true;
  return false;
}

function isCalloutLine(line: string): boolean {
  if (/^\d+\.\s/.test(line)) return false;
  return (
    /^\d+\./.test(line) ||
    line.startsWith('Для чего') ||
    line.startsWith('Для кого') ||
    line.startsWith('Результат') ||
    line.startsWith('Показания')
  );
}

function parseLegacyArticleBlocks(raw: string): ArticleBlock[] {
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
  const blocks: ArticleBlock[] = [];
  let h2n = 0;
  let h3n = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (isUrlLine(line)) {
      i++;
      continue;
    }

    if (line.startsWith('Совет от')) {
      blocks.push({ type: 'blockquote', text: line });
      i++;
      continue;
    }
    if (isHeadingH3(line)) {
      h3n += 1;
      blocks.push({ type: 'h3', text: line, n: h3n });
      i++;
      continue;
    }
    if (isHeadingH2(line)) {
      h2n += 1;
      blocks.push({ type: 'h2', text: line, n: h2n });
      i++;
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      let j = i;
      while (j < lines.length && /^\d+\.\s/.test(lines[j])) {
        items.push(lines[j].replace(/^\d+\.\s*/, '').trim());
        j++;
      }
      if (items.length >= 2) {
        blocks.push({ type: 'ol', items });
        i = j;
        continue;
      }
    }

    if (isCalloutLine(line)) {
      blocks.push({ type: 'callout', text: line });
      i++;
      continue;
    }

    if (line.endsWith(':') && line.length <= 160) {
      const items: string[] = [];
      let j = i + 1;
      while (j < lines.length) {
        const l2 = lines[j];
        if (isUrlLine(l2)) break;
        if (isHeadingH2(l2) || isHeadingH3(l2)) break;
        if (l2.startsWith('Совет от')) break;
        if (/^\d+\.\s/.test(l2)) break;
        if (isCalloutLine(l2)) break;
        if (l2.endsWith(':') && l2.length <= 160 && items.length >= 2) break;
        if (l2.length > 420) break;
        items.push(l2);
        j++;
      }
      if (items.length >= 2) {
        blocks.push({ type: 'p', text: line });
        blocks.push({ type: 'ul', variant: 'chevron', items });
        i = j;
        continue;
      }
    }

    blocks.push({ type: 'p', text: line });
    i++;
  }
  return blocks;
}

function parseServicesArticle(rawFull: string, body: string): ArticleBlock[] {
  if (usesStructuredFormat(rawFull)) return parseStructuredArticle(body);
  return parseLegacyArticleBlocks(body);
}

/** Горизонтальная галерея: светлый «лента», не как на главной и не «плёнка». */
function ArticleStripGallery({ urls }: { urls: string[] }) {
  if (urls.length === 0) return null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative mt-16 overflow-hidden rounded-3xl border border-[#4A90E2]/20 bg-gradient-to-r from-white via-[#F0F7FF] to-[#E3EEFC] py-8 pl-4 shadow-xl dark:border-[#4A90E2]/30 dark:from-gray-900 dark:via-[#0f1729] dark:to-gray-900"
      aria-label="Галерея изображений"
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#E3EEFC] to-transparent dark:from-gray-900" />
      <div className="relative z-20 mb-4 pr-8 text-center md:text-left md:pl-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#4A90E2]">Иллюстрации</p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Листайте карточки вправо</h3>
      </div>
      <div className="relative z-20 flex gap-5 overflow-x-auto pb-2 pl-1 pr-10 pt-2 [scrollbar-color:#4A90E2_#e8f2fc] [scrollbar-width:thin] snap-x snap-mandatory">
        {urls.map((src, idx) => (
          <motion.figure
            key={`${src}-${idx}`}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ delay: idx * 0.04, type: 'spring', stiffness: 260, damping: 22 }}
            className="group relative w-[min(280px,78vw)] shrink-0 snap-center"
          >
            <div className="absolute -left-1 top-6 h-12 w-1 rounded-full bg-gradient-to-b from-[#4A90E2] to-[#9EC3EF] opacity-80" />
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-[#4A90E2]/15 transition duration-300 group-hover:shadow-2xl group-hover:ring-[#4A90E2]/40 dark:bg-gray-800 dark:ring-white/10">
              <img
                src={src}
                alt=""
                className="aspect-[16/10] h-44 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <figcaption className="border-t border-[#4A90E2]/10 bg-gradient-to-r from-[#4A90E2]/5 to-transparent px-3 py-2 text-center text-xs font-medium text-[#357ABD] dark:text-[#9EC3EF]">
                Кадр {idx + 1}
              </figcaption>
            </div>
          </motion.figure>
        ))}
      </div>
    </motion.section>
  );
}

export function BlogArticlePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progressPct, setProgressPct] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareHint, setShareHint] = useState<string | null>(null);
  const [showFacts, setShowFacts] = useState(true);
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const pathname = location.pathname;
  const isServicesBlog = pathname.includes('/services/blog');
  const backTo = isServicesBlog ? '/services/blog' : '/courses/blog';

  const postId = id ? parseInt(id, 10) : null;

  const { item: postData, loadingItem, loadingItemError } = useEntity<BlogPostRow>('blog_posts', {
    fetchListOnMount: false,
    id: postId,
    fetchItemOnMount: !!postId,
    enabled: !!postId,
  });

  const { list: mastersList } = useEntity<MasterRow>('masters', { fetchListOnMount: true, listParams: { limit: 50 } });

  const { list: relatedListRaw, refetchList: refetchRelatedList } = useEntity<BlogPostRow>('blog_posts', {
    fetchListOnMount: false,
  });

  useEffect(() => {
    if (postData?.category && postId) {
      refetchRelatedList({ limit: 24, category: postData.category });
    }
  }, [postData?.category, postData?.id, postId, refetchRelatedList]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.12], [0, -40]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setProgressPct(Math.round(v * 100));
  });

  const authorName = useMemo(() => {
    if (!postData?.author_id) return 'Команда Mars Groom';
    const m = mastersList.find((x) => x.id === postData.author_id);
    return m?.full_name ?? 'Команда Mars Groom';
  }, [postData?.author_id, mastersList]);

  const post = useMemo(() => {
    if (!postData) return null;
    const staticArticle = isServicesBlog ? SERVICES_BLOG_STATIC_MAP.get((postData.title || '').toLowerCase()) : null;
    const rawContent = staticArticle?.raw ?? postData.content ?? '<p>Содержание статьи.</p>';
    const intro =
      staticArticle != null
        ? getIntroFromRaw(staticArticle.raw)
        : postData.excerpt?.trim() || stripHtmlToIntro(postData.content || '');
    return {
      id: postData.id,
      title: postData.title,
      intro,
      content: rawContent,
      author: staticArticle?.author ?? authorName,
      date: staticArticle?.publishedAt ?? postData.published_at ?? '',
      category: postData.category ?? 'Статья',
      readTime: staticArticle?.readTime ?? postData.read_time ?? '5 мин',
      image:
        postData.image ??
        (isServicesBlog ? '/pictures/hero-section groom room services.jpg' : '/pictures/hero-section groom room courses.jpg'),
    };
  }, [postData, authorName, isServicesBlog]);

  const contentForRender = useMemo(() => {
    if (!post) return '';
    if (isServicesBlog && usesStructuredFormat(post.content)) {
      return getStructuredBody(post.content);
    }
    if (isServicesBlog && post.intro) return getBodyAfterIntro(post.content, post.intro);
    return post.content;
  }, [post, isServicesBlog]);

  const articleBlocks = useMemo(() => {
    if (!isServicesBlog || !post || !contentForRender || contentForRender.startsWith('<')) return null;
    return parseServicesArticle(post.content, contentForRender);
  }, [isServicesBlog, post, contentForRender]);

  const galleryUrls = useMemo(() => {
    if (!post || !isServicesBlog) return [];
    return extractImageUrlsFromRaw(post.content);
  }, [post, isServicesBlog]);

  const colorScheme = isServicesBlog
    ? { primary: '#4A90E2', secondary: '#357ABD', soft: '#9EC3EF' }
    : { primary: '#40AB40', secondary: '#2d8a2d', soft: '#89E689' };

  useEffect(() => {
    if (!postId) return;
    try {
      const raw = localStorage.getItem(BOOKMARKS_KEY);
      const ids: number[] = raw ? JSON.parse(raw) : [];
      setIsBookmarked(Array.isArray(ids) && ids.includes(postId));
    } catch {
      setIsBookmarked(false);
    }
  }, [postId]);

  const toggleBookmark = () => {
    if (!postId) return;
    try {
      const raw = localStorage.getItem(BOOKMARKS_KEY);
      let ids: number[] = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(ids)) ids = [];
      if (isBookmarked) {
        ids = ids.filter((x) => x !== postId);
      } else {
        ids = [...ids, postId];
      }
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(ids));
      setIsBookmarked(!isBookmarked);
    } catch {
      /* ignore */
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = post?.title ?? 'Mars Groom';
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        setShareHint(null);
      } else {
        await navigator.clipboard.writeText(url);
        setShareHint('Ссылка скопирована');
        window.setTimeout(() => setShareHint(null), 2500);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setShareHint('Ссылка скопирована');
        window.setTimeout(() => setShareHint(null), 2500);
      } catch {
        setShareHint(null);
      }
    }
  };

  const relatedArticles = useMemo(() => {
    if (!post || !relatedListRaw.length) return [];
    return relatedListRaw
      .filter((a) => a.id !== post.id && a.category === postData?.category)
      .slice(0, 3)
      .map((a) => ({
        id: a.id,
        title: a.title,
        excerpt: a.excerpt ?? '',
        image: a.image ?? '/pictures/hero-section groom room services.jpg',
      }));
  }, [relatedListRaw, post, postData?.category]);

  const articleBasePath = backTo;

  if (postId && loadingItem) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#4A90E2] animate-spin" />
      </div>
    );
  }
  if (postId && loadingItemError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-24">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500 mb-4">{loadingItemError}</p>
          <Link to={backTo} className="text-[#4A90E2] hover:underline">
            Вернуться к блогу
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Статья не найдена</h1>
          <Link to={backTo} className="text-[#4A90E2] hover:underline">
            Вернуться к блогу
          </Link>
        </div>
      </div>
    );
  }

  const dateLabel = post.date ? new Date(post.date).toLocaleDateString('ru-RU') : '—';

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950"
    >
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-1 origin-left bg-gradient-to-r from-[#4A90E2] to-[#357ABD]"
        style={{
          scaleX: scrollYProgress,
        }}
      />

      <motion.section style={{ opacity: headerOpacity, y: headerY }} className="relative h-[min(60vh,520px)] overflow-hidden">
        <div className="absolute inset-0">
          <img src={post.image} alt="" className="h-full w-full object-cover" />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent"
            style={{ opacity: 0.95 }}
          />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-10 md:pb-12">
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
            <Link
              to={backTo}
                className="mb-6 inline-flex items-center gap-2 text-white/85 transition-colors hover:text-white"
            >
                <ArrowLeft className="h-5 w-5" />
                Назад к блогу
            </Link>
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/90">
                <span
                  className="rounded-full px-4 py-1.5 text-sm font-semibold text-white"
                  style={{ background: `linear-gradient(90deg, ${colorScheme.primary}, ${colorScheme.secondary})` }}
                >
                {post.category}
              </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
                <span>{dateLabel}</span>
              </div>
              <h1 className="mb-2 max-w-4xl text-4xl font-bold text-white md:text-5xl lg:text-6xl">{post.title}</h1>
              <p className="max-w-3xl text-sm text-white/75 md:text-base">{post.author}</p>
            </motion.div>
              </div>
            </div>
      </motion.section>

      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 shadow-lg backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/90"
      >
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:py-4">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={toggleBookmark}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isBookmarked
                  ? 'bg-[#4A90E2] text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              <BookmarkPlus className="h-4 w-4" />
              {isBookmarked ? 'Сохранено' : 'Сохранить'}
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleShare}
              className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Share2 className="h-4 w-4" />
              Поделиться
            </motion.button>
            {shareHint ? <span className="text-sm text-[#4A90E2]">{shareHint}</span> : null}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Прогресс чтения: {progressPct}%</div>
        </div>
      </motion.div>

      <div className="relative">
        <article className="py-12 md:py-16">
          <div className="container mx-auto max-w-4xl px-4">
            {post.intro ? (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mb-12"
              >
                <div className="rounded-r-xl border-l-4 border-[#4A90E2] bg-gradient-to-r from-[#4A90E2]/10 to-[#357ABD]/5 p-6 dark:from-[#4A90E2]/15 dark:to-transparent">
                  <p className="whitespace-pre-line text-lg leading-relaxed text-gray-700 [text-indent:1.5em] dark:text-gray-300">
                    {post.intro}
                  </p>
                </div>
              </motion.div>
            ) : null}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-[#2b2b2b] dark:text-gray-200"
            >
              {isServicesBlog && articleBlocks ? (
                <ServicesBlogArticleBlocks blocks={articleBlocks} />
              ) : (
                <div
                  className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-img:rounded-xl prose-img:shadow-lg prose-h2:text-[#2E6FBC] prose-h3:text-[#3B82D0] prose-a:text-[#2E6FBC] prose-p:[text-indent:1.5em]"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              )}
            </motion.div>

            {isServicesBlog && galleryUrls.length > 0 ? <ArticleStripGallery urls={galleryUrls} /> : null}

            {isServicesBlog && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 rounded-2xl border border-[#4A90E2]/30 bg-gradient-to-br from-[#4A90E2]/10 to-[#9EC3EF]/20 p-6 dark:border-[#4A90E2]/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h3 className="text-2xl font-bold text-[#4A90E2]">Навигация по материалу</h3>
                  <button
                    type="button"
                    onClick={() => setShowFacts((v) => !v)}
                    className="rounded-lg bg-white/70 px-3 py-1 text-sm dark:bg-gray-800/70"
                  >
                    {showFacts ? 'Скрыть' : 'Показать'}
                  </button>
                </div>
                {showFacts && (
                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                    <div className="rounded-xl bg-white/80 p-4 [text-indent:0] dark:bg-gray-800/70">
                      Крупные разделы пронумерованы, подразделы выделены отдельным стилем; списки оформлены для удобного
                      чтения.
                    </div>
                    <div className="rounded-xl bg-white/80 p-4 [text-indent:0] dark:bg-gray-800/70">
                      Внизу статьи — горизонтальная галерея карточек в фирменных голубых тонах (оформление отличается от
                      главной страницы сайта).
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mt-16 rounded-2xl bg-gradient-to-br p-8 text-white shadow-xl"
              style={{ background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secondary})` }}
            >
              <h3 className="mb-4 text-2xl font-bold">Понравилась статья?</h3>
              <p className="mb-6 text-lg text-white/95 [text-indent:0]">
                Запишитесь на услуги или на курсы по грумингу и применяйте знания на практике вместе с Mars Groom.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/services/list">
                  <motion.span
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-block cursor-pointer rounded-full bg-white px-6 py-3 font-semibold text-[#4A90E2] transition-colors hover:bg-gray-100"
                  >
                    Прайс и услуги
                  </motion.span>
                </Link>
                <Link to="/courses">
                  <motion.span
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-block cursor-pointer rounded-full border-2 border-white/90 bg-white/15 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                  >
                    Курсы груминга
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          </div>
        </article>
      </div>

      {relatedArticles.length > 0 ? (
        <section className="border-t border-gray-200/80 bg-gradient-to-br from-gray-50 to-blue-50 py-16 dark:border-gray-800 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white"
            >
              Похожие статьи
            </motion.h2>
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
              {relatedArticles.map((related, index) => (
            <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Link to={`${articleBasePath}/${related.id}`}>
                    <motion.article
                      whileHover={{ y: -6 }}
                      className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-shadow hover:shadow-2xl dark:bg-gray-800"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <motion.img
                          whileHover={{ scale: 1.06 }}
                          transition={{ duration: 0.5 }}
                          src={related.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="mb-2 line-clamp-2 font-bold text-gray-900 dark:text-white">{related.title}</h3>
                        <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{related.excerpt}</p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#4A90E2]">
                          Читать
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </motion.article>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
