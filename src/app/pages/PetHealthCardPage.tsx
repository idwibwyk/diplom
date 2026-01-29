import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Calendar,
  FileText,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Smile,
  Frown,
  Meh,
  Laugh,
  Coffee,
} from 'lucide-react';

const DEFAULT_PET_AVATAR = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200';

const MOOD_OPTIONS = [
  { id: 'happy', label: 'Радостный', icon: Laugh, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
  { id: 'calm', label: 'Спокойный', icon: Meh, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
  { id: 'playful', label: 'Игривый', icon: Smile, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
  { id: 'tired', label: 'Уставший', icon: Coffee, color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
  { id: 'sad', label: 'Грустный', icon: Frown, color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' },
];

export function PetHealthCardPage() {
  const [observation, setObservation] = useState('');
  const [moodNote, setMoodNote] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodEntries, setMoodEntries] = useState<{ mood: string; note: string; date: string }[]>([]);

  const pets = [
    { id: 1, name: 'Барсик', breed: 'Шпиц', age: 3, photo: 'https://images.unsplash.com/photo-1728448644193-34eb04460c95?w=400' },
  ];
  const currentPet = pets[0];

  const visits = [
    {
      id: 1,
      date: '2026-01-10',
      service: 'Комплексная стрижка',
      master: 'Анна Петрова',
      notes: 'Всё прошло отлично, питомец чувствует себя хорошо',
      recommendations: 'Повторный визит через 6 недель',
      weight: '4.2 кг',
      healthStatus: 'Отлично',
    },
    {
      id: 2,
      date: '2025-12-15',
      service: 'Гигиенический уход',
      master: 'Мария Иванова',
      notes: 'Обнаружены небольшие покраснения на коже',
      recommendations: 'Использовать гипоаллергенный шампунь',
      weight: '4.3 кг',
      healthStatus: 'Хорошо',
    },
    {
      id: 3,
      date: '2025-11-20',
      service: 'СПА-уход',
      master: 'Анна Петрова',
      notes: 'Питомец был спокоен, процедура прошла успешно',
      recommendations: 'Продолжать регулярный уход',
      weight: '4.2 кг',
      healthStatus: 'Отлично',
    },
  ];

  const observations = [
    {
      id: 1,
      date: '2026-01-12',
      text: 'Заметил, что Барсик часто чешет за ухом, нужно проверить на следующем визите',
      type: 'concern',
    },
    {
      id: 2,
      date: '2026-01-08',
      text: 'Шерсть выглядит блестящей и здоровой после последней стрижки',
      type: 'positive',
    },
  ];

  const handleAddObservation = () => {
    if (!observation.trim()) return;
    alert('Наблюдение добавлено!');
    setObservation('');
  };

  const handleAddMoodEntry = () => {
    if (!selectedMood || !moodNote.trim()) return;
    const moodLabel = MOOD_OPTIONS.find((m) => m.id === selectedMood)?.label ?? selectedMood;
    setMoodEntries((prev) => [
      { mood: moodLabel, note: moodNote.trim(), date: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
    setSelectedMood(null);
    setMoodNote('');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Дневник питомца</h1>
              <p className="text-gray-600 dark:text-gray-300">
                {currentPet.name} • {currentPet.breed} • {currentPet.age} года
              </p>
        <div className="flex items-center gap-4 mt-4">
          <img src={currentPet.photo || DEFAULT_PET_AVATAR} alt={currentPet.name} className="w-16 h-16 rounded-full object-cover" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
            {/* Visit History */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-[#53C9CA]" />
                История посещений
              </h2>
              <div className="space-y-6">
                {visits.map((visit) => (
                  <motion.div
                    key={visit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-l-4 border-[#53C9CA] pl-6 py-4 bg-gradient-to-r from-[#53C9CA]/5 to-transparent rounded-r-xl"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-lg">{visit.service}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Мастер: {visit.master}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(visit.date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          visit.healthStatus === 'Отлично'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                          {visit.healthStatus}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Вес: {visit.weight}</p>
                      </div>
                    </div>
                    {visit.notes && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Заметки мастера:
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">{visit.notes}</p>
                      </div>
                    )}
                    {visit.recommendations && (
                      <div className="p-3 bg-[#53C9CA]/10 rounded-lg">
                        <p className="text-sm font-medium text-[#53C9CA] mb-1">
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          Рекомендации:
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {visit.recommendations}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>

            {/* My Observations */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#53C9CA]" />
                Мои наблюдения
              </h2>
              <div className="space-y-4 mb-6">
                {observations.map((obs) => (
                  <div
                    key={obs.id}
                    className={`p-4 rounded-xl border-l-4 ${
                      obs.type === 'concern'
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500'
                        : 'bg-green-50 dark:bg-green-900/20 border-green-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {obs.type === 'concern' ? (
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {new Date(obs.date).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <button className="text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{obs.text}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <textarea
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="Добавьте ваше наблюдение о состоянии питомца..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#53C9CA] mb-3"
                />
                <button
                  onClick={handleAddObservation}
                  className="flex items-center gap-2 px-6 py-3 btn-gradient-teal text-white rounded-xl font-bold"
                >
                  <Plus className="w-5 h-5" />
                  Добавить наблюдение
                </button>
              </div>
            </section>

            {/* Дневник настроения */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Smile className="w-6 h-6 text-[#53C9CA]" />
                Дневник настроения питомца
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {MOOD_OPTIONS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMood(selectedMood === m.id ? null : m.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${m.color} ${
                        selectedMood === m.id ? 'ring-2 ring-[#53C9CA] ring-offset-2 dark:ring-offset-gray-800' : ''
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {m.label}
                    </button>
                  );
                })}
              </div>
              <textarea
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                placeholder="Добавьте заметку о настроении питомца..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#53C9CA] mb-3"
              />
              <button
                type="button"
                onClick={handleAddMoodEntry}
                disabled={!selectedMood || !moodNote.trim()}
                className="flex items-center gap-2 px-6 py-3 btn-gradient-teal disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold"
              >
                <Plus className="w-5 h-5" />
                Добавить запись
              </button>
              {moodEntries.length > 0 && (
                <div className="mt-6 space-y-3">
                  {moodEntries.map((e, i) => (
                    <div key={i} className="p-4 bg-[#53C9CA]/10 dark:bg-[#53C9CA]/20 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">{e.date}</p>
                      <p className="font-medium text-[#53C9CA]">{e.mood}</p>
                      <p className="text-gray-700 dark:text-gray-300">{e.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
        </div>

        <div className="space-y-6">
            {/* Health Summary */}
            <div className="bg-gradient-to-br from-[#53C9CA] to-[#9ADFE0] rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-8 h-8" />
                <h3 className="text-xl font-bold">Состояние здоровья</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm opacity-90 mb-1">Общее состояние</p>
                  <p className="text-2xl font-bold">Отлично</p>
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-1">Последний визит</p>
                  <p className="text-lg font-medium">
                    {new Date(visits[0].date).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-1">Всего посещений</p>
                  <p className="text-2xl font-bold">{visits.length}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold mb-4">Быстрые действия</h3>
              <div className="space-y-3">
                <Link
                  to="/book/service"
                  className="block w-full text-center btn-gradient-teal text-white py-3 rounded-xl font-medium"
                >
                  Записаться на визит
                </Link>
                <button className="w-full border-2 border-[#53C9CA] text-[#53C9CA] hover:bg-[#53C9CA] hover:text-white py-3 rounded-xl font-medium transition-colors">
                  Загрузить документы
                </button>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold mb-4">Рекомендации</h3>
              <div className="space-y-3">
                <div className="p-3 bg-[#53C9CA]/10 rounded-xl">
                  <p className="text-sm font-medium mb-1">Следующий визит</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Рекомендуем записаться через 6 недель
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                  <p className="text-sm font-medium mb-1 text-amber-700 dark:text-amber-400">
                    Обратите внимание
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Следите за областью за ушами
                  </p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
