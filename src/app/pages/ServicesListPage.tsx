import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Clock, ArrowRight, Calendar, Dog, Cat, Sparkles, Star, Loader2 } from 'lucide-react';
import { useEntity } from '@/app/hooks';
import { ContactForm } from '@/app/components/ContactForm';

type ServiceRow = { id: number; name: string; category: string; type: string; price: number; duration: string; description: string; image: string | null; breed: string | null; price_range: string | null };

export function ServicesListPage() {
  const shouldShowDuration = (service: ServiceRow) => {
    const raw = String(service.duration ?? '').trim().toLowerCase();
    if (!raw || raw === '0' || raw === '0 мин' || raw === '0 минут') return false;
    if (service.name.toLowerCase().includes('агресс')) return false;
    return true;
  };
  const formatPriceLabel = (value: string | null | undefined, fallback: number) => {
    const v = String(value || '').trim();
    if (!v) return `${fallback}₽`;
    if (/[₽р]/i.test(v)) return v;
    if (v.includes('-')) return `${v}₽`;
    if (v.startsWith('от ')) return `${v}₽`;
    return `${v}₽`;
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const { list: services, loadingList, loadingListError } = useEntity<ServiceRow>('services', { fetchListOnMount: true, listParams: { limit: 100 } });

  const categories = [
    { id: 'all', name: 'Все услуги', icon: Star },
    { id: 'dogs', name: 'Собаки', icon: Dog },
    { id: 'cats', name: 'Кошки', icon: Cat },
    { id: 'other', name: 'Другое', icon: Sparkles },
  ];

  const serviceOrderScore = (service: ServiceRow) => {
    const name = service.name.toLowerCase();
    if (service.category === 'dogs' && name.startsWith('стрижка')) return 1;
    if (service.category === 'cats') return 2;
    if (name.includes('кролик')) return 3;
    if (name.includes('когтей')) return 4;
    if (name.includes('агресс')) return 5;
    return 6;
  };

  const filteredServices = services
    .filter((service) => {
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesSearch =
        searchTerm === '' ||
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (service.breed && service.breed.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => serviceOrderScore(a) - serviceOrderScore(b) || a.name.localeCompare(b.name, 'ru'));

  if (loadingList) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#4A90E2] animate-spin" />
      </div>
    );
  }

  if (loadingListError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p className="text-amber-600 dark:text-amber-400">{loadingListError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A90E2]/5 via-white to-[#9EC3EF]/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero в стиле CourseSchedulePage (голубая тема для /services) */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative py-20 md:py-28 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/20 via-transparent to-[#9EC3EF]/10 dark:from-[#4A90E2]/30 dark:to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] bg-clip-text text-transparent">
              Прайс-лист
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
              Выберите подходящую услугу для вашего питомца
            </p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap justify-center gap-4">
              <Link
                to="/book/service"
                className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] text-white rounded-2xl font-bold text-lg shadow-lg shadow-[#4A90E2]/30 hover:shadow-xl transition-shadow"
              >
                Запись на услугу
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/services/shelters"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#4A90E2]/40 bg-white px-10 py-4 text-lg font-bold text-[#4A90E2] transition-colors hover:bg-[#4A90E2]/10 dark:bg-gray-800"
              >
                Для приютов
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Filters */}
      <section className="py-8 bg-white dark:bg-gray-900 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск услуг..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      selectedCategory === category.id
                        ? 'bg-[#4A90E2] text-white'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => navigate(`/services/${service.id}`)}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl cursor-pointer group flex flex-col h-full"
              >
                <div className="relative h-64 overflow-hidden flex-shrink-0">
                  <img
                    src={service.image || '/pictures/hero-section groom room services.jpg'}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[#4A90E2] text-white px-4 py-2 rounded-full font-bold">
                    {formatPriceLabel(service.price_range, service.price)}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col min-h-0">
                  {shouldShowDuration(service) ? (
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{service.duration}</span>
                      </div>
                    </div>
                  ) : <div className="mb-3" />}

                  <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-3 flex-wrap mt-auto pt-2" onClick={(e) => e.stopPropagation()}>
                    <Link
                      to={`/services/${service.id}`}
                      className="flex items-center gap-2 text-[#4A90E2] font-bold hover:gap-4 transition-all"
                    >
                      Подробнее
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to={`/book/service/${service.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] hover:bg-[#9EC3EF] text-white rounded-xl font-medium transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      Записаться
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />
    </div>
  );
}
