import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Flower, Star, Award, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';

interface PathStage {
  id: number;
  title: string;
  icon: React.ComponentType<any>;
  duration?: string;
}

export function GroomerPath() {
  const { theme } = useTheme();
  const [currentActiveStage, setCurrentActiveStage] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  const stages: PathStage[] = [
    {
      id: 1,
      title: 'Базовый курс',
      icon: Flower,
      duration: '3 месяца',
    },
    {
      id: 2,
      title: 'Вручение удостоверения',
      icon: Star,
      duration: '1 день',
    },
    {
      id: 3,
      title: 'Повышение квалификации',
      icon: Award,
      duration: '6 месяцев',
    },
    {
      id: 4,
      title: 'Онлайн курс',
      icon: Globe,
      duration: '2 месяца',
    },
  ];

  useEffect(() => {
    // Анимация при скролле к компоненту
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Автоматическая анимация прогресса
            let stageIndex = 0;
            const progressInterval = setInterval(() => {
              if (stageIndex < stages.length) {
                // Вычисляем процент прогресса для текущей стадии
                const progressPercent = ((stageIndex + 1) / stages.length) * 100;
                setProgressWidth(progressPercent);
                setCurrentActiveStage(stageIndex);
                stageIndex++;
              } else {
                clearInterval(progressInterval);
              }
            }, 2000); // 2 секунды на каждую стадию

            return () => clearInterval(progressInterval);
          }
        });
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('groomer-path');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const isDark = theme === 'dark';

  return (
    <section
      id="groomer-path"
      className={`py-24 ${
        isDark
          ? 'bg-[#101828] text-white' // Изменено с градиента на #101828
          : 'bg-white dark:bg-gray-50 text-gray-900'
      }`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Путь грумера</h2>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            От новичка до профессионала: ваш путь в MARS GROOM
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto relative">
          {/* Полоса под иконками (z-0), иконки z-10 перекрывают */}
          <div className={`absolute top-8 left-0 right-0 h-2 hidden md:block rounded-full z-0 ${
            isDark ? 'bg-white/20' : 'bg-gray-300'
          }`} />
          <motion.div
            className="absolute top-8 left-0 h-2 bg-gradient-to-r from-[#40AB40] to-[#89E689] hidden md:block rounded-full z-0"
            initial={{ width: 0 }}
            animate={{ width: `${progressWidth}%` }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = index === currentActiveStage;
              const isPast = index < currentActiveStage;
              const isFuture = index > currentActiveStage;
              /* Прошлые: закрашены, менее насыщенный зелёный. Будущие: серый. Полоса под иконками. */
              const pastBg = isDark ? 'bg-[#4A7C4A]' : 'bg-[#6BBF6B]';
              const futureBg = isDark ? 'bg-gray-600' : 'bg-gray-300';

              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={
                        isActive
                          ? {
                              scale: [1, 1.3, 1.2],
                              boxShadow: [
                                '0 0 0 0px rgba(64, 171, 64, 0.7)',
                                '0 0 0 20px rgba(64, 171, 64, 0)',
                                '0 0 0 0px rgba(64, 171, 64, 0)',
                              ],
                            }
                          : {}
                      }
                      transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                      className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
                        isActive
                          ? 'bg-gradient-to-br from-[#40AB40] to-[#89E689] shadow-2xl shadow-[#40AB40]/50'
                          : isPast
                          ? pastBg
                          : futureBg
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 transition-all duration-500 ${
                          isActive
                            ? 'text-white scale-110'
                            : isPast
                            ? 'text-white'
                            : isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      />
                    </motion.div>

                    <div className="text-center mb-4">
                      <h3
                        className={`text-lg font-bold mb-2 transition-all duration-500 ${
                          isActive
                            ? 'text-[#40AB40] scale-110'
                            : isPast
                            ? isDark ? 'text-white' : 'text-gray-900'
                            : isDark ? 'text-white/60' : 'text-gray-500'
                        }`}
                      >
                        {stage.title}
                      </h3>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isActive || isPast ? 1 : 0.5 }}
                      transition={{ delay: index * 0.2 + 0.3 }}
                      className="mt-auto"
                    >
                      <div
                        className={`px-4 py-2 rounded-lg text-sm transition-all duration-500 ${
                          isActive
                            ? 'bg-[#40AB40] text-white'
                            : isPast
                            ? isDark
                              ? 'bg-[#2F312F] text-white/70'
                              : 'bg-gray-200 text-gray-700'
                            : isDark
                              ? 'bg-[#2F312F] text-white/40'
                              : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {stage.duration}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}