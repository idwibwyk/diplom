import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPosts } from '@/app/data/mockData';

const dailyTips = blogPosts.map((post) => ({
  tip: post.excerpt,
  article: post.title,
  articleId: post.id,
}));

export function DailyTipWidget() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    // Получаем индекс на основе дня года, чтобы совет менялся ежедневно
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const tipIndex = dayOfYear % dailyTips.length;
    setCurrentTipIndex(tipIndex);
  }, []);

  const currentTip = dailyTips[currentTipIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#53C9CA] to-[#9ADFE0] rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-6 h-6 text-[#53C9CA]" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">Совет дня от грумера</h3>
          <p className="text-white mb-4 leading-relaxed">{currentTip.tip}</p>
          <Link
            to={`/blog/${currentTip.articleId || encodeURIComponent(currentTip.article)}`}
            className="inline-flex items-center gap-2 text-white font-bold hover:gap-4 transition-all"
          >
            Подробнее
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
