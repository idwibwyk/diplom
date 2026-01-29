import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, BookOpen, Video, FileText, BookMarked, Lock, Unlock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Article {
  id: number;
  title: string;
  type: 'article' | 'video' | 'guide';
  category: string;
  preview: string;
  isPremium: boolean;
  readTime?: string;
  videoDuration?: string;
}

export function KnowledgeLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isStudent, setIsStudent] = useState(false); // В реальном приложении из контекста пользователя

  const categories = [
    { id: 'all', name: 'Все материалы' },
    { id: 'basics', name: 'Основы груминга' },
    { id: 'breeds', name: 'Породы собак' },
    { id: 'tools', name: 'Инструменты' },
    { id: 'techniques', name: 'Техники стрижки' },
    { id: 'health', name: 'Здоровье питомцев' },
  ];

  const articles: Article[] = [
    {
      id: 1,
      title: 'Основы груминга для начинающих',
      type: 'article',
      category: 'basics',
      preview: 'Полное руководство по основам груминга: от выбора инструментов до первых стрижек.',
      isPremium: false,
      readTime: '15 мин',
    },
    {
      id: 2,
      title: 'Как стричь йоркширского терьера',
      type: 'video',
      category: 'breeds',
      preview: 'Пошаговое видео-руководство по стрижке йорка с профессиональными советами.',
      isPremium: false,
      videoDuration: '25 мин',
    },
    {
      id: 3,
      title: 'Профессиональные техники стрижки пуделя',
      type: 'guide',
      category: 'techniques',
      preview: 'Углубленное руководство по различным техникам стрижки пуделей для выставок.',
      isPremium: true,
      readTime: '45 мин',
    },
    {
      id: 4,
      title: 'Выбор инструментов для груминга',
      type: 'article',
      category: 'tools',
      preview: 'Подробный обзор всех необходимых инструментов и их правильное использование.',
      isPremium: false,
      readTime: '20 мин',
    },
    {
      id: 5,
      title: 'Работа с агрессивными питомцами',
      type: 'video',
      category: 'health',
      preview: 'Техники работы с агрессивными и беспокойными питомцами от опытных грумеров.',
      isPremium: true,
      videoDuration: '30 мин',
    },
    {
      id: 6,
      title: 'Глоссарий терминов груминга',
      type: 'article',
      category: 'basics',
      preview: 'Полный словарь терминов и понятий, используемых в груминге.',
      isPremium: false,
      readTime: '10 мин',
    },
    {
      id: 7,
      title: 'Техники стрижки: от базовых до профессиональных',
      type: 'article',
      category: 'techniques',
      preview: 'Подробный обзор различных техник стрижки собак разных пород. Узнайте о базовых и продвинутых методах работы с шерстью.',
      isPremium: false,
      readTime: '25 мин',
    },
    {
      id: 8,
      title: 'Здоровье питомцев во время груминга',
      type: 'article',
      category: 'health',
      preview: 'Важная информация о том, как обеспечить безопасность и здоровье питомца во время процедур груминга. Признаки проблем и первая помощь.',
      isPremium: false,
      readTime: '20 мин',
    },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#009B00]/10 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero */}
      <section
        className="relative py-32 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #009B00 0%, #89E689 100%)',
        }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-bold mb-6">Библиотека знаний</h1>
            <p className="text-2xl mb-8 max-w-2xl mx-auto">
              С нашей академией прокачай навыки и знания в груминге 
            </p>
            <Link
              to="/book/course"
              className="inline-block bg-white text-[#009B00] px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Записаться на курс
            </Link>
          </motion.div>
        </div>
      </section>

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
              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl cursor-pointer group ${
                    article.isPremium && !isStudent ? 'opacity-60' : ''
                  }`}
                >
                  <div className="relative h-48 bg-gradient-to-br from-[#009B00] to-[#89E689] flex items-center justify-center">
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

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-[#89E689]/20 text-[#009B00] rounded-full text-xs font-medium">
                        {categories.find((c) => c.id === article.category)?.name}
                      </span>
                      {article.readTime && (
                        <span className="text-sm text-gray-500">{article.readTime}</span>
                      )}
                      {article.videoDuration && (
                        <span className="text-sm text-gray-500">{article.videoDuration}</span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-3">{article.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{article.preview}</p>

                    {article.isPremium && !isStudent ? (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-center">
                        <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                          Требуется подписка на курс
                        </p>
                      </div>
                    ) : (
                      <Link
                        to={`/library/${article.id}`}
                        className="inline-flex items-center gap-2 text-[#009B00] font-bold hover:gap-4 transition-all"
                      >
                        Читать
                        <Icon className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </motion.div>
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
