import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatBot() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Здравствуйте! Я Грум-бот. Чем могу помочь?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Определяем цвет в зависимости от страницы
  const getChatColor = () => {
    if (location.pathname.startsWith('/services') || location.pathname.startsWith('/book/service')) {
      return 'from-[#4A90E2] to-[#9EC3EF]'; // Голубой для услуг
    } else if (
      location.pathname.startsWith('/courses') ||
      location.pathname.startsWith('/library') ||
      location.pathname.startsWith('/book/course')
    ) {
      return 'from-[#40AB40] to-[#89E689]'; // Зеленый для курсов
    } else {
      return 'from-[#53C9CA] to-[#9ADFE0]'; // Бирюзовый для главной
    }
  };

  const chatColor = getChatColor();

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(input);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: botResponse,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  const getBotResponse = (question: string): string => {
    const q = question.toLowerCase();
    
    if (q.includes('стоимость') || q.includes('цена')) {
      return 'Стоимость стрижки зависит от породы и размера питомца. Например:\n• Маленькая собака: от 1500₽\n• Средняя собака: от 2500₽\n• Крупная собака: от 3500₽\n• Кошка: от 1800₽\n\nХотите рассчитать точную стоимость?';
    }
    
    if (q.includes('запись') || q.includes('записаться')) {
      return 'Отлично! Для записи мне нужно:\n1. Порода питомца\n2. Желаемая услуга\n3. Удобная дата\n\nМожете написать всё сразу или по пунктам 😊';
    }
    
    if (q.includes('курс') || q.includes('обучение')) {
      return 'У нас есть несколько курсов:\n• Основы груминга собак - 35 000₽\n• Профессиональный груминг - 65 000₽\n• Креативный груминг - 28 000₽\n\nКакой курс вас интересует?';
    }
    
    if (q.includes('возраст') || q.includes('щенок')) {
      return 'Щенков можно начинать приучать к грумингу с 3-4 месяцев. Первые процедуры должны быть короткими и комфортными, чтобы питомец не испытывал стресс.';
    }
    
    return 'Спасибо за вопрос! Я передам его нашим специалистам. А пока предлагаю:\n• Посмотреть каталог услуг\n• Узнать о наших курсах\n• Связаться с мастером\n\nЧто выберете?';
  };


  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 bg-gradient-to-r ${chatColor} text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-shadow`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${chatColor} text-white p-4`}>
              <h3 className="text-lg font-bold">Грум-бот</h3>
              <p className="text-sm opacity-90">Онлайн • Отвечаю мгновенно</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? `bg-gradient-to-r ${chatColor} text-white rounded-br-none`
                        : 'bg-gray-100 dark:bg-gray-700 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Напишите ваш вопрос..."
                  className={`flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 ${
                    location.pathname.startsWith('/services') ? 'focus:ring-[#4A90E2]' :
                    location.pathname.startsWith('/courses') ||
                    location.pathname.startsWith('/library') ||
                    location.pathname.startsWith('/book/course') ? 'focus:ring-[#40AB40]' :
                    'focus:ring-[#53C9CA]'
                  }`}
                />
                <button
                  onClick={handleSend}
                  className={`bg-gradient-to-r ${chatColor} text-white p-3 rounded-xl transition-colors`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
