import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Play, Pause } from 'lucide-react';

interface GalleryItem {
  id: number;
  image: string;
  title: string;
  description: string;
}

export function ServicesGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const galleryRef = useRef<HTMLDivElement>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      image: '/pictures/Gallery services - Yorkshire Terrier haircut.jpg',
      title: 'Стрижка йоркширского терьера',
      description: 'Профессиональная стрижка с учетом стандарта породы',
    },
    {
      id: 2,
      image: '/pictures/Gallery services - Poodle grooming.jpg',
      title: 'Груминг пуделя',
      description: 'Креативная стрижка карликового пуделя',
    },
    {
      id: 3,
      image: '/pictures/Gallery services - Cat grooming.jpg',
      title: 'Груминг кошки',
      description: 'Профессиональный уход за длинной шерстью',
    },
    {
      id: 4,
      image: '/pictures/Gallery services - Pomeranian haircut.jpg',
      title: 'Стрижка шпица',
      description: 'Выставочный груминг померанского шпица',
    },
    {
      id: 5,
      image: '/pictures/Gallery services - Spa care for large breeds.jpg',
      title: 'СПА-уход для крупных пород',
      description: 'Релакс-процедуры для золотистого ретривера',
    },
    {
      id: 6,
      image: '/pictures/Gallery services - Hygiene care.jpg',
      title: 'Гигиенический уход',
      description: 'Комплексный уход за питомцем',
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
      <div className="relative h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#4A90E2] to-[#9EC3EF]">
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
