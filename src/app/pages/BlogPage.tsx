import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Clock, BookOpen, Loader2 } from 'lucide-react';
import { useEntity } from '@/app/hooks';

type BlogPostRow = { id: number; title: string; excerpt: string | null; content: string | null; author_id: number | null; category: string | null; read_time: string | null; image: string | null; published_at: string | null };
type MasterRow = { id: number; full_name: string };

export function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const { list: postsRaw, loadingList, loadingListError } = useEntity<BlogPostRow>('blog_posts', {
    fetchListOnMount: true,
    listParams: { limit: 50 },
  });
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
        date: p.published_at ?? p.id.toString(),
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
    if (selectedCategory === 'Все') return posts;
    return posts.filter((p) => p.category === selectedCategory);
  }, [posts, selectedCategory]);

  if (loadingList) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#E56E9B] animate-spin" />
      </div>
    );
  }
  if (loadingListError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <p className="text-red-500">{loadingListError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-r from-[#E56E9B] to-[#FFB3BA]">
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-bold mb-6">Блог</h1>
            <p className="text-2xl mb-8 max-w-3xl mx-auto">
              Полезные статьи и советы от наших специалистов
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  index === 0
                    ? 'bg-[#E56E9B] text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-[#E56E9B] hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
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
                  <div className="absolute top-4 left-4 bg-[#E56E9B] text-white px-4 py-2 rounded-full text-sm font-bold">
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
                      to={`/blog/${post.id}`}
                      className="flex items-center gap-2 text-[#E56E9B] font-bold hover:gap-4 transition-all"
                    >
                      Читать
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#E56E9B] to-[#FFB3BA] rounded-2xl p-12 text-center text-white max-w-4xl mx-auto"
          >
            <BookOpen className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Подпишитесь на рассылку</h2>
            <p className="text-xl mb-8 opacity-90">
              Получайте полезные статьи и советы прямо на почту
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-[#E56E9B] px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                Подписаться
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
