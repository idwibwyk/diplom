import { useState } from 'react';
import { motion } from 'motion/react';
import { StickyNote, Plus, Trash2 } from 'lucide-react';

const MOCK_NOTES = [
  { id: 1, title: 'Напомнить о записи', text: 'Барсик — стрижка 27.01 в 10:00. Подтвердить с клиентом.', date: '2026-01-26' },
  { id: 2, title: 'Заказать расходники', text: 'Шампунь для длинношёрстных, ножницы запасные.', date: '2026-01-25' },
];

export function GroomerChatPage() {
  const [notes, setNotes] = useState(MOCK_NOTES);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');

  return (
    <div className="p-8 flex flex-col min-h-[calc(100vh-8rem)]">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Заметки грумера
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Личные заметки для работы и напоминаний</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {notes.map((n) => (
          <motion.div
            key={n.id}
            layout
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-[#40AB40]/20 p-4 flex flex-col"
          >
            <h3 className="font-bold text-[#40AB40] mb-2">{n.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm flex-1">{n.text}</p>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-xs text-gray-500">{n.date}</span>
              <button type="button" className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg" aria-label="Удалить">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-dashed border-[#40AB40]/40 p-4 flex flex-col items-center justify-center min-h-[140px] text-gray-500 hover:border-[#40AB40]/60 hover:bg-[#40AB40]/5 transition-colors"
        >
          <Plus className="w-8 h-8 mb-2" />
          <span className="text-sm">Добавить заметку</span>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-[#40AB40]/20 p-6 max-w-2xl">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-[#40AB40]" />
          Новая заметка
        </h3>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Заголовок"
          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 mb-3 focus:ring-2 focus:ring-[#40AB40]"
        />
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Текст заметки..."
          rows={3}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 mb-3 focus:ring-2 focus:ring-[#40AB40] resize-none"
        />
        <button type="button" className="px-6 py-2.5 bg-gradient-to-r from-[#40AB40] to-[#89E689] text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
          Сохранить заметку
        </button>
      </div>
    </div>
  );
}
