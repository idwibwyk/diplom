import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Play, Pause } from 'lucide-react';
import React from 'react';

interface GalleryItem {
  id: number;
  image: string;
  title: string;
  description: string;
}

export function InteractiveGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const galleryRef = useRef<HTMLDivElement>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1728448644193-34eb04460c95?w=800',
      title: 'Йоркширский терьер',
      description: 'До и после стрижки',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1648643118660-efb8eb0aea93?w=800',
      title: 'Пудель',
      description: 'Креативная стрижка',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1752178407704-6a088ede9ef9?w=800',
      title: 'Персидская кошка',
      description: 'Груминг длинной шерсти',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1653150756437-41454967e9f5?w=800',
      title: 'Шпиц',
      description: 'Выставочный груминг',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1759134155377-4207d89b39ec?w=800',
      title: 'Золотистый ретривер',
      description: 'СПА-уход',
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1752021382723-28103aa59245?w=800',
      title: 'Бишон фризе',
      description: 'Комплексный груминг',
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800',
      title: 'Той-терьер',
      description: 'Стрижка под машинку',
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800',
      title: 'Мопс',
      description: 'Гигиенический уход',
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

  const scrollTo = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full">
      {/* Carousel Gallery */}
      <div className="relative overflow-hidden rounded-2xl" ref={galleryRef}>
        <motion.div 
          className="flex"
          animate={{ 
            x: `-${currentIndex * (100 / 3)}%`
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-full md:w-1/3 px-4"
              style={{ minWidth: '33.333%' }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-xl"
                onClick={() => {
                  setSelectedImage(item.id);
                  setCurrentIndex(index);
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="text-white font-bold text-xl mb-2">{item.title}</p>
                    <p className="text-white/90 text-sm">{item.description}</p>
                  </motion.div>
                  <div className="absolute top-4 right-4">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevImage}
          className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-[#06D6A0] hover:text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <div className="flex gap-2">
          {galleryItems.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollTo(index)}
              className={`h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-[#06D6A0] w-8'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 w-3'
              }`}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextImage}
          className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-[#06D6A0] hover:text-white transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-[#EF476F] hover:text-white transition-colors"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </motion.button>
      </div>


      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Navigation */}
            <motion.button
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
                setSelectedImage(galleryItems[currentIndex].id);
              }}
              className="absolute left-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </motion.button>

            <motion.button
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
                setSelectedImage(galleryItems[currentIndex].id);
              }}
              className="absolute right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </motion.button>

            {/* Image */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
              transition={{ duration: 0.4 }}
              className="max-w-6xl max-h-[85vh] px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryItems[currentIndex].image}
                alt={galleryItems[currentIndex].title}
                className="w-full h-full object-contain rounded-xl shadow-2xl"
              />
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-center"
              >
                <h3 className="text-white text-3xl font-bold mb-2">
                  {galleryItems[currentIndex].title}
                </h3>
                <p className="text-white/80 text-lg">{galleryItems[currentIndex].description}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
