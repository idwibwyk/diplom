import { useMemo } from 'react';
import { motion } from 'motion/react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Calendar, User, ArrowRight, Clock, Loader2 } from 'lucide-react';
import { useEntity } from '@/app/hooks';

type BlogPostRow = { id: number; title: string; excerpt: string | null; content: string | null; author_id: number | null; category: string | null; read_time: string | null; image: string | null; published_at: string | null };
type MasterRow = { id: number; full_name: string };

export function BlogArticlePage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const pathname = location.pathname;
  const isServicesBlog = pathname.includes('/services/blog');
  const isCoursesBlog = pathname.includes('/courses/blog');
  const backTo = isServicesBlog ? '/services/blog' : isCoursesBlog ? '/courses/blog' : '/blog';

  const postId = id ? parseInt(id, 10) : null;
  const { item: postData, loadingItem, loadingItemError } = useEntity<BlogPostRow>('blog_posts', {
    fetchListOnMount: false,
    id: postId,
    fetchItemOnMount: !!postId,
    enabled: !!postId,
  });
  const { list: mastersList } = useEntity<MasterRow>('masters', { fetchListOnMount: true, listParams: { limit: 50 } });

  const authorName = useMemo(() => {
    if (!postData?.author_id) return 'Команда Mars Groom';
    const m = mastersList.find((x) => x.id === postData.author_id);
    return m?.full_name ?? 'Команда Mars Groom';
  }, [postData?.author_id, mastersList]);

  const post = useMemo(() => {
    if (!postData) return null;
    return {
      id: postData.id,
      title: postData.title,
      excerpt: postData.excerpt ?? '',
      content: postData.content ?? '<p>Содержание статьи.</p>',
      author: authorName,
      date: postData.published_at ?? '',
      category: postData.category ?? 'Статья',
      readTime: postData.read_time ?? '5 мин',
      image: postData.image ?? (isServicesBlog ? '/pictures/hero-section groom room services.jpg' : '/pictures/hero-section groom room courses.jpg'),
    };
  }, [postData, authorName]);

  if (postId && loadingItem) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#4A90E2] animate-spin" />
      </div>
    );
  }
  if (postId && loadingItemError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-24">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500 mb-4">{loadingItemError}</p>
          <Link to={backTo} className="text-[#4A90E2] hover:underline">Вернуться к блогу</Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Статья не найдена</h1>
          <Link to={backTo} className="text-[#4A90E2] hover:underline">
            Вернуться к блогу
          </Link>
        </div>
      </div>
    );
  }

  const colorScheme = isServicesBlog
    ? { primary: '#4A90E2', secondary: '#9EC3EF' }
    : isCoursesBlog
    ? { primary: '#40AB40', secondary: '#89E689' }
    : { primary: '#E56E9B', secondary: '#FFB3BA' };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section
        className="relative py-24 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.secondary} 100%)`,
        }}
      >
        <div className="container mx-auto px-4 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              to={backTo}
              className="inline-flex items-center gap-2 mb-6 text-white hover:opacity-80 transition-opacity"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              Вернуться к блогу
            </Link>
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-bold">
                {post.category}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{post.date ? new Date(post.date).toLocaleDateString('ru-RU') : '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-10 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-gray-200/50 dark:ring-gray-700/50"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-80 md:h-96 object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-img:rounded-xl prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                color: '#333',
              }}
            />
          </div>
        </div>
      </article>
    </div>
  );
}
