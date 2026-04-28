import { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Smile,
  Frown,
  Meh,
  Laugh,
  Coffee,
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useEntity } from '@/app/hooks';
import { api, getUploadBaseUrl } from '@/app/api/client';
import { AppSelect } from '@/app/components/ui/AppSelect';

const DEFAULT_PET_AVATAR = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200';

const MOOD_OPTIONS = [
  { id: 'happy', label: 'Радостный', icon: Laugh, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
  { id: 'calm', label: 'Спокойный', icon: Meh, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
  { id: 'playful', label: 'Игривый', icon: Smile, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
  { id: 'tired', label: 'Уставший', icon: Coffee, color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
  { id: 'sad', label: 'Грустный', icon: Frown, color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' },
];

export function PetHealthCardPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [observation, setObservation] = useState('');
  const [moodNote, setMoodNote] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAnimalType, setEditAnimalType] = useState<'dog' | 'cat' | 'rabbit'>('dog');
  const [editBreed, setEditBreed] = useState('');
  const [editSex, setEditSex] = useState<'м' | 'ж'>('м');
  const [editKnowsBirth, setEditKnowsBirth] = useState<'yes' | 'no'>('no');
  const [editBirthMonth, setEditBirthMonth] = useState('');
  const [editBirthYear, setEditBirthYear] = useState('');
  const [editApproxAge, setEditApproxAge] = useState('');
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);

  const MONTHS_RU = [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь',
  ];

  type PetRow = {
    id: number;
    name: string;
    breed: string | null;
    photo: string | null;
    animal_type?: string | null;
    sex?: string | null;
    birth_month?: number | null;
    birth_year?: number | null;
    knows_birth_date?: boolean | null;
    approx_age_years?: number | null;
    age?: number | null;
  };
  type ObsRow = { id: number; pet_id: number; text: string; type: string; observation_date: string; created_at: string };
  type MoodRow = { id: number; pet_id: number; mood: string; note: string | null; entry_date: string; created_at: string };
  type HealthRow = { id: number; pet_id: number; entry_date: string; health_status: string; note: string | null; created_at: string };

  const { list: pets, update: updatePet } = useEntity<PetRow>('pets', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 200 } });
  const currentPetId = selectedPetId ?? pets?.[0]?.id ?? null;
  const currentPet = useMemo(() => (currentPetId ? pets.find((p) => p.id === currentPetId) || null : null), [pets, currentPetId]);

  const today = new Date().toISOString().slice(0, 10);

  const { list: observations, create: createObs, remove: removeObs } = useEntity<ObsRow>('pet_observations', {
    fetchListOnMount: !!user && !!currentPetId,
    enabled: !!user && !!currentPetId,
    listParams: { limit: 200, pet_id: currentPetId ?? undefined },
  });
  const { list: moodEntries, create: createMood, remove: removeMood } = useEntity<MoodRow>('pet_mood_entries', {
    fetchListOnMount: !!user && !!currentPetId,
    enabled: !!user && !!currentPetId,
    listParams: { limit: 200, pet_id: currentPetId ?? undefined },
  });
  const { list: healthEntries, create: createHealth, update: updateHealth } = useEntity<HealthRow>('pet_health_entries', {
    fetchListOnMount: !!user && !!currentPetId,
    enabled: !!user && !!currentPetId,
    listParams: { limit: 60, pet_id: currentPetId ?? undefined },
  });

  const todayHealth = healthEntries.find((h) => h.entry_date === today) || null;
  const [healthStatus, setHealthStatus] = useState<string>('Отлично');
  const [healthNote, setHealthNote] = useState<string>('');

  useEffect(() => {
    if (!todayHealth) return;
    setHealthStatus(todayHealth.health_status);
    setHealthNote(todayHealth.note ?? '');
  }, [todayHealth?.id]);

  useEffect(() => {
    const fromUrl = searchParams.get('petId');
    if (!fromUrl) return;
    const num = parseInt(fromUrl, 10);
    if (!Number.isNaN(num)) setSelectedPetId(num);
  }, [searchParams]);

  const petPhotoUrl = (photo: string | null) => {
    if (!photo) return DEFAULT_PET_AVATAR;
    if (photo.startsWith('http')) return photo;
    return getUploadBaseUrl() + photo;
  };

  const careTips = useMemo(() => {
    if (!currentPet) return { nextVisit: 'Рекомендуем записаться через 6 недель', attention: 'Следите за регулярным расчёсом и чистотой ушей.' };
    const breed = String(currentPet.breed || '').toLowerCase();
    const type = currentPet.animal_type || 'dog';
    if (type === 'cat') return { nextVisit: 'Рекомендуем записаться через 8–10 недель', attention: 'Следите за колтунами за ушами и в подмышках.' };
    if (breed.includes('шпиц')) return { nextVisit: 'Рекомендуем записаться через 6 недель', attention: 'Обратите внимание на область за ушами — там чаще всего появляются колтуны.' };
    if (breed.includes('пудел')) return { nextVisit: 'Рекомендуем записаться через 5–7 недель', attention: 'Следите за чистотой лап и мордочки, кудри быстро собирают грязь.' };
    return { nextVisit: 'Рекомендуем записаться через 6–8 недель', attention: 'Проверяйте уши и когти раз в 1–2 недели дома.' };
  }, [currentPet]);

  const formatYears = (years: number) => {
    if (years === 1) return '1 год';
    if (years >= 2 && years <= 4) return `${years} года`;
    return `${years} лет`;
  };

  const calculateAgeFromBirth = (month?: number | null, year?: number | null) => {
    if (!month || !year) return null;
    const now = new Date();
    let age = now.getFullYear() - year;
    const m = now.getMonth() + 1;
    if (m < month) age -= 1;
    return age < 0 ? 0 : age;
  };

  const handleAddObservation = async () => {
    if (!user || !currentPetId || !observation.trim()) return;
    await createObs({ user_id: user.id, pet_id: currentPetId, type: 'note', text: observation.trim(), observation_date: today } as any);
    setObservation('');
  };

  const handleAddMoodEntry = async () => {
    if (!user || !currentPetId || !selectedMood) return;
    const moodLabel = MOOD_OPTIONS.find((m) => m.id === selectedMood)?.label ?? selectedMood;
    await createMood({ user_id: user.id, pet_id: currentPetId, mood: moodLabel, note: moodNote.trim() || null, entry_date: today } as any);
    setSelectedMood(null);
    setMoodNote('');
  };

  const handleSaveHealthToday = async () => {
    if (!user || !currentPetId) return;
    const payload = { user_id: user.id, pet_id: currentPetId, entry_date: today, health_status: healthStatus, note: healthNote.trim() || null } as any;
    if (todayHealth) await updateHealth(todayHealth.id, payload);
    else await createHealth(payload);
  };

  const openEditPet = () => {
    if (!currentPet) return;
    setEditName(currentPet.name || '');
    setEditAnimalType((currentPet.animal_type === 'cat' ? 'cat' : currentPet.animal_type === 'rabbit' ? 'rabbit' : 'dog') as any);
    setEditBreed(currentPet.breed || '');
    setEditSex(currentPet.sex === 'ж' ? 'ж' : 'м');
    setEditKnowsBirth(currentPet.knows_birth_date ? 'yes' : 'no');
    setEditBirthMonth(currentPet.birth_month ? String(currentPet.birth_month) : '');
    setEditBirthYear(currentPet.birth_year ? String(currentPet.birth_year) : '');
    setEditApproxAge(currentPet.approx_age_years != null ? String(currentPet.approx_age_years) : (currentPet.age != null ? String(currentPet.age) : ''));
    setEditPhotoFile(null);
    setEditOpen(true);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Дневник питомца</h1>
      </div>

      {currentPet ? (
        <section className="mb-8 overflow-hidden rounded-3xl border border-[#53C9CA]/30 bg-gradient-to-br from-[#53C9CA]/20 via-[#9ADFE0]/20 to-white p-6 shadow-xl dark:to-gray-900">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <img src={petPhotoUrl(currentPet.photo)} alt={currentPet.name} className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg" />
            <div className="grid flex-1 gap-2 font-sans text-[1.03rem] font-medium tracking-[0.01em] leading-relaxed text-gray-900 dark:text-white sm:grid-cols-2">
              <p>
                <span className="font-semibold">Кличка:</span>{' '}
                <span className="font-semibold text-gray-600 dark:text-gray-300">{currentPet.name}</span>
              </p>
              <p>
                <span className="font-semibold">Порода:</span>{' '}
                <span className="font-semibold text-gray-600 dark:text-gray-300">{currentPet.breed || '—'}</span>
              </p>
              <p>
                <span className="font-semibold">Тип:</span>{' '}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {currentPet.animal_type === 'cat' ? 'Кошка' : currentPet.animal_type === 'rabbit' ? 'Кролик' : 'Собака'}
                </span>
              </p>
              <p>
                <span className="font-semibold">Возраст:</span>{' '}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {currentPet.knows_birth_date && currentPet.birth_month && currentPet.birth_year
                    ? formatYears(calculateAgeFromBirth(currentPet.birth_month, currentPet.birth_year) ?? 0)
                    : `~${formatYears(currentPet.approx_age_years ?? currentPet.age ?? 0)}`}
                </span>
              </p>
            </div>
            <button type="button" onClick={openEditPet} className="inline-flex h-fit rounded-xl border border-[#53C9CA] bg-white px-4 py-2 text-sm font-semibold text-[#2a9fa0] hover:bg-[#53C9CA]/10">
              Изменить
            </button>
          </div>
        </section>
      ) : null}

      <div className="grid items-start gap-6 xl:grid-cols-2">
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg xl:order-3">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                Мои наблюдения
              </h2>
              <div className="space-y-4 mb-6 max-h-[420px] overflow-y-auto pr-1">
                {observations.map((obs) => (
                  <div
                    key={obs.id}
                    className="p-4 rounded-xl border border-[#53C9CA]/15 bg-gradient-to-r from-[#53C9CA]/8 to-transparent"
                  >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {new Date(obs.observation_date || obs.created_at).toLocaleDateString('ru-RU')}
                        </span>
                      <button type="button" onClick={() => removeObs(obs.id)} className="text-gray-400 hover:text-red-500">
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

            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg xl:order-1">
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
                placeholder="Комментарий (не обязательно)…"
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#53C9CA] mb-3"
              />
              <button
                type="button"
                onClick={handleAddMoodEntry}
                disabled={!selectedMood}
                className="flex items-center gap-2 px-6 py-3 btn-gradient-teal disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold"
              >
                <Plus className="w-5 h-5" />
                Добавить запись
              </button>
              {moodEntries.length > 0 && (
                <div className="mt-6 space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {moodEntries.map((e) => (
                    <div key={e.id} className="p-4 bg-[#53C9CA]/10 dark:bg-[#53C9CA]/20 rounded-xl">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">{new Date(e.entry_date).toLocaleDateString('ru-RU')}</p>
                      <p className="font-medium text-[#53C9CA]">{e.mood}</p>
                          {e.note ? <p className="text-gray-700 dark:text-gray-300">{e.note}</p> : null}
                        </div>
                        <button type="button" onClick={() => removeMood(e.id)} className="text-gray-500 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          <div className="bg-gradient-to-br from-[#53C9CA] to-[#9ADFE0] rounded-2xl p-6 text-white shadow-xl xl:order-4">
            <h3 className="text-xl font-bold mb-4">Состояние здоровья (сегодня)</h3>
            <div className="space-y-3">
              <AppSelect
                value={healthStatus}
                onChange={setHealthStatus}
                triggerClassName="w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-800 outline-none ring-1 ring-white/25 focus:ring-2 focus:ring-white/40"
                options={[
                  { value: 'Отлично', label: 'Отлично' },
                  { value: 'Хорошо', label: 'Хорошо' },
                  { value: 'Требует внимания', label: 'Требует внимания' },
                ]}
              />
              <textarea
                value={healthNote}
                onChange={(e) => setHealthNote(e.target.value)}
                rows={3}
                placeholder="Заметка (необязательно)"
                className="w-full rounded-xl bg-white/15 px-4 py-3 text-sm text-white placeholder:text-white/70 outline-none ring-1 ring-white/20"
              />
              <button
                type="button"
                onClick={handleSaveHealthToday}
                className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-[#2b7f80] hover:bg-white/90 transition-colors"
              >
                Сохранить
              </button>
              <p className="text-xs text-white/85">
                {todayHealth ? `Сохранено: ${new Date(todayHealth.created_at).toLocaleString('ru-RU')}` : 'Заполните состояние сегодня — оно сохранится в БД.'}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg xl:order-2">
              <h3 className="font-bold mb-4">Рекомендации</h3>
              <div className="space-y-3">
                <div className="p-3 bg-[#53C9CA]/10 rounded-xl">
                  <p className="text-sm font-medium mb-1">Следующий визит</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{careTips.nextVisit}</p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <p className="text-sm font-medium mb-1 text-amber-700 dark:text-amber-400">Обратите внимание</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{careTips.attention}</p>
              </div>
            </div>
          </div>
      </div>
      {editOpen && currentPet ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
            <h3 className="text-lg font-bold mb-3">Редактирование профиля питомца</h3>
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Имя *</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-900" placeholder="Кличка" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Тип животного *</label>
                <AppSelect
                  value={editAnimalType}
                  onChange={(v) => setEditAnimalType(v as any)}
                  options={[
                    { value: 'dog', label: 'Собака' },
                    { value: 'cat', label: 'Кошка' },
                    { value: 'rabbit', label: 'Кролик' },
                  ]}
                />
              </div>
              {editAnimalType !== 'rabbit' ? (
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Порода *</label>
                  <input value={editBreed} onChange={(e) => setEditBreed(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-900" placeholder="Порода" />
                </div>
              ) : null}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Пол *</label>
                <AppSelect
                  value={editSex}
                  onChange={(v) => setEditSex(v as 'м' | 'ж')}
                  options={[
                    { value: 'м', label: 'Мужской' },
                    { value: 'ж', label: 'Женский' },
                  ]}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Вы знаете, когда родился питомец? *</label>
                <AppSelect
                  value={editKnowsBirth}
                  onChange={(v) => setEditKnowsBirth(v as 'yes' | 'no')}
                  options={[
                    { value: 'yes', label: 'Да' },
                    { value: 'no', label: 'Нет' },
                  ]}
                />
              </div>
              {editKnowsBirth === 'yes' ? (
                <div className="grid grid-cols-2 gap-3">
                  <AppSelect
                    value={editBirthMonth}
                    onChange={setEditBirthMonth}
                    options={[
                      { value: '', label: 'Месяц', disabled: true },
                      ...MONTHS_RU.map((m, i) => ({ value: String(i + 1), label: m })),
                    ]}
                  />
                  <AppSelect
                    value={editBirthYear}
                    onChange={setEditBirthYear}
                    options={[
                      { value: '', label: 'Год', disabled: true },
                      ...Array.from({ length: 25 }).map((_, i) => {
                        const y = new Date().getFullYear() - i;
                        return { value: String(y), label: String(y) };
                      }),
                    ]}
                  />
                </div>
              ) : (
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Примерный возраст (лет)</label>
                  <input value={editApproxAge} onChange={(e) => setEditApproxAge(e.target.value)} type="number" min={0} max={40} className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-900" />
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Фото</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(e) => setEditPhotoFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:rounded-xl file:border-0 file:bg-[#53C9CA]/10 file:px-4 file:py-2 file:text-[#2b9fa0]"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setEditOpen(false)} className="rounded-xl border border-gray-300 px-4 py-2 dark:border-gray-700">Отмена</button>
              <button
                type="button"
                onClick={async () => {
                  let photoUrl: string | null = currentPet.photo ?? null;
                  if (editPhotoFile) {
                    const formData = new FormData();
                    formData.append('photo', editPhotoFile);
                    const uploaded = await api.uploadPetPhoto(formData);
                    if (uploaded.data?.url) photoUrl = uploaded.data.url;
                  }
                  await updatePet(currentPet.id, {
                    name: editName.trim(),
                    animal_type: editAnimalType,
                    breed: editAnimalType === 'rabbit' ? null : (editBreed.trim() || null),
                    sex: editSex,
                    knows_birth_date: editKnowsBirth === 'yes',
                    birth_month: editKnowsBirth === 'yes' ? (parseInt(editBirthMonth || '0', 10) || null) : null,
                    birth_year: editKnowsBirth === 'yes' ? (parseInt(editBirthYear || '0', 10) || null) : null,
                    approx_age_years: editKnowsBirth === 'no' ? (parseInt(editApproxAge || '0', 10) || null) : null,
                    age: editKnowsBirth === 'no' ? (parseInt(editApproxAge || '0', 10) || null) : null,
                    photo: photoUrl,
                  } as any);
                  setEditOpen(false);
                }}
                className="rounded-xl bg-[#53C9CA] px-4 py-2 font-semibold text-white"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
