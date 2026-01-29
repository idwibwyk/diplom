import { motion } from 'motion/react';
import { Award, BookOpen, Users, Star, Zap } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: typeof Award;
  earned: boolean;
  progress?: number;
}

interface StudentBadgesProps {
  badges: Badge[];
}

export function StudentBadges({ badges }: StudentBadgesProps) {
  const earnedBadges = badges.filter((b) => b.earned).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold">Достижения</h3>
          <p className="text-gray-500 text-sm">
            Получено {earnedBadges} из {badges.length} значков
          </p>
        </div>
        <div className="w-16 h-16 bg-gradient-to-br from-[#009B00] to-[#89E689] rounded-full flex items-center justify-center">
          <Award className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                badge.earned
                  ? 'border-[#009B00] bg-gradient-to-br from-[#009B00]/20 to-[#89E689]/20'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 opacity-60'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    badge.earned
                      ? 'bg-gradient-to-br from-[#009B00] to-[#89E689]'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      badge.earned ? 'text-white' : 'text-gray-500'
                    }`}
                  />
                </div>
                <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {badge.description}
                </p>
                {badge.progress !== undefined && !badge.earned && (
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                    <div
                      className="bg-[#009B00] h-1 rounded-full"
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                )}
              </div>
              {badge.earned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2"
                >
                  <div className="w-6 h-6 bg-[#009B00] rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white fill-white" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Пример использования:
export const defaultBadges: Badge[] = [
  {
    id: 'machine-master',
    name: 'Ас машинки',
    description: 'Пройдено 10 уроков по работе с машинкой',
    icon: Zap,
    earned: true,
  },
  {
    id: 'breed-expert',
    name: 'Знаток пород',
    description: 'Изучено 20 пород собак',
    icon: BookOpen,
    earned: false,
    progress: 65,
  },
  {
    id: 'community-active',
    name: 'Активный участник',
    description: '10 сообщений на форуме',
    icon: Users,
    earned: true,
  },
  {
    id: 'module-complete',
    name: 'Модуль завершен',
    description: 'Пройден первый модуль',
    icon: Award,
    earned: true,
  },
  {
    id: 'perfect-score',
    name: 'Отличник',
    description: '100% правильных ответов в тестах',
    icon: Star,
    earned: false,
    progress: 80,
  },
];
