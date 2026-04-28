import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, BookOpen, Calendar, ArrowRight, User, FileText } from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'service' | 'course' | 'article' | 'master';
  title: string;
  description: string;
  link: string;
  image?: string;
  masterName?: string;
  availableTime?: string;
}

interface PersonalRecommendationsProps {
  recommendations: Recommendation[];
}

export function PersonalRecommendations({ recommendations }: PersonalRecommendationsProps) {
  if (recommendations.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'service':
        return Sparkles;
      case 'course':
        return BookOpen;
      case 'master':
        return User;
      case 'article':
        return FileText;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
      <h3 className="text-2xl font-bold mb-6">Персональные рекомендации</h3>
      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const Icon = getIcon(rec.type);
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-full p-4 bg-gradient-to-r from-[#53C9CA]/10 to-[#9ADFE0]/10 rounded-xl hover:from-[#53C9CA]/20 hover:to-[#9ADFE0]/20 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#53C9CA] to-[#9ADFE0] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-1">{rec.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {rec.description}
                  </p>
                  {rec.availableTime && (
                    <div className="flex items-center gap-2 text-sm text-[#53C9CA] mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{rec.availableTime}</span>
                    </div>
                  )}
                  <Link
                    to={rec.link}
                    className="inline-flex items-center gap-2 text-[#53C9CA] font-bold hover:gap-4 transition-all text-sm"
                  >
                    Подробнее
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

type RecommendationContext = {
  userId: number;
  petBreeds: string[];
  hasFavoriteServices: boolean;
  hasFavoriteCourses: boolean;
  visitsCount: number;
};

const ARTICLE_POOL: Recommendation[] = [
  {
    id: 'article-1',
    type: 'article',
    title: 'Как сохранить результат стрижки дольше',
    description: 'Практика домашнего ухода между визитами.',
    link: '/services/blog',
  },
  {
    id: 'article-2',
    type: 'article',
    title: 'Уход за шерстью после купания',
    description: 'Что делать в первые 48 часов после процедуры.',
    link: '/services/blog',
  },
  {
    id: 'article-3',
    type: 'article',
    title: 'Подготовка питомца к визиту без стресса',
    description: 'Чек-лист перед записью на груминг.',
    link: '/services/blog',
  },
];

export const getRecommendationsForUser = (ctx: RecommendationContext): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  const seed = Math.abs(ctx.userId || 1);
  const articlePick = ARTICLE_POOL[seed % ARTICLE_POOL.length];
  recommendations.push({ ...articlePick, id: `${articlePick.id}-${seed}` });

  const hasSpitz = ctx.petBreeds.some((b) => b.toLowerCase().includes('шпиц'));
  const hasPoodle = ctx.petBreeds.some((b) => b.toLowerCase().includes('пудел'));

  if (hasSpitz) {
    recommendations.push({
      id: `spitz-${seed}`,
      type: 'service',
      title: 'Для шпица: поддержка объема и антиколтуны',
      description: 'Подберите интервал визитов и домашний уход под густой подшерсток.',
      link: '/services/list',
    });
  } else if (hasPoodle) {
    recommendations.push({
      id: `poodle-${seed}`,
      type: 'master',
      title: 'Для пуделя: аккуратная модельная линия',
      description: 'Рекомендуем запись к мастеру с опытом сложных силуэтов.',
      link: '/services/list',
      masterName: 'Мастер по породным стрижкам',
      availableTime: 'Ближайшее окно на неделе',
    });
  } else {
    recommendations.push({
      id: `general-care-${seed}`,
      type: 'service',
      title: 'Поддерживающий уход между основными визитами',
      description: 'Когти, уши и экспресс-уход помогают сохранить комфорт питомца.',
      link: '/services/list',
    });
  }

  if (!ctx.hasFavoriteCourses || ctx.visitsCount < 2) {
    recommendations.push({
      id: `course-${seed}`,
      type: 'course',
      title: 'Подборка курсов для владельцев',
      description: 'Короткие программы по базовому уходу в домашних условиях.',
      link: '/courses/list',
    });
  } else {
    recommendations.push({
      id: `next-step-${seed}`,
      type: 'course',
      title: 'Следующий шаг в обучении',
      description: 'Выберите курс продвинутого уровня с практикой.',
      link: '/courses/list',
    });
  }

  return recommendations.slice(0, 3);
};
