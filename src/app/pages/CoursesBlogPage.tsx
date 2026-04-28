import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Clock, Search, Loader2 } from 'lucide-react';
import { useEntity } from '@/app/hooks';

type BlogPostRow = { id: number; title: string; excerpt: string | null; author_id: number | null; category: string | null; read_time: string | null; image: string | null; published_at: string | null };
type MasterRow = { id: number; full_name: string };
const FALLBACK_BLOG_POSTS: BlogPostRow[] = [
  { id: 2001, title: 'Как выстроить путь от новичка до преподавателя груминга', excerpt: 'Пошаговая траектория роста: практика, специализация, кейсы и подготовка к роли наставника.', author_id: null, category: 'Карьера', read_time: '8 мин', image: 'https://images.unsplash.com/photo-1653150756437-41454967e9f5?w=800', published_at: '2026-03-02' },
  { id: 2002, title: '3 учебных маршрута под разные цели: салон, фриланс, студия', excerpt: 'Сравниваем программы и нагрузку, чтобы выбрать обучение под ваш темп и формат работы.', author_id: null, category: 'Обучение', read_time: '6 мин', image: 'https://images.unsplash.com/photo-1581888227599-779811939961?w=800', published_at: '2026-03-09' },
  { id: 2003, title: 'Портфолио, которое приносит записи: структура и примеры', excerpt: 'Какие фото и тексты действительно конвертируют просмотры в заявки и повторные визиты.', author_id: null, category: 'Практика', read_time: '9 мин', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800', published_at: '2026-03-14' },
  { id: 2004, title: 'Экзамен на курсе: как подготовиться без стресса', excerpt: 'Контрольный чек-лист перед итоговой аттестацией и рекомендации по отработке слабых мест.', author_id: null, category: 'Обучение', read_time: '7 мин', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', published_at: '2026-03-18' },
  { id: 2005, title: 'Разбор кейса: креативный груминг от брифа до финала', excerpt: 'Показываем полный цикл: коммуникация с клиентом, эскиз, техника исполнения и фото результата.', author_id: null, category: 'Креатив', read_time: '10 мин', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800', published_at: '2026-03-24' },
  { id: 2006, title: 'Чек-лист старта карьеры после курса', excerpt: 'Документы, цены, сервис, реклама и первые 10 клиентов: с чего начать, чтобы не выгореть.', author_id: null, category: 'Карьера', read_time: '5 мин', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800', published_at: '2026-03-28' },
];

export function CoursesBlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchTerm, setSearchTerm] = useState('');
  const blogEntity = useEntity<BlogPostRow>('blog_posts', {
    fetchListOnMount: true,
    listParams: { limit: 50, category: 'Курсы' },
  });
  const { list: postsRaw, loadingList: loadingPosts, loadingListError: loadingPostsError } = blogEntity;
  const { list: mastersList } = useEntity<MasterRow>('masters', { fetchListOnMount: true, listParams: { limit: 50 } });

  const getAuthorName = (authorId: number | null) => {
    if (!authorId) return 'Команда Mars Groom';
    const m = mastersList.find((x) => x.id === authorId);
    return m?.full_name ?? 'Команда Mars Groom';
  };

  const sourcePosts = useMemo(() => (postsRaw.length > 0 ? postsRaw : FALLBACK_BLOG_POSTS), [postsRaw]);

  const posts = useMemo(
    () =>
      sourcePosts.map((p) => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt ?? '',
        author: getAuthorName(p.author_id),
        date: p.published_at ?? '',
        category: p.category ?? 'Статья',
        readTime: p.read_time ?? '5 мин',
        image: p.image ?? 'https://images.unsplash.com/photo-1653150756437-41454967e9f5?w=800',
      })),
    [sourcePosts, mastersList]
  );

  const categories = useMemo(() => {
    const cats = new Set<string>(['Все']);
    posts.forEach((p) => p.category && cats.add(p.category));
    return Array.from(cats);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = selectedCategory === 'Все' || post.category === selectedCategory;
      const matchesSearch =
        searchTerm === '' ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchTerm]);

  if (loadingPosts) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#40AB40] animate-spin" />
      </div>
    );
  }
  if (loadingPostsError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <p className="text-red-500">{loadingPostsError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#009B00]/5 via-white to-[#40AB40]/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero в стиле /courses/schedule */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative py-20 md:py-28 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#40AB40]/20 via-transparent to-[#89E689]/10 dark:from-[#40AB40]/30 dark:to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#40AB40] to-[#89E689] bg-clip-text text-transparent">
              Блог о курсах
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
              Полезные статьи и советы по обучению грумингу от наших преподавателей
            </p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Link
                to="/book/course"
                className="inline-flex items-center gap-2 px-10 py-4 btn-gradient-green text-white rounded-2xl font-bold text-lg shadow-lg shadow-[#40AB40]/30 hover:shadow-xl transition-shadow"
              >
                Записаться на курс
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

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
              <Link key={post.id} to={`/courses/blog/${post.id}`} className="block h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl cursor-pointer h-full flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={post.image || '/pictures/hero-section groom room courses.jpg'}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-[#40AB40] text-white px-4 py-2 rounded-full text-sm font-bold">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date ? new Date(post.date).toLocaleDateString('ru-RU') : '—'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{post.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <span className="flex items-center gap-2 text-[#40AB40] font-bold hover:gap-4 transition-all">
                        Читать
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
