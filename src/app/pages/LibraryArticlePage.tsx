import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Video, FileText, BookMarked, Clock } from 'lucide-react';

interface LibraryArticle {
  id: number;
  title: string;
  type: 'article' | 'video' | 'guide';
  category: string;
  preview: string;
  content: string;
  isPremium: boolean;
  readTime?: string;
  videoDuration?: string;
}

export function LibraryArticlePage() {
  const { id } = useParams<{ id: string }>();

  // Mock articles - в реальном приложении это будет из API
  const articles: LibraryArticle[] = [
    {
      id: 1,
      title: 'Основы груминга для начинающих',
      type: 'article',
      category: 'basics',
      preview: 'Полное руководство по основам груминга: от выбора инструментов до первых стрижек.',
      content: `
        <h2>Введение в груминг</h2>
        <p>Груминг - это не просто стрижка животных, это целое искусство, требующее знаний, навыков и любви к животным.</p>
        
        <h2>Выбор инструментов</h2>
        <p>Правильный выбор инструментов - это основа успешного груминга. Вам понадобятся...</p>
        
        <h2>Первые стрижки</h2>
        <p>Начните с простых стрижек, постепенно переходя к более сложным техникам...</p>
      `,
      isPremium: false,
      readTime: '15 мин',
    },
    {
      id: 2,
      title: 'Как стричь йоркширского терьера',
      type: 'video',
      category: 'breeds',
      preview: 'Пошаговое видео-руководство по стрижке йорка с профессиональными советами.',
      content: `
        <h2>Видео урок по стрижке йорка</h2>
        <p>В этом видео вы узнаете...</p>
      `,
      isPremium: false,
      videoDuration: '25 мин',
    },
    {
      id: 3,
      title: 'Профессиональные техники стрижки пуделя',
      type: 'guide',
      category: 'techniques',
      preview: 'Углубленное руководство по различным техникам стрижки пуделей для выставок.',
      content: `
        <h2>Техники стрижки пуделя</h2>
        <p>Подробное руководство...</p>
      `,
      isPremium: true,
      readTime: '45 мин',
    },
    {
      id: 4,
      title: 'Выбор инструментов для груминга',
      type: 'article',
      category: 'tools',
      preview: 'Подробный обзор всех необходимых инструментов и их правильное использование.',
      content: `
        <h2>Инструменты для груминга</h2>
        <p>Полный обзор инструментов...</p>
      `,
      isPremium: false,
      readTime: '20 мин',
    },
    {
      id: 5,
      title: 'Работа с агрессивными питомцами',
      type: 'video',
      category: 'health',
      preview: 'Техники работы с агрессивными и беспокойными питомцами от опытных грумеров.',
      content: `
        <h2>Работа с агрессивными питомцами</h2>
        <p>Важные техники...</p>
      `,
      isPremium: true,
      videoDuration: '30 мин',
    },
    {
      id: 6,
      title: 'Глоссарий терминов груминга',
      type: 'article',
      category: 'basics',
      preview: 'Полный словарь терминов и понятий, используемых в груминге.',
      content: `
        <h2>Глоссарий терминов</h2>
        <p>Полный словарь...</p>
      `,
      isPremium: false,
      readTime: '10 мин',
    },
    {
      id: 7,
      title: 'Техники стрижки: от базовых до профессиональных',
      type: 'article',
      category: 'techniques',
      preview: 'Подробный обзор различных техник стрижки собак разных пород. Узнайте о базовых и продвинутых методах работы с шерстью.',
      content: `
        <h2>Введение в техники стрижки</h2>
        <p>Техники стрижки собак разнообразны и зависят от породы, типа шерсти и желаемого результата. В этой статье мы рассмотрим основные и продвинутые техники стрижки.</p>
        
        <h2>Базовые техники</h2>
        <h3>Стрижка машинкой</h3>
        <p>Стрижка машинкой (клипперверк) - это базовая техника, которая используется для создания равномерной длины шерсти. Выбор насадки определяет длину шерсти.</p>
        
        <h3>Ножницы прямые</h3>
        <p>Прямые ножницы используются для точной стрижки и создания четких линий. Особенно важны для работы с головой и мордой.</p>
        
        <h3>Ножницы филировочные</h3>
        <p>Филировочные ножницы используются для создания плавных переходов и мягких линий. Идеальны для блендинга и обработки краев.</p>
        
        <h2>Продвинутые техники</h2>
        <h3>Скайнинг</h3>
        <p>Скайнинг - это техника удаления подшерстка для уменьшения объема шерсти. Особенно важна для длинношёрстных пород.</p>
        
        <h3>Тримминг</h3>
        <p>Тримминг - это удаление отмершей шерсти специальными инструментами. Используется для жесткошёрстных пород.</p>
        
        <h3>Стриппинг</h3>
        <p>Стриппинг - это ручное удаление шерсти с помощью специального ножа. Традиционная техника для некоторых пород терьеров.</p>
        
        <h2>Техники по породам</h2>
        <h3>Мелкие породы</h3>
        <p>Для мелких пород важна точность и внимание к деталям. Часто используются комбинации техник.</p>
        
        <h3>Крупные породы</h3>
        <p>Для крупных пород важна скорость и эффективность. Часто используется стрижка машинкой с различными насадками.</p>
        
        <h2>Заключение</h2>
        <p>Овладение различными техниками стрижки - это основа профессионального груминга. Практикуйтесь регулярно и изучайте новые методы.</p>
      `,
      isPremium: false,
      readTime: '25 мин',
    },
    {
      id: 8,
      title: 'Здоровье питомцев во время груминга',
      type: 'article',
      category: 'health',
      preview: 'Важная информация о том, как обеспечить безопасность и здоровье питомца во время процедур груминга. Признаки проблем и первая помощь.',
      content: `
        <h2>Безопасность и здоровье питомца</h2>
        <p>Обеспечение безопасности и здоровья питомца во время груминга - это приоритет номер один для любого профессионального грумера.</p>
        
        <h2>Подготовка к процедуре</h2>
        <h3>Осмотр питомца</h3>
        <p>Перед началом любой процедуры необходимо провести визуальный осмотр питомца:</p>
        <ul>
          <li>Проверьте состояние кожи на предмет ранок, раздражений или покраснений</li>
          <li>Осмотрите уши на наличие инфекций или паразитов</li>
          <li>Проверьте глаза на признаки заболеваний</li>
          <li>Оцените общее состояние и настроение питомца</li>
        </ul>
        
        <h3>Учет состояния здоровья</h3>
        <p>Важно учитывать возраст, состояние здоровья и особенности конкретного питомца при выборе процедур.</p>
        
        <h2>Признаки проблем</h2>
        <h3>Физические признаки</h3>
        <ul>
          <li>Покраснение или раздражение кожи</li>
          <li>Повышенная температура</li>
          <li>Необычное поведение (агрессия, вялость)</li>
          <li>Затрудненное дыхание</li>
          <li>Дрожь или судороги</li>
        </ul>
        
        <h3>Поведенческие признаки</h3>
        <ul>
          <li>Отказ от еды</li>
          <li>Изменение в поведении</li>
          <li>Повышенная агрессивность или, наоборот, вялость</li>
        </ul>
        
        <h2>Первая помощь</h2>
        <h3>При порезах</h3>
        <p>Если во время стрижки произошел порез:</p>
        <ol>
          <li>Остановите кровотечение, прижав чистой тканью</li>
          <li>Обработайте рану антисептиком</li>
          <li>Наложите повязку при необходимости</li>
          <li>Свяжитесь с ветеринаром если порез глубокий</li>
        </ol>
        
        <h3>При стрессе</h3>
        <p>Если питомец испытывает стресс:</p>
        <ol>
          <li>Немедленно прекратите процедуру</li>
          <li>Дайте питомцу время успокоиться</li>
          <li>Предложите воду</li>
          <li>Если стресс сильный - обратитесь к ветеринару</li>
        </ol>
        
        <h2>Профилактика проблем</h2>
        <ul>
          <li>Регулярные перерывы во время процедуры</li>
          <li>Использование качественных инструментов</li>
          <li>Правильная фиксация питомца</li>
          <li>Поддержание спокойной атмосферы</li>
        </ul>
        
        <h2>Заключение</h2>
        <p>Здоровье и безопасность питомца всегда должны быть приоритетом. При малейших сомнениях обращайтесь к ветеринару.</p>
      `,
      isPremium: false,
      readTime: '20 мин',
    },
  ];

  const article = articles.find((a) => a.id === parseInt(id || '1'));

  if (!article) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Статья не найдена</h1>
          <Link
            to="/library"
            className="text-[#40AB40] hover:underline"
          >
            Вернуться к библиотеке
          </Link>
        </div>
      </div>
    );
  }

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

  const Icon = getTypeIcon(article.type);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section
        className="relative py-32 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #40AB40 0%, #89E689 100%)',
        }}
      >
        <div className="container mx-auto px-4 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              to="/library"
              className="inline-flex items-center gap-2 mb-6 text-white hover:opacity-80 transition-opacity"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              Вернуться к библиотеке
            </Link>
            <div className="mb-4 flex items-center gap-4">
              <Icon className="w-8 h-8" />
              <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-bold">
                {article.category === 'techniques' ? 'Техники стрижки' : 
                 article.category === 'health' ? 'Здоровье питомцев' :
                 article.category === 'basics' ? 'Основы груминга' :
                 article.category === 'breeds' ? 'Породы собак' :
                 article.category === 'tools' ? 'Инструменты' : 'Статья'}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              {article.readTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{article.readTime}</span>
                </div>
              )}
              {article.videoDuration && (
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  <span>{article.videoDuration}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
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
