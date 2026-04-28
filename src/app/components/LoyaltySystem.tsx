import { motion } from 'motion/react';
import { Award, Gift, Sparkles } from 'lucide-react';

interface LoyaltySystemProps {
  points: number;
  totalForDiscount: number;
  discountPercent: number;
}

export function LoyaltySystem({ points, totalForDiscount, discountPercent }: LoyaltySystemProps) {
  const progress = Math.min(100, (points / totalForDiscount) * 100);
  const remaining = Math.max(0, totalForDiscount - points);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-[#53C9CA] to-[#9ADFE0] text-white rounded-2xl p-8 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-7">
        <h3 className="text-2xl font-bold">Система лояльности "Лапки"</h3>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-5xl font-bold">{points}</span>
          <span className="text-2xl opacity-90">лапок</span>
        </div>

        <div className="w-full bg-white/30 rounded-full h-4 mb-2">
          <motion.div
            className="bg-white rounded-full h-4 transition-all duration-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="opacity-90">
            {remaining > 0 ? `До скидки ${discountPercent}% осталось ${remaining} лапок` : 'Скидка активирована!'}
          </span>
          <span className="opacity-90">{points}/{totalForDiscount}</span>
        </div>
      </div>

      <div className="space-y-3 text-sm opacity-90">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span>1 лапка = 100₽ потраченных</span>
        </div>
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5" />
          <span>{totalForDiscount} лапок = {discountPercent}% скидка</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          <span>Бонус в день рождения клиента: 5% (окно 7 дней)</span>
        </div>
      </div>

      {progress >= 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center"
        >
          <p className="font-bold text-lg mb-2">🎉 Поздравляем!</p>
          <p>Вы получили скидку {discountPercent}% на услуги и курсы</p>
        </motion.div>
      )}
    </motion.div>
  );
}
