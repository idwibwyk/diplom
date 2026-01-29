import { useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Send } from 'lucide-react';

const MOCK_MESSAGES = [
  { id: 1, from: 'admin', text: 'Здравствуйте! Напоминаем о записи завтра в 10:00.', date: '2026-01-26T09:00:00' },
  { id: 2, from: 'me', text: 'Спасибо, буду.', date: '2026-01-26T09:15:00' },
];

export function GroomerChatPage() {
  const [input, setInput] = useState('');

  return (
    <div className="p-8 flex flex-col h-[calc(100vh-8rem)]">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Чат с администратором
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Общение с администрацией салона</p>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col overflow-hidden border-2 border-[#40AB40]/20">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {MOCK_MESSAGES.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  m.from === 'me' ? 'bg-[#40AB40] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                <p>{m.text}</p>
                <p className={`text-xs mt-1 ${m.from === 'me' ? 'text-white/80' : 'text-gray-500'}`}>
                  {new Date(m.date).toLocaleString('ru-RU')}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите сообщение..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#40AB40] focus:border-transparent"
          />
          <button
            type="button"
            className="p-3 btn-gradient-green text-white rounded-xl"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
