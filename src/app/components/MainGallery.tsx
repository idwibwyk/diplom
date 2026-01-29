import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Play, Pause } from 'lucide-react';

interface GalleryItem {
  id: number;
  image: string;
  title: string;
  description: string;
}

export function MainGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Галерея для главной страницы - комбинация услуг и курсов, но другие фотографии
  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      image: '/pictures/hero-section groom room.jpg',
      title: 'MARS GROOM',
      description: 'Ваш надежный партнер в уходе за питомцами',
    },
    {
      id: 2,
      image: '/pictures/The basics of dog grooming.jpg',
      title: 'Базовые курсы груминга',
      description: 'Обучение основам профессии грумера',
    },
    {
      id: 3,
      image: '/pictures/Professional grooming.jpg',
      title: 'Профессиональный груминг',
      description: 'Высокое качество услуг и обучения',
    },
    {
      id: 4,
      image: '/pictures/Creative grooming.jpg',
      title: 'Креативные стрижки',
      description: 'Уникальные дизайнерские решения',
    },
    {
      id: 5,
      image: '/pictures/Express molting for long-haired dogs.jpg',
      title: 'Экспресс-линька',
      description: 'Специализированные услуги для длинношёрстных пород',
    },
    {
      id: 6,
      image: '/pictures/Cat grooming.jpg',
      title: 'Груминг кошек',
      description: 'Профессиональный уход за вашими кошками',
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, galleryItems.length]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  return (
    <div className="relative" ref={galleryRef}>
      <div className="relative h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#53C9CA] to-[#9ADFE0]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={galleryItems[currentIndex].image}
              alt={galleryItems[currentIndex].title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback если изображение не загрузилось
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1653150756437-41454967e9f5?w=1200';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-3xl font-bold mb-2">{galleryItems[currentIndex].title}</h3>
              <p className="text-lg">{galleryItems[currentIndex].description}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors z-10"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>

        {/* Индикаторы */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {galleryItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
