import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, BookOpen, Video, FileText, BookMarked, Lock, Unlock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import React from 'react';
import { useEntity } from '../hooks';
import { useAuth } from '../context/AuthContext';
import { estimateReadTimeFromHtml } from '@/app/utils/readTime';

type LibraryArticleRow = { id: number; title: string; slug: string; excerpt: string | null; content: string | null; category: string | null; image: string | null };
const FALLBACK_LIBRARY_ARTICLES: LibraryArticleRow[] = [
  { id: 1001, title: '7 ошибок начинающего грумера и как их избежать', slug: '7-oshibok-groomera', excerpt: 'Практичный чек-лист по типовым ошибкам на старте: от подготовки рабочего места до общения с клиентом.', content: null, category: 'basics', image: null },
  { id: 1002, title: 'Тихий груминг: как снизить стресс у питомца', slug: 'quiet-grooming', excerpt: 'Методы мягкой адаптации, безопасной фиксации и корректной коммуникации с тревожными питомцами.', content: null, category: 'Уход', image: null },
  { id: 1003, title: 'Шпицы и объём: как сохранить форму без лишней длины', slug: 'spitz-volume', excerpt: 'Разбираем технику послойного вычеса, сушку по направлениям и финальный шейпинг силуэта.', content: null, category: 'Собаки', image: null },
  { id: 1004, title: 'Гигиенический груминг: стандарт салона за 45 минут', slug: 'hygiene-standard', excerpt: 'Пошаговый регламент экспресс-процедуры, который повышает качество и скорость работы.', content: null, category: 'techniques', image: null },
  { id: 1005, title: 'Стерилизация инструментов: безопасный протокол', slug: 'tool-sterilization', excerpt: 'Какие средства использовать и как выстроить цикл дезинфекции без потери ресурса инструмента.', content: null, category: 'health', image: null },
  { id: 1006, title: 'Как собрать первое портфолио грумера за 30 дней', slug: 'portfolio-30-days', excerpt: 'План съёмок, структура кейсов и критерии кадров, которые реально продают ваши услуги.', content: null, category: 'basics', image: null },
];

export function KnowledgeLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useAuth();
  const { list: libraryList, loadingList: loadingLibrary } = useEntity<LibraryArticleRow>('library_articles', { fetchListOnMount: true, listParams: { limit: 100 } });
  const { list: courseBookings } = useEntity<{ id: number; user_id: number; course_id: number; status: string }>('course_bookings', {
    fetchListOnMount: !!user,
    listParams: { limit: 50 },
  });
  const isStudent = useMemo(() => !!user && courseBookings.some((b) => b.user_id === user.id && (b.status === 'confirmed' || b.status === 'completed')), [user, courseBookings]);

  const categories = [
    { id: 'all', name: 'Все материалы' },
    { id: 'Собаки', name: 'Собаки' },
    { id: 'Уход', name: 'Уход' },
    { id: 'basics', name: 'Основы груминга' },
    { id: 'techniques', name: 'Техники стрижки' },
    { id: 'health', name: 'Здоровье питомцев' },
  ];

  const sourceArticles = useMemo(
    () => (libraryList.length > 0 ? libraryList : FALLBACK_LIBRARY_ARTICLES),
    [libraryList]
  );

  const articles = useMemo(
    () =>
      sourceArticles.map((a, index) => ({
        id: a.id,
        title: a.title,
        type: (index % 3 === 1 ? 'guide' : index % 3 === 2 ? 'video' : 'article') as const,
        category: a.category || 'basics',
        preview: a.excerpt || '',
        isPremium: false,
        readTime: estimateReadTimeFromHtml(a.content) as string | undefined,
      })),
    [sourceArticles]
  );

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch =
      searchTerm === '' ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccess = !article.isPremium || isStudent;
    return matchesCategory && matchesSearch && matchesAccess;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'guide':
        return BookMarked;
      default:
        return FileText;
    }
  };

  if (loadingLibrary) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#40AB40] animate-spin" />
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
              Библиотека знаний
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
              С нашей академией прокачай навыки и знания в груминге
            </p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Link
                to="/book/course"
                className="inline-flex items-center gap-2 px-10 py-4 btn-gradient-green text-white rounded-2xl font-bold text-lg shadow-lg shadow-[#40AB40]/30 hover:shadow-xl transition-shadow"
              >
                Записаться на курс
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Filters */}
      <section className="py-8 bg-white dark:bg-gray-900 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск по библиотеке..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#009B00]"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-[#009B00] text-white'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => {
              const Icon = getTypeIcon(article.type);
              const canRead = !article.isPremium || isStudent;
              const card = (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl cursor-pointer group flex flex-col h-full ${
                    article.isPremium && !isStudent ? 'opacity-60' : ''
                  }`}
                >
                  <div className="relative h-48 bg-gradient-to-br from-[#40AB40] to-[#89E689] flex items-center justify-center">
                    <Icon className="w-16 h-16 text-white" />
                    {article.isPremium && (
                      <div className="absolute top-4 right-4">
                        {isStudent ? (
                          <Unlock className="w-6 h-6 text-white" />
                        ) : (
                          <Lock className="w-6 h-6 text-white" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-[#89E689]/20 text-[#009B00] rounded-full text-xs font-medium">
                        {categories.find((c) => c.id === article.category)?.name || article.category}
                      </span>
                      {article.readTime && (
                        <span className="text-sm text-gray-500">{article.readTime}</span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-3">{article.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">{article.preview || 'Статья из библиотеки знаний.'}</p>

                    {article.isPremium && !isStudent ? (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-center">
                        <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                          Запишитесь на любой курс — откроется доступ к материалам
                        </p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-[#40AB40] font-bold group-hover:gap-4 transition-all">
                        Читать
                        <Icon className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </motion.div>
              );
              return canRead ? (
                <Link key={article.id} to={`/library/${article.id}`} className="block h-full">
                  {card}
                </Link>
              ) : (
                <div key={article.id} className="h-full">
                  {card}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Glossary Section */}
      <section className="py-24 bg-gradient-to-b from-white to-[#009B00]/10 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Глоссарий терминов</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Все термины и понятия, используемые в груминге
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {[
              { term: 'Тримминг', definition: 'Удаление отмершей шерсти специальными инструментами' },
              { term: 'Стриппинг', definition: 'Техника удаления шерсти вручную с помощью ножа' },
              { term: 'Клипперверк', definition: 'Стрижка машинкой с различными насадками' },
              { term: 'Топ-нот', definition: 'Верхняя часть головы, оставляемая длинной' },
              { term: 'Скайнинг', definition: 'Удаление подшерстка для уменьшения объема' },
              { term: 'Блендинг', definition: 'Плавный переход между разными длинами шерсти' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-bold text-[#009B00] mb-2">{item.term}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.definition}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
