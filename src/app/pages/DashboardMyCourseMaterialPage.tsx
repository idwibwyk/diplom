import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, BookMarked, Loader2, PlayCircle } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useEntity } from '@/app/hooks';
import { useMemo } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/app/components/ui/carousel';
import { parseGalleryImages } from '@/app/lib/learnerBookingFields';

type CourseBookingRow = { id: number; user_id: number; course_id: number; status: string };
type ContentRow = {
  id: number;
  module_id: number;
  title: string;
  type: string;
  content: string | null;
  file_path: string | null;
  duration_minutes: number | null;
  gallery_images?: string | null;
};
type ModuleRow = { id: number; course_id: number; title: string };
type CourseRow = { id: number; name: string };

function splitArticleSections(raw: string | null): { title?: string; body: string }[] {
  if (!raw?.trim()) return [];
  const blocks = raw
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
  return blocks.map((b) => {
    const m = b.match(/^##\s+(.+)\n?([\s\S]*)$/);
    if (m) return { title: m[1].trim(), body: (m[2] || '').trim() };
    return { body: b };
  });
}

export function DashboardMyCourseMaterialPage() {
  const { contentId: idParam } = useParams();
  const contentId = idParam ? parseInt(idParam, 10) : NaN;
  const { user } = useAuth();

  const { list: bookings } = useEntity<CourseBookingRow>('course_bookings', {
    fetchListOnMount: !!user,
    listParams: { limit: 100 },
    enabled: !!user,
  });
  const { item: material, loadingItem, loadingItemError } = useEntity<ContentRow>('course_content', {
    id: Number.isFinite(contentId) ? contentId : null,
    fetchItemOnMount: Number.isFinite(contentId),
    fetchListOnMount: false,
    enabled: Number.isFinite(contentId),
  });
  const { item: moduleRow, loadingItem: loadingModule } = useEntity<ModuleRow>('course_modules', {
    id: material?.module_id ?? null,
    fetchItemOnMount: !!material?.module_id,
    fetchListOnMount: false,
    enabled: !!material?.module_id,
  });
  const coursePk = moduleRow?.course_id;
  const { item: courseRow } = useEntity<CourseRow>('courses', {
    id: coursePk ?? null,
    fetchItemOnMount: !!coursePk,
    fetchListOnMount: false,
    enabled: !!coursePk,
  });

  const myPaidCourseIds = useMemo(
    () =>
      new Set(bookings.filter((b) => b.user_id === user?.id && b.status === 'оплачен').map((b) => b.course_id)),
    [bookings, user?.id]
  );

  const allowed = user && Number.isFinite(contentId) && moduleRow && myPaidCourseIds.has(moduleRow.course_id);

  const gallery = parseGalleryImages(material?.gallery_images);
  const sections = splitArticleSections(material?.content ?? null);
  const videoSrc = material?.file_path?.trim() || null;

  if (!user) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Войдите в аккаунт.</p>
        <Link to="/dashboard/my-courses" className="text-[#40AB40] font-medium mt-2 inline-block">
          Мои курсы
        </Link>
      </div>
    );
  }

  if (!Number.isFinite(contentId)) {
    return (
      <div className="p-8">
        <p>Некорректная ссылка.</p>
        <Link to="/dashboard/my-courses" className="text-[#40AB40]">
          ← Назад
        </Link>
      </div>
    );
  }

  if (loadingItem && !material) {
    return (
      <div className="p-16 flex justify-center">
        <Loader2 className="w-10 h-10 text-[#40AB40] animate-spin" />
      </div>
    );
  }

  if (material && loadingModule) {
    return (
      <div className="p-16 flex justify-center">
        <Loader2 className="w-10 h-10 text-[#40AB40] animate-spin" />
      </div>
    );
  }

  if (loadingItemError || !material || !moduleRow || !allowed) {
    return (
      <div className="p-8 max-w-lg">
        <p className="text-gray-700 dark:text-gray-200 mb-4">Материал не найден или нет доступа (нужна оплаченная запись на курс).</p>
        <Link to="/dashboard/my-courses" className="text-[#40AB40] font-semibold inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Мои курсы
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-emerald-50/50 via-white to-slate-50/80 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-20">
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <Link
          to="/dashboard/my-courses"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#40AB40] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Мои курсы
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f4d0f] via-[#2a8a2a] to-[#5cbd5c] text-white p-6 md:p-8 mb-10 shadow-xl"
        >
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_80%_0%,#fff,transparent_50%)] pointer-events-none" />
          <div className="relative flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 border border-white/20">
              <BookMarked className="w-6 h-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80">Учебный материал · {courseRow?.name ?? 'Курс'}</p>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight mt-1">{material.title}</h1>
              <p className="text-sm text-white/85 mt-2">Модуль: {moduleRow.title}</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6 mb-10">
          {sections.length === 0 && !videoSrc ? (
            <p className="text-gray-600 dark:text-gray-300 text-sm text-center py-8 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600">
              Текст материала в базе данных пока не заполнен.
            </p>
          ) : (
            sections.map((sec, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.04 }}
                className="relative rounded-2xl border border-emerald-100/80 dark:border-emerald-900/40 bg-white dark:bg-gray-800/95 shadow-md overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#40AB40] to-[#89E689]" />
                <div className="pl-5 pr-5 py-5 md:pl-6 md:pr-6 md:py-6">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#40AB40]/12 text-xs font-bold text-[#2d8a2d]">
                      {i + 1}
                    </span>
                    {sec.title ? (
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-snug">{sec.title}</h2>
                    ) : (
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-snug">Раздел {i + 1}</h2>
                    )}
                  </div>
                  <div className="text-[15px] md:text-base text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap pl-11">
                    {sec.body}
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>

        {videoSrc ? (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg bg-black"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-950 text-white text-sm">
              <PlayCircle className="w-4 h-4 text-emerald-400" />
              Видео из каталога
              {material.duration_minutes != null ? (
                <span className="text-gray-400">· {material.duration_minutes} мин</span>
              ) : null}
            </div>
            <video key={videoSrc} className="w-full max-h-[620px]" controls src={videoSrc} playsInline>
              <track kind="captions" />
            </video>
          </motion.section>
        ) : null}

        {gallery.length > 0 ? (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mb-6"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-[#40AB40] to-[#89E689]" />
              Иллюстрации
            </h2>
            <div className="relative px-10 md:px-12">
              <Carousel className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 shadow-inner">
                <CarouselContent>
                  {gallery.map((src) => (
                    <CarouselItem key={src}>
                      <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 ring-1 ring-black/5">
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-1 border-[#40AB40]/40 bg-white dark:bg-gray-800" />
                <CarouselNext className="right-1 border-[#40AB40]/40 bg-white dark:bg-gray-800" />
              </Carousel>
            </div>
          </motion.section>
        ) : null}
      </div>
    </div>
  );
}
