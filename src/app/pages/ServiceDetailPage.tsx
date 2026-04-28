import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { Clock, RussianRuble, Send, Star, Calendar, Loader2, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEntity } from '@/app/hooks';
import { useAuth } from '@/app/context/AuthContext';
import { ContactForm } from '@/app/components/ContactForm';
import { FavoriteButton } from '@/app/components/FavoriteButton';
import { getIntroFromRaw, getStructuredBody, usesStructuredFormat } from '@/app/data/servicesBlogStatic';
import { getServiceDetailArticleRaw } from '@/app/data/serviceDetailArticleBodies';
import { parseStructuredArticle, ServicesBlogArticleBlocks } from '@/app/components/ServicesBlogArticleBlocks';

type ServiceFromApi = { id: number; name: string; category: string; type: string; price: number; duration: string; duration_minutes?: number | null; description: string | null; image: string | null; breed: string | null; price_range: string | null; loyalty_points?: number | null };
type MasterFromApi = { id: number; full_name: string; image: string | null; rating: number | null };

export function ServiceDetailPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const [question, setQuestion] = useState('');
  const [questionSent, setQuestionSent] = useState(false);
  const [questionSending, setQuestionSending] = useState(false);
  const [beforeAfterIndex, setBeforeAfterIndex] = useState(0);
  const serviceId = id && /^\d+$/.test(id) ? parseInt(id, 10) : null;
  const { item: serviceData, list: servicesList, loadingItem, loadingItemError } = useEntity<ServiceFromApi>('services', {
    fetchListOnMount: true,
    listParams: { limit: 100 },
    id: serviceId,
    fetchItemOnMount: !!serviceId,
    enabled: !!serviceId,
  });
  const { list: mastersList } = useEntity<MasterFromApi>('masters', { fetchListOnMount: true, listParams: { limit: 50 } });
  const { list: masterServicesList } = useEntity<{ master_id: number; service_id: number }>('master_services', {
    fetchListOnMount: true,
    listParams: { limit: 200, ...(serviceId != null ? { service_id: serviceId } : {}) },
  });
  const { list: admins } = useEntity<{ id: number; role: string }>('users', {
    fetchListOnMount: true,
    listParams: { limit: 20, role: 'admin' },
  });
  const { create: createNotification } = useEntity<any>('notifications', { fetchListOnMount: false, enabled: !!user });

  const similarServices = useMemo(() => {
    if (!serviceData || !servicesList.length) return [];
    return servicesList
      .filter((s) => s.id !== serviceData.id && (s.category === serviceData.category || s.type === serviceData.type))
      .slice(0, 4);
  }, [serviceData, servicesList]);

  const service = useMemo(() => {
    if (!serviceData) {
      return {
        id: 0,
        name: 'Услуга не найдена',
        price: 0,
        duration: '0',
        duration_minutes: 0,
        stressLevel: 1,
        image: '/pictures/hero-section groom room services.jpg',
        description: 'Услуга не найдена',
        breed: null as string | null,
        beforeAfter: [] as { before: string; after: string }[],
      };
    }
    const d = serviceData;
    const stressLevel = d.category === 'cats' ? 3 : d.category === 'other' ? 1 : 2;
    const img = d.image || '/pictures/hero-section groom room services.jpg';
    const beforeImg = d.category === 'dogs' ? '/pictures/Gallery services - Yorkshire Terrier haircut.jpg' : d.category === 'cats' ? '/pictures/Gallery services - Cat grooming.jpg' : img;
    const afterImg = d.category === 'dogs' ? '/pictures/Yorkshire Terrier (York).jpg' : d.category === 'cats' ? '/pictures/Cat haircut.jpg' : img;
    const pairs = (d.category === 'dogs'
      ? [
          { before: beforeImg, after: afterImg },
          { before: '/pictures/Gallery services - Pomeranian haircut.jpg', after: '/pictures/Pomeranian (Pomeranian, German miniature).jpg' },
        ]
      : [
          { before: beforeImg, after: afterImg },
          { before: afterImg, after: beforeImg },
        ]
    ).filter(Boolean);
    return {
      ...d,
      stressLevel,
      beforeAfter: pairs.length >= 2 ? pairs : [pairs[0], pairs[0]],
    };
  }, [serviceData]);

  const showDuration = useMemo(() => {
    const raw = String(service.duration ?? '').trim().toLowerCase();
    if (!raw || raw === '0' || raw === '0 мин' || raw === '0 минут') return false;
    if (service.name.toLowerCase().includes('агресс')) return false;
    return true;
  }, [service.duration, service.name]);

  const formatPriceLabel = (value: string | null | undefined, fallback: number) => {
    const v = String(value || '').trim();
    if (!v) return `от ${fallback}₽`;
    if (/[₽р]/i.test(v)) return v;
    if (v.includes('-')) return `${v}₽`;
    if (v.startsWith('от ')) return `${v}₽`;
    return `${v}₽`;
  };

  const detailArticleRaw = useMemo(() => {
    if (!serviceData) return '';
    return getServiceDetailArticleRaw(serviceData.name, serviceData.category, serviceData.type);
  }, [serviceData]);

  const detailIntro = useMemo(() => {
    if (!detailArticleRaw) return (serviceData?.description ?? '').trim();
    const fromArticle = getIntroFromRaw(detailArticleRaw).trim();
    if (fromArticle) return fromArticle;
    return (serviceData?.description ?? '').trim();
  }, [detailArticleRaw, serviceData?.description]);

  const detailBlocks = useMemo(() => {
    if (!detailArticleRaw) return [];
    const body = usesStructuredFormat(detailArticleRaw) ? getStructuredBody(detailArticleRaw) : detailArticleRaw;
    return parseStructuredArticle(body);
  }, [detailArticleRaw]);

  const masters = useMemo(() => {
    if (!serviceId) return [];
    const masterIdsForService = new Set(masterServicesList.filter((ms) => ms.service_id === serviceId).map((ms) => ms.master_id));
    if (!masterIdsForService.size) return mastersList;
    return mastersList.filter((m) => masterIdsForService.has(m.id));
  }, [mastersList, masterServicesList, serviceId]);

  const renderStressLevel = () => {
    return (
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <svg
            key={level}
            className={`w-10 h-10 ${
              level <= service.stressLevel ? 'fill-[#4A90E2]' : 'fill-gray-300 dark:fill-gray-600'
            } transition-all`}
            viewBox="0 0 24 24"
          >
            <path d="M12,1.5L8.5,8.5L1,10L8.5,11.5L12,18.5L15.5,11.5L23,10L15.5,8.5L12,1.5Z" />
          </svg>
        ))}
      </div>
    );
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setQuestionSending(true);
    const targetAdmins = admins.length ? admins : [{ id: 3, role: 'admin' }];
    for (const admin of targetAdmins.slice(0, 3)) {
      await createNotification({
        user_id: admin.id,
        type: 'client_question',
        title: `Вопрос по услуге: ${service.name}`,
        body: question.trim(),
        meta: {
          from_user_id: user?.id ?? null,
          from_user_name: user?.name ?? 'Гость',
          service_id: service.id,
          service_name: service.name,
        },
      } as any);
    }
    setQuestionSending(false);
    setQuestionSent(true);
    setQuestion('');
  };

  if (serviceId && loadingItem) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#4A90E2] animate-spin" />
      </div>
    );
  }
  if (serviceId && loadingItemError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <p className="text-red-500">{loadingItemError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950">
      {/* Hero */}
      <section
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${service.image})`,
        }}
      >
        <div className="absolute top-4 left-4 z-10">
          <Link
            to="/services/list"
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            <ChevronLeft className="h-4 w-4" />
            К прайсу
          </Link>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <FavoriteButton type="service" id={service.id} className="bg-white/20 hover:bg-white/30 text-white rounded-full" />
        </div>
        <div className="container mx-auto px-4 h-full flex items-end pb-12">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">{service.name}</h1>
            <div className="flex items-center gap-6 flex-wrap">
              {showDuration ? (
                <div className="flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  <span className="text-xl">{service.duration}</span>
                </div>
              ) : null}
              <div className="flex items-center gap-2">
                <RussianRuble className="w-6 h-6" />
                <span className="text-xl">{service.price}₽</span>
              </div>
              {(service as ServiceFromApi).loyalty_points != null && (service as ServiceFromApi).loyalty_points! > 0 && (
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                  <Heart className="w-5 h-5 fill-current" />
                  <span className="text-lg font-medium">+{(service as ServiceFromApi).loyalty_points} лапок за запись</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl border border-[#4A90E2]/15 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-[#4A90E2]/25 dark:bg-gray-900/80 md:p-10"
            >
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[#4A90E2]">Подробно об услуге</p>
              <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">Как проходит визит</h2>
              {detailIntro ? (
                <div className="mb-10 rounded-r-xl border-l-4 border-[#4A90E2] bg-gradient-to-r from-[#4A90E2]/10 to-[#357ABD]/5 p-6 dark:from-[#4A90E2]/15 dark:to-transparent">
                  <p className="whitespace-pre-line text-lg leading-relaxed text-gray-700 [text-indent:1.5em] dark:text-gray-300">
                    {detailIntro}
                  </p>
                </div>
              ) : null}
              {service.breed ? (
                <div className="mb-10 rounded-xl border border-[#4A90E2]/20 bg-[#4A90E2]/5 p-5 dark:bg-[#4A90E2]/10">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#357ABD] dark:text-[#9EC3EF]">В прайсе</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{service.breed}</p>
                  {service.description && service.description !== detailIntro ? (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{service.description}</p>
                  ) : null}
                </div>
              ) : service.description && service.description !== detailIntro ? (
                <p className="mb-8 text-gray-600 dark:text-gray-300">{service.description}</p>
              ) : null}
              <div className="text-[#2b2b2b] dark:text-gray-200">
                <ServicesBlogArticleBlocks blocks={detailBlocks} />
              </div>
            </motion.article>

            {/* Stress Level */}
            <section className="rounded-2xl border border-[#4A90E2]/20 bg-gradient-to-r from-[#4A90E2]/10 to-[#9EC3EF]/10 p-8 dark:border-[#4A90E2]/30">
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Уровень стресса для питомца</h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Оценка ориентировочная: кошки и мелкие экзоты часто чувствительнее к фену и фиксации; собаки средних и крупных пород обычно спокойнее к воде.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-6">
                {renderStressLevel()}
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#4A90E2]">{service.stressLevel}/5</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {service.stressLevel <= 2
                      ? 'Низкий стресс'
                      : service.stressLevel <= 3
                        ? 'Умеренный'
                        : 'Требует терпения'}
                  </p>
                </div>
              </div>
            </section>

            {/* Before/After — интерактивная галерея */}
            <section className="rounded-3xl border border-[#4A90E2]/15 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-[#4A90E2]/25 dark:bg-gray-900/70 md:p-8">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#4A90E2]">Визуальный результат</p>
                  <h3 className="mt-2 text-2xl font-bold leading-tight text-gray-900 dark:text-white md:text-3xl">
                    Преображение за один визит
                  </h3>
                  <div className="mt-3 h-1.5 w-32 rounded-full bg-gradient-to-r from-[#4A90E2] to-[#357ABD]" />
                </div>
                <div className="rounded-full border border-[#4A90E2]/20 bg-[#4A90E2]/8 px-4 py-2 text-sm font-semibold text-[#1e3a5f] dark:border-[#4A90E2]/30 dark:bg-[#4A90E2]/10 dark:text-[#b8d4f0]">
                  Листайте варианты
                </div>
              </div>

              <div className="relative">
                <AnimatePresence mode="wait">
                  {service.beforeAfter.length > 0 && (() => {
                    const pair = service.beforeAfter[beforeAfterIndex % service.beforeAfter.length];
                    return (
                      <motion.div
                        key={beforeAfterIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid md:grid-cols-2 gap-6"
                      >
                        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-[#4A90E2]/10 dark:bg-gray-800 dark:ring-white/10">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-70" />
                          <img
                            src={pair.before}
                            alt="Фото результата"
                            className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                            loading="lazy"
                          />
                        </div>
                        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-[#4A90E2]/10 dark:bg-gray-800 dark:ring-white/10">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-70" />
                          <img
                            src={pair.after}
                            alt="Фото результата"
                            className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                            loading="lazy"
                          />
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
                {service.beforeAfter.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setBeforeAfterIndex((i) => (i - 1 + service.beforeAfter.length) % service.beforeAfter.length)}
                      className="absolute left-0 top-1/2 z-10 flex h-12 w-12 -translate-x-2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#4A90E2] bg-white shadow-xl transition-colors hover:bg-[#4A90E2] hover:text-white dark:bg-gray-800 md:translate-x-0"
                      aria-label="Предыдущее"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setBeforeAfterIndex((i) => (i + 1) % service.beforeAfter.length)}
                      className="absolute right-0 top-1/2 z-10 flex h-12 w-12 translate-x-2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#4A90E2] bg-white shadow-xl transition-colors hover:bg-[#4A90E2] hover:text-white dark:bg-gray-800 md:translate-x-0"
                      aria-label="Следующее"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="mt-5 flex justify-center gap-2">
                      {service.beforeAfter.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setBeforeAfterIndex(i)}
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${i === beforeAfterIndex % service.beforeAfter.length ? 'bg-[#4A90E2] scale-125' : 'bg-gray-300 dark:bg-gray-600'}`}
                          aria-label={`Слайд ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Ask Question */}
            <section className="rounded-2xl border border-[#4A90E2]/20 bg-gradient-to-br from-[#4A90E2]/10 to-[#9EC3EF]/10 p-8 dark:border-[#4A90E2]/30">
              <h3 className="text-2xl font-bold mb-4">Задайте вопрос администратору</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Остались вопросы по этой услуге? Наш администратору ответит в течение часа.
              </p>
              <form onSubmit={handleSubmitQuestion} className="space-y-4">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ваш вопрос..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  required
                />
                <button
                  type="submit"
                  disabled={questionSending}
                  className="flex items-center gap-2 px-6 py-3 bg-[#4A90E2] hover:bg-[#9EC3EF] text-white rounded-xl font-bold transition-colors disabled:opacity-60"
                >
                  <Send className="w-5 h-5" />
                  {questionSending ? 'Отправка...' : 'Отправить вопрос'}
                </button>
                {questionSent ? <p className="text-sm text-emerald-600">Вопрос отправлен администратору. Ответ придет в уведомления.</p> : null}
              </form>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-2 border-[#4A90E2]">
              <div className="text-center mb-6">
                <p className="text-gray-600 dark:text-gray-300 mb-2">Стоимость услуги</p>
                <p className="text-4xl font-bold text-[#4A90E2]">{service.price}₽</p>
                {showDuration ? <p className="text-sm text-gray-500 mt-1">{service.duration}</p> : null}
              </div>

              <Link
                to={`/book/service/${id}`}
                className="block w-full bg-[#4A90E2] hover:bg-[#9EC3EF] text-white py-4 rounded-xl font-bold mb-3 transition-colors text-center flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Записаться на услугу
              </Link>

              <p className="text-xs text-center text-gray-500">
              Запись — на любую дату и время в рамках нашего графика
              </p>
              <Link
                to="/services/blog"
                className="mt-4 block text-center text-sm font-semibold text-[#4A90E2] hover:underline"
              >
                Блог об уходе за шерстью
              </Link>
            </div>

            {/* Masters */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h4 className="font-bold mb-4">Наши мастера</h4>
              <div className="space-y-3">
                {masters.slice(0, 6).map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <img src={m.image || '/pictures/Groomer Anna.jpg'} alt={m.full_name} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{m.full_name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{m.rating != null ? Number(m.rating).toFixed(1) : '—'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Link
                          to={`/masters/${m.id}`}
                          className="text-sm font-medium text-[#4A90E2] hover:underline"
                        >
                          Подробнее
                        </Link>
                        <Link
                          to={`/book/service/${service.id}?masterId=${m.id}`}
                          className="text-sm font-medium text-[#4A90E2] hover:underline"
                        >
                          Записаться к этому мастеру
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Services */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h4 className="font-bold mb-4">Похожие услуги</h4>
              <div className="space-y-3">
                {similarServices.length
                  ? similarServices.map((s) => (
                      <Link
                        key={s.id}
                        to={`/services/${s.id}`}
                        className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-[#4A90E2]/10 transition-colors"
                      >
                        <p className="font-medium">{s.name}</p>
                        <p className="text-sm text-gray-500">{formatPriceLabel(s.price_range, s.price)}</p>
                      </Link>
                    ))
                  : (
                      <Link to="/services/list" className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-[#4A90E2]/10 transition-colors text-[#4A90E2]">
                        Все услуги
                      </Link>
                    )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <ContactForm />
    </div>
  );
}
