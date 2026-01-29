import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, Loader } from 'lucide-react';

interface VoiceFAQAssistantProps {
  faqItems: Array<{ question: string; answer: string }>;
}

export function VoiceFAQAssistant({ faqItems }: VoiceFAQAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setIsProcessing(true);

    // Симуляция распознавания речи (в реальном приложении здесь будет Web Speech API)
    setTimeout(() => {
      const randomQuestion = faqItems[Math.floor(Math.random() * faqItems.length)];
      const simulatedQuestion = randomQuestion.question;
      
      // Находим ответ из FAQ
      const matchedFAQ = faqItems.find(
        (item) => item.question.toLowerCase().includes(simulatedQuestion.toLowerCase()) ||
                  simulatedQuestion.toLowerCase().includes(item.question.toLowerCase().split(' ')[0])
      );

      if (matchedFAQ) {
        setAnswer(matchedFAQ.answer);
      } else {
        // Если вопрос не найден, ищем по ключевым словам
        const keywords = simulatedQuestion.toLowerCase().split(' ');
        const foundAnswer = faqItems.find((item) =>
          keywords.some((keyword) =>
            item.question.toLowerCase().includes(keyword) ||
            item.answer.toLowerCase().includes(keyword)
          )
        );

        setAnswer(
          foundAnswer
            ? foundAnswer.answer
            : 'Спасибо за вопрос! Я передам его нашим специалистам. А пока предлагаю посмотреть раздел "Частые вопросы" или связаться с нашими мастерами.'
        );
      }

      setIsListening(false);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-[#53C9CA] to-[#9ADFE0] rounded-2xl">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <Volume2 className="w-6 h-6 text-[#53C9CA]" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Грум-бот голосовой помощник</h3>
          <p className="text-white/90 text-sm">Надиктуйте свой вопрос, и ИИ сразу даст ответ</p>
        </div>
      </div>

      <motion.button
        onClick={handleVoiceInput}
        disabled={isProcessing}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 ${
          isListening
            ? 'bg-red-500 text-white animate-pulse'
            : isProcessing
            ? 'bg-white/80 text-[#53C9CA]'
            : 'bg-white text-[#53C9CA] hover:bg-white/90'
        }`}
      >
        {isProcessing ? (
          <>
            <Loader className="w-6 h-6 animate-spin" />
            <span>Обрабатываю вопрос...</span>
          </>
        ) : isListening ? (
          <>
            <MicOff className="w-6 h-6" />
            <span>Нажмите, чтобы остановить</span>
          </>
        ) : (
          <>
            <Mic className="w-6 h-6" />
            <span>Нажмите, чтобы задать вопрос голосом</span>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-4 bg-white rounded-xl"
          >
            <p className="text-gray-800 font-medium mb-2">Ответ:</p>
            <p className="text-gray-600">{answer}</p>
            <a
              href="/services"
              className="text-[#53C9CA] font-bold text-sm mt-3 inline-block hover:underline"
            >
              Подробнее →
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center text-white/80 text-sm"
        >
          🎤 Слушаю ваш вопрос...
        </motion.div>
      )}
    </div>
  );
}
