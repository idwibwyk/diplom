import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Clock, Search } from 'lucide-react';
import { useState } from 'react';

export function CoursesBlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchTerm, setSearchTerm] = useState('');

  const posts = [
    {
      id: 1,
      title: 'С чего начать обучение грумингу',
      excerpt: 'Руководство для начинающих: первые шаги в профессии грумера, необходимые навыки и инструменты.',
      author: 'Анна Петрова',
      date: '2026-01-15',
      category: 'Обучение',
      readTime: '6 мин',
      image: 'https://images.unsplash.com/photo-1653150756437-41454967e9f5?w=800',
    },
    {
      id: 2,
      title: 'Как выбрать курс по грумингу',
      excerpt: 'Критерии выбора курса, на что обратить внимание при выборе образовательной программы.',
      author: 'Мария Иванова',
      date: '2026-01-10',
      category: 'Советы',
      readTime: '7 мин',
      image: 'https://images.unsplash.com/photo-1728448644193-34eb04460c95?w=800',
    },
    {
      id: 3,
      title: 'Практика в груминге: как получить опыт',
      excerpt: 'Важные рекомендации по поиску практики и наработке опыта после прохождения курсов.',
      author: 'Елена Смирнова',
      date: '2026-01-05',
      category: 'Карьера',
      readTime: '8 мин',
      image: 'https://images.unsplash.com/photo-1752178407704-6a088ede9ef9?w=800',
    },
    {
      id: 4,
      title: 'Профессиональные инструменты грумера',
      excerpt: 'Обзор необходимых инструментов для профессионального грумера и как правильно их выбирать.',
      author: 'Ольга Козлова',
      date: '2025-12-28',
      category: 'Инструменты',
      readTime: '5 мин',
      image: 'https://images.unsplash.com/photo-1653150756437-41454967e9f5?w=800',
    },
    {
      id: 5,
      title: 'Сертификация в груминге: зачем это нужно',
      excerpt: 'Важность сертификации и как она влияет на карьеру грумера.',
      author: 'Иван Соколов',
      date: '2025-12-20',
      category: 'Карьера',
      readTime: '6 мин',
      image: 'https://images.unsplash.com/photo-1759134155377-4207d89b39ec?w=800',
    },
    {
      id: 6,
      title: 'История груминга: развитие профессии',
      excerpt: 'Интересная экскурсия в историю профессии грумера и как она развивалась на протяжении веков.',
      author: 'Дарья Морозова',
      date: '2025-12-15',
      category: 'История',
      readTime: '10 мин',
      image: 'https://images.unsplash.com/photo-1752021382723-28103aa59245?w=800',
    },
  ];

  const categories = ['Все', 'Обучение', 'Советы', 'Карьера', 'Инструменты', 'История'];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'Все' || post.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section
        className="relative py-32 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #40AB40 0%, #89E689 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(/pictures/hero-section groom room courses.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-bold mb-6">Блог о курсах</h1>
            <p className="text-2xl mb-8 max-w-3xl mx-auto">
              Полезные статьи и советы по обучению грумингу от наших преподавателей
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories and Search */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск по статьям..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#40AB40]"
              />
            </div>
            {/* Categories */}
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#40AB40] text-white'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-[#40AB40] hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Статьи не найдены. Попробуйте изменить фильтры поиска.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#40AB40] text-white px-4 py-2 rounded-full text-sm font-bold">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{post.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <Link
                      to={`/courses/blog/${post.id}`}
                      className="flex items-center gap-2 text-[#40AB40] font-bold hover:gap-4 transition-all"
                    >
                      Читать
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
