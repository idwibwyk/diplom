import { useState } from 'react';
import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { Clock, DollarSign, AlertTriangle, CheckCircle, Send, Star, Calendar } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';
import { services as allServices, masters } from '@/app/data/mockData';
import { ContactForm } from '@/app/components/ContactForm';
import { FavoriteButton } from '@/app/components/FavoriteButton';

export function ServiceDetailPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState('');

  // Get service from data
  const serviceData = allServices.find((s) => s.id === parseInt(id || '1'));
  
  const service = serviceData ? {
    ...serviceData,
    stressLevel: serviceData.category === 'cats' ? 3 : serviceData.category === 'other' ? 1 : 2,
    whatIncluded: [
      'Консультация мастера',
      'Мытье профессиональной косметикой',
      'Сушка и укладка',
      serviceData.type === 'grooming' ? 'Стрижка по стандарту породы или индивидуальный дизайн' : 'Профессиональная обработка',
      serviceData.type !== 'nail' ? 'Стрижка когтей' : '',
      serviceData.category === 'dogs' || serviceData.category === 'cats' ? 'Чистка ушей' : '',
      serviceData.category === 'dogs' ? 'Обработка подушечек лап' : '',
    ].filter(Boolean),
    contraindications: [
      'Острые инфекционные заболевания',
      'Открытые раны и воспаления на коже',
      serviceData.id === 27 ? '' : 'Агрессивное поведение без предупреждения (доплата 300₽)',
      'Беременность на последних сроках (требуется консультация ветеринара)',
    ].filter(Boolean),
    preparation: [
      'Не кормите питомца за 2-3 часа до процедуры',
      serviceData.category === 'dogs' ? 'Прогуляйте собаку перед визитом' : '',
      'Принесите любимую игрушку для комфорта',
      'Сообщите о хронических заболеваниях',
    ].filter(Boolean),
    products: [
      'Шампунь Bio-Groom (США)',
      'Кондиционер Isle of Dogs',
      'Спрей для блеска Show Premium',
      'Профессиональные ножницы Kenchii',
    ],
    beforeAfter: [
      {
        before: serviceData.image,
        after: serviceData.image,
      },
    ],
  } : {
    id: 1,
    name: 'Услуга не найдена',
    price: 0,
    duration: '0',
    stressLevel: 1,
    image: 'https://images.unsplash.com/photo-1648643118660-efb8eb0aea93?w=1200',
    description: 'Услуга не найдена',
    whatIncluded: [],
    contraindications: [],
    preparation: [],
    products: [],
    beforeAfter: [],
  };

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
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6" />
                <span className="text-xl">{service.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                <span className="text-xl">{service.price}₽</span>
              </div>
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
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {service.description}
              </p>
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

            {/* Before/After */}
            <section>
              <h3 className="text-2xl font-bold mb-6">До и После</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {service.beforeAfter.map((pair, index) => (
                  <div key={index} className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
                        До
                      </p>
                      <img
                        src={pair.before}
                        alt="До"
                        className="w-full h-64 object-cover rounded-xl"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
                        После
                      </p>
                      <img
                        src={pair.after}
                        alt="После"
                        className="w-full h-64 object-cover rounded-xl"
                      />
                    </div>
                  </div>
                ))}
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
            <div className="sticky top-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-2 border-[#4A90E2]">
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
                {masters.slice(0, 4).map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <img src={m.image} alt={m.name} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{m.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{m.rating}</span>
                      </div>
                      <Link
                        to={`/book/service/${id}?masterId=${m.id}`}
                        className="inline-block mt-2 text-sm font-medium text-[#4A90E2] hover:underline"
                      >
                        Записаться к этому мастеру
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Services */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h4 className="font-bold mb-4">Похожие услуги</h4>
              <div className="space-y-3">
                {['СПА-уход', 'Экспресс-груминг'].map((service, index) => (
                  <Link
                    key={index}
                    to={`/services/${index + 2}`}
                    className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-[#4A90E2]/10 transition-colors"
                  >
                    <p className="font-medium">{service}</p>
                    <p className="text-sm text-gray-500">от 1500₽</p>
                  </Link>
                ))}
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
