import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Clock, Search, Loader2 } from 'lucide-react';
import { useEntity } from '@/app/hooks';

type BlogPostRow = { id: number; title: string; excerpt: string | null; author_id: number | null; category: string | null; read_time: string | null; image: string | null; published_at: string | null };
type MasterRow = { id: number; full_name: string };

export function ServicesBlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchTerm, setSearchTerm] = useState('');
  const blogEntity = useEntity<BlogPostRow>('blog_posts', {
    fetchListOnMount: true,
    listParams: { limit: 50, category: 'Услуги' },
  });
  const { list: postsRaw, loadingList: loadingPosts, loadingListError: loadingPostsError } = blogEntity;
  const { list: mastersList } = useEntity<MasterRow>('masters', { fetchListOnMount: true, listParams: { limit: 50 } });

  const getAuthorName = (authorId: number | null) => {
    if (!authorId) return 'Команда Mars Groom';
    const m = mastersList.find((x) => x.id === authorId);
    return m?.full_name ?? 'Команда Mars Groom';
  };

  const posts = useMemo(
    () =>
      postsRaw.map((p) => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt ?? '',
        author: getAuthorName(p.author_id),
        date: p.published_at ?? '',
        category: p.category ?? 'Статья',
        readTime: p.read_time ?? '5 мин',
        image: p.image ?? 'https://images.unsplash.com/photo-1648643118660-efb8eb0aea93?w=800',
      })),
    [postsRaw, mastersList]
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
        <Loader2 className="w-12 h-12 text-[#4A90E2] animate-spin" />
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
    <div className="min-h-screen bg-gradient-to-b from-[#4A90E2]/5 via-white to-[#9EC3EF]/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero в стиле /services/list */}
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
              Блог об услугах
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
              Полезные статьи и советы по уходу за питомцами от наших специалистов
            </p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Link
                to="/services/list"
                className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] text-white rounded-2xl font-bold text-lg shadow-lg shadow-[#4A90E2]/30 hover:shadow-xl transition-shadow"
              >
                Прайс-лист
                <Calendar className="w-5 h-5" />
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
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
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
                      ? 'bg-[#4A90E2] text-white'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-[#4A90E2] hover:text-white'
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
              <Link key={post.id} to={`/services/blog/${post.id}`} className="block h-full">
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
                      src={post.image || '/pictures/hero-section groom room services.jpg'}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-[#4A90E2] text-white px-4 py-2 rounded-full text-sm font-bold">
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
                      <span className="flex items-center gap-2 text-[#4A90E2] font-bold hover:gap-4 transition-all">
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
