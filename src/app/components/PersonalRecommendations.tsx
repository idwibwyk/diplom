import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, BookOpen, Calendar, ArrowRight, User } from 'lucide-react';

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
              className="p-4 bg-gradient-to-r from-[#53C9CA]/10 to-[#9ADFE0]/10 rounded-xl hover:from-[#53C9CA]/20 hover:to-[#9ADFE0]/20 transition-all"
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

// Пример использования:
export const getRecommendations = (viewedServices: string[], viewedCourses: string[]): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // Рекомендации на основе просмотренных услуг
  if (viewedServices.includes('shpitz')) {
    recommendations.push({
      id: 'rec-1',
      type: 'article',
      title: 'Вам также может быть интересна статья об уходе за шпицем',
      description: 'Узнайте больше о специфике ухода за шпицами',
      link: '/blog/shpitz-care',
    });
  }

  if (viewedServices.includes('poodle')) {
    recommendations.push({
      id: 'rec-2',
      type: 'master',
      title: 'Смотрите, у Ольги завтра есть свободное окно для стрижки пуделей',
      description: 'Мастер Ольга Петрова специализируется на пуделях',
      link: '/services',
      masterName: 'Ольга Петрова',
      availableTime: 'Завтра в 14:00',
    });
  }

  // Рекомендации на основе просмотренных курсов
  if (viewedCourses.includes('beginner')) {
    recommendations.push({
      id: 'rec-3',
      type: 'course',
      title: 'Рекомендуем курс "Профессиональный груминг"',
      description: 'Продолжите обучение с углубленной программой',
      link: '/courses/2',
    });
  }

  return recommendations;
};
