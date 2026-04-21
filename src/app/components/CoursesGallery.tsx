import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Play, Pause } from 'lucide-react';

interface GalleryItem {
  id: number;
  image: string;
  title: string;
  description: string;
}

export function CoursesGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const galleryRef = useRef<HTMLDivElement>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      image: '/pictures/Gallery courses - Practical lesson.jpg',
      title: 'Практическое занятие',
      description: 'Студенты отрабатывают навыки на моделях',
    },
    {
      id: 2,
      image: '/pictures/Gallery courses - Theoretical lesson.jpg',
      title: 'Теоретический урок',
      description: 'Изучение основ груминга в классе',
    },
    {
      id: 3,
      image: '/pictures/Gallery courses - Graduation day.jpg',
      title: 'Выпускной день',
      description: 'Вручение сертификатов выпускникам',
    },
    {
      id: 4,
      image: '/pictures/Gallery courses - Master class.jpg',
      title: 'Мастер-класс',
      description: 'Демонстрация техник от опытных мастеров',
    },
    {
      id: 5,
      image: '/pictures/Gallery courses - Working with tools.jpg',
      title: 'Работа с инструментами',
      description: 'Обучение правильному использованию оборудования',
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
      <div className="relative h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#40AB40] to-[#89E689]">
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
      </div>
    </div>
  );
}
