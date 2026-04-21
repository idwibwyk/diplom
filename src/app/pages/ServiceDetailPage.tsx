import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { Clock, DollarSign, AlertTriangle, CheckCircle, Send, Star, Calendar, Loader2, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';
import { useEntity } from '@/app/hooks';
import { ContactForm } from '@/app/components/ContactForm';
import { FavoriteButton } from '@/app/components/FavoriteButton';

type ServiceFromApi = { id: number; name: string; category: string; type: string; price: number; duration: string; duration_minutes?: number | null; description: string | null; image: string | null; breed: string | null; price_range: string | null; loyalty_points?: number | null };
type MasterFromApi = { id: number; full_name: string; image: string | null; rating: number | null };

export function ServiceDetailPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState('');
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

  const similarServices = useMemo(() => {
    if (!serviceData || !servicesList.length) return [];
    return servicesList
      .filter((s) => s.id !== serviceData.id && (s.category === serviceData.category || s.type === serviceData.type))
      .slice(0, 3);
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
        whatIncluded: [] as string[],
        contraindications: [] as string[],
        preparation: [] as string[],
        products: [] as string[],
        beforeAfter: [] as { before: string; after: string }[],
      };
    }
    const d = serviceData;
    const stressLevel = d.category === 'cats' ? 3 : d.category === 'other' ? 1 : 2;
    const whatIncluded = [
      'Консультация мастера',
      'Мытье профессиональной косметикой',
      'Сушка и укладка',
      d.type === 'grooming' ? 'Стрижка по стандарту породы или индивидуальный дизайн' : 'Профессиональная обработка',
      d.type !== 'nail' ? 'Стрижка когтей' : '',
      (d.category === 'dogs' || d.category === 'cats') ? 'Чистка ушей' : '',
      d.category === 'dogs' ? 'Обработка подушечек лап' : '',
    ].filter(Boolean);
    const contraindications = [
      'Острые инфекционные заболевания',
      'Открытые раны и воспаления на коже',
      d.id === 27 ? '' : 'Агрессивное поведение без предупреждения (доплата 300₽)',
      'Беременность на последних сроках (требуется консультация ветеринара)',
    ].filter(Boolean);
    const preparation = [
      'Не кормите питомца за 2-3 часа до процедуры',
      d.category === 'dogs' ? 'Прогуляйте собаку перед визитом' : '',
      'Принесите любимую игрушку для комфорта',
      'Сообщите о хронических заболеваниях',
    ].filter(Boolean);
    const img = d.image || '/pictures/hero-section groom room services.jpg';
    const beforeImg = d.category === 'dogs' ? '/pictures/Gallery services - Yorkshire Terrier haircut.jpg' : d.category === 'cats' ? '/pictures/Gallery services - Cat grooming.jpg' : img;
    const afterImg = d.category === 'dogs' ? '/pictures/Yorkshire Terrier (York).jpg' : d.category === 'cats' ? '/pictures/Cat haircut.jpg' : img;
    const productsByType: Record<string, string[]> = {
      grooming: ['Шампунь Bio-Groom (США)', 'Кондиционер Isle of Dogs', 'Спрей для блеска Show Premium', 'Профессиональные ножницы Kenchii', 'Когтерез'],
      bathing: ['Шампунь гипоаллергенный', 'Кондиционер для шерсти', 'Сушка профессиональным феном'],
      nail: ['Когтерез гильотинный', 'Пилка для когтей', 'Антисептик'],
      extra: ['Седативные методы по показаниям', 'Доп. время на процедуру'],
    };
    const prepByCategory: Record<string, string[]> = {
      dogs: ['Не кормите питомца за 2-3 часа до процедуры', 'Прогуляйте собаку перед визитом', 'Принесите любимую игрушку для комфорта', 'Сообщите о хронических заболеваниях'],
      cats: ['Не кормите за 2-3 часа до визита', 'Перевозка в переноске', 'Сообщите о характере питомца', 'При необходимости — консультация ветеринара'],
      other: ['Не кормите за 2-3 часа', 'Сообщите о хронических заболеваниях', 'Принесите привычные аксессуары'],
    };
    return {
      ...d,
      stressLevel,
      whatIncluded,
      contraindications,
      preparation: prepByCategory[d.category] || preparation,
      products: productsByType[d.type] || productsByType.grooming,
      beforeAfter: (d.category === 'dogs' ? [{ before: beforeImg, after: afterImg }, { before: '/pictures/Gallery services - Pomeranian haircut.jpg', after: '/pictures/Pomeranian (Pomeranian, German miniature).jpg' }] : [{ before: beforeImg, after: afterImg }]).filter(Boolean),
    };
  }, [serviceData]);

  const masters = useMemo(() => {
    if (!serviceId) return [];
    const masterIdsForService = new Set(masterServicesList.filter((ms) => ms.service_id === serviceId).map((ms) => ms.master_id));
    return mastersList.filter((m) => masterIdsForService.has(m.id));
  }, [mastersList, masterServicesList, serviceId]);

  const faqItems = [
    {
      question: 'Как часто нужно стричь собаку?',
      answer:
        'Частота стрижки зависит от породы. Собак с длинной шерстью рекомендуется стричь раз в 1-2 месяца, с короткой шерстью - раз в 3-4 месяца.',
      master: 'Анна Петрова',
    },
    {
      question: 'Можно ли стричь щенка?',
      answer:
        'Да, но не раньше 3-4 месяцев. Первые процедуры должны быть короткими для адаптации.',
      master: 'Мария Иванова',
    },
  ];

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

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Ваш вопрос отправлен мастеру!');
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero */}
      <section
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${service.image})`,
        }}
      >
        <div className="absolute top-4 right-4 z-10">
          <FavoriteButton type="service" id={service.id} className="bg-white/20 hover:bg-white/30 text-white rounded-full" />
        </div>
        <div className="container mx-auto px-4 h-full flex items-end pb-12">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">{service.name}</h1>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6" />
                <span className="text-xl">{service.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
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
            {/* Description */}
            <section>
              <h2 className="text-3xl font-bold mb-6">Описание услуги</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {service.description}
              </p>
              {service.breed && (
                <div className="bg-[#4A90E2]/5 rounded-xl p-6 border-l-4 border-[#4A90E2]">
                  <h4 className="font-bold text-[#4A90E2] mb-2">Порода</h4>
                  <p className="text-gray-700 dark:text-gray-300">{service.breed}</p>
                </div>
              )}
              <div className="mt-6 prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                <p>Профессиональный груминг — это не просто стрижка, а комплексный уход за шерстью, кожей и когтями вашего питомца. Мы используем только качественную косметику премиум-класса и стерильные инструменты. Каждый мастер проходит обучение и регулярно повышает квалификацию.</p>
                <p className="mt-4">Перед процедурой мы проводим осмотр питомца и консультируем по уходу. После визита вы получите рекомендации по домашнему уходу, чтобы сохранить результат как можно дольше.</p>
              </div>
            </section>

            {/* Stress Level */}
            <section className="bg-gradient-to-r from-[#4A90E2]/10 to-[#9EC3EF]/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Уровень стресса для питомца</h3>
              <div className="flex items-center justify-between">
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

            {/* What's Included */}
            <section>
              <h3 className="text-2xl font-bold mb-6">Что входит в услугу</h3>
              <div className="grid gap-3">
                {service.whatIncluded.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                  >
                    <CheckCircle className="w-6 h-6 text-[#4A90E2] flex-shrink-0" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Before/After — интерактивная галерея */}
            <section>
              <h3 className="text-2xl font-bold mb-6">До и После</h3>
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
                        <div>
                          <p className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">До</p>
                          <img src={pair.before} alt="До" className="w-full h-72 object-cover rounded-xl shadow-lg" />
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">После</p>
                          <img src={pair.after} alt="После" className="w-full h-72 object-cover rounded-xl shadow-lg" />
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
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:translate-x-0 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-xl border-2 border-[#4A90E2] flex items-center justify-center hover:bg-[#4A90E2] hover:text-white transition-colors z-10"
                      aria-label="Предыдущее"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setBeforeAfterIndex((i) => (i + 1) % service.beforeAfter.length)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-0 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-xl border-2 border-[#4A90E2] flex items-center justify-center hover:bg-[#4A90E2] hover:text-white transition-colors z-10"
                      aria-label="Следующее"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="flex justify-center gap-2 mt-4">
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

            {/* Products */}
            <section>
              <h3 className="text-2xl font-bold mb-6">Используемые средства</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {service.products.map((product, index) => (
                  <div
                    key={index}
                    className="p-4 bg-[#4A90E2]/10 rounded-xl border-2 border-[#4A90E2]/20"
                  >
                    <CheckCircle className="w-5 h-5 text-[#4A90E2] mb-2" />
                    <p className="font-medium">{product}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Preparation */}
            <section>
              <h3 className="text-2xl font-bold mb-6">Необходимая подготовка</h3>
              <div className="space-y-3">
                {service.preparation.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-[#4A90E2] text-white rounded-full text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-gray-600 dark:text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Contraindications */}
            <section>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <AlertTriangle className="w-7 h-7 text-amber-500" />
                Противопоказания
              </h3>
              <div className="space-y-3">
                {service.contraindications.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-xl"
                  >
                    <p className="text-amber-900 dark:text-amber-200">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h3 className="text-2xl font-bold mb-6">Частые вопросы</h3>
              <Accordion.Root type="single" collapsible className="space-y-4">
                {faqItems.map((item, index) => (
                  <Accordion.Item
                    key={index}
                    value={`item-${index}`}
                    className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden"
                  >
                    <Accordion.Header>
                      <Accordion.Trigger className="w-full px-6 py-4 text-left font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex justify-between items-center">
                        {item.question}
                        <span className="text-2xl">+</span>
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="px-6 py-4">
                      <p className="text-gray-600 dark:text-gray-300 mb-2">{item.answer}</p>
                      <p className="text-sm text-[#4A90E2]">Ответ от мастера: {item.master}</p>
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </section>

            {/* Ask Question */}
            <section className="bg-gradient-to-br from-[#4A90E2]/10 to-[#9EC3EF]/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Задайте вопрос мастеру</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Остались вопросы по этой услуге? Наш мастер ответит в течение часа.
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
                  className="flex items-center gap-2 px-6 py-3 bg-[#4A90E2] hover:bg-[#9EC3EF] text-white rounded-xl font-bold transition-colors"
                >
                  <Send className="w-5 h-5" />
                  Отправить вопрос
                </button>
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
                <p className="text-sm text-gray-500 mt-1">{service.duration}</p>
              </div>

              <Link
                to={`/book/service/${id}`}
                className="block w-full bg-[#4A90E2] hover:bg-[#9EC3EF] text-white py-4 rounded-xl font-bold mb-3 transition-colors text-center flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Записаться на услугу
              </Link>

              <p className="text-xs text-center text-gray-500">
                Запись доступна на ближайшие 30 дней
              </p>
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
                        <p className="text-sm text-gray-500">{s.price_range ?? `от ${s.price}₽`}</p>
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
