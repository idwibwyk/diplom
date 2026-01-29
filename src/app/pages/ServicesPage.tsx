import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Dog, Cat, Star, Clock, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { services as allServices } from '@/app/data/mockData';
import { ContactForm } from '@/app/components/ContactForm';

export function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const services = allServices;

  const categories = [
    { id: 'all', name: 'Все услуги', icon: Star },
    { id: 'dogs', name: 'Собаки', icon: Dog },
    { id: 'cats', name: 'Кошки', icon: Cat },
    { id: 'other', name: 'Другое', icon: Sparkles },
  ];

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch =
      searchTerm === '' ||
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.breed?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#073B4C]/10 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section
        className="relative py-32 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #4A90E2 0%, #9EC3EF 100%)',
        }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-bold mb-6">Наши услуги</h1>
            <p className="text-2xl mb-8 max-w-2xl mx-auto">
              Профессиональный груминг для всех видов животных с заботой и любовью
            </p>
            <Link
              to="/book/service"
              className="bg-white text-[#4A90E2] px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors inline-block"
            >
              Записаться онлайн
            </Link>
          </motion.div>
        </div>
      </section>

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
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#06D6A0]"
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
                        ? 'bg-[#073B4C] text-white'
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
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[#4A90E2] text-white px-4 py-2 rounded-full font-bold">
                    {service.priceRange || `${service.price}₽`}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{service.duration}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-3 mt-auto pt-2" onClick={(e) => e.stopPropagation()}>
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

      {/* Popular Packages */}
      <section className="py-24 bg-gradient-to-b from-white to-[#073B4C]/10 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Популярные пакеты</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Экономьте с нашими готовыми решениями
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Полный день красоты',
                price: 5000,
                services: ['Мытье и сушка', 'Стрижка', 'СПА-процедуры', 'Фотосессия'],
              },
              {
                name: 'Спа-день',
                price: 4000,
                services: ['Релакс-массаж', 'Ароматерапия', 'Маски для шерсти', 'Мытье'],
              },
              {
                name: 'Экспресс-уход перед выставкой',
                price: 6000,
                services: ['Профессиональная стрижка', 'Укладка', 'Блеск-покрытие', 'Консультация'],
              },
            ].map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-[#073B4C] to-[#06D6A0] text-white rounded-2xl p-8 shadow-2xl"
              >
                <h3 className="text-2xl font-bold mb-4">{pkg.name}</h3>
                <div className="text-4xl font-bold mb-6">{pkg.price}₽</div>
                <ul className="space-y-3 mb-8">
                  {pkg.services.map((service, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-white" />
                      {service}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/book/service"
                  className="block w-full text-center bg-white text-[#4A90E2] py-3 rounded-xl font-bold hover:bg-[#9EC3EF] hover:text-white transition-colors"
                >
                  Выбрать пакет
                </Link>
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