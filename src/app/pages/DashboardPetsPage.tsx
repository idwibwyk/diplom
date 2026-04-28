import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Dog, Heart, Plus, Loader2, Trash2, Pencil } from 'lucide-react';
import { useEntity } from '@/app/hooks';
import { api, getUploadBaseUrl } from '@/app/api/client';
import { useAuth } from '@/app/context/AuthContext';
import { AppSelect } from '@/app/components/ui/AppSelect';

type PetRow = { id: number; name: string; animal_type?: string | null; breed: string | null; sex?: string | null; age: number | null; photo: string | null; knows_birth_date?: boolean | null; birth_month?: number | null; birth_year?: number | null; approx_age_years?: number | null };
type ServiceRow = { id: number; name: string; category: string; breed: string | null };

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200';
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

function formatYears(years: number): string {
  if (years === 1) return '1 год';
  if (years >= 2 && years <= 4) return `${years} года`;
  return `${years} лет`;
}

function calcAgeFromBirth(month?: number | null, year?: number | null): number | null {
  if (!month || !year) return null;
  const now = new Date();
  let age = now.getFullYear() - year;
  if (now.getMonth() + 1 < month) age -= 1;
  return age < 0 ? 0 : age;
}

function petPhotoUrl(photo: string | null): string {
  if (!photo) return DEFAULT_AVATAR;
  if (photo.startsWith('http')) return photo;
  return getUploadBaseUrl() + photo;
}

export function DashboardPetsPage() {
  const { user, logout } = useAuth();
  const { list: pets, loadingList, loadingListError, refetchList, create, update, remove, creating, createError, updating, updateError, deleting } = useEntity<PetRow>('pets', { fetchListOnMount: true });
  const { list: services } = useEntity<ServiceRow>('services', { fetchListOnMount: true, listParams: { limit: 200 } });
  const [showForm, setShowForm] = useState(false);
  const [editingPetId, setEditingPetId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [animalType, setAnimalType] = useState<'dog' | 'cat' | 'rabbit'>('dog');
  const [breed, setBreed] = useState('');
  const [customDogBreed, setCustomDogBreed] = useState('');
  const [sex, setSex] = useState<'м' | 'ж'>('м');
  const [knowsBirthDate, setKnowsBirthDate] = useState<'yes' | 'no'>('no');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [approxAge, setApproxAge] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const dogBreeds = useMemo(() => {
    const set = new Set<string>();
    for (const s of services) {
      if (s.category !== 'dogs') continue;
      if (!s.name?.trim().toLowerCase().startsWith('стрижка')) continue;
      if (s.breed) set.add(String(s.breed).trim());
    }
    return Array.from(set).filter(Boolean).sort((a, b) => a.localeCompare(b, 'ru'));
  }, [services]);

  const catBreeds = ['Мейн-кун', 'Короткошерстная', 'Длинношерстная'];

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (animalType === 'dog' && breed === '__other__' && !/^[А-Яа-яA-Za-z0-9\-\s]{2,60}$/.test(customDogBreed.trim())) {
      alert('Укажите корректное название породы (2-60 символов).');
      return;
    }
    let photoUrl: string | null = null;
    if (photoFile) {
      const formData = new FormData();
      formData.append('photo', photoFile);
      const result = await api.uploadPetPhoto(formData);
      if (result.error) {
        alert(result.error);
        return;
      }
      if (result.data?.url) photoUrl = result.data.url;
    }
    const payload = {
      user_id: user?.id ?? null,
      name: name.trim(),
      animal_type: animalType,
      breed:
        animalType === 'rabbit'
          ? null
          : animalType === 'dog' && breed === '__other__'
            ? `Другая: ${customDogBreed.trim()}`
            : (breed.trim() || null),
      sex,
      age: knowsBirthDate === 'no' ? (approxAge.trim() ? parseInt(approxAge.trim(), 10) : null) : null,
      knows_birth_date: knowsBirthDate === 'yes',
      birth_month: knowsBirthDate === 'yes' ? parseInt(birthMonth, 10) : null,
      birth_year: knowsBirthDate === 'yes' ? parseInt(birthYear, 10) : null,
      approx_age_years: knowsBirthDate === 'no' ? (approxAge.trim() ? parseInt(approxAge.trim(), 10) : null) : null,
      ...(photoUrl ? { photo: photoUrl } : {}),
    } as any;

    const { data, error } = editingPetId != null
      ? await update(editingPetId, payload)
      : await create(payload);
    if (error) {
      if (error.includes('pets_user_id_foreign')) {
        alert('Ошибка авторизации: обновите вход в аккаунт.');
        logout();
        return;
      }
      alert(error);
      return;
    }
    if (data) {
      setName('');
      setBreed('');
      setApproxAge('');
      setCustomDogBreed('');
      setBirthMonth('');
      setBirthYear('');
      setPhotoFile(null);
      setAnimalType('dog');
      setSex('м');
      setKnowsBirthDate('no');
      setShowForm(false);
      setEditingPetId(null);
      refetchList();
    }
  };

  const openEditPet = (pet: PetRow) => {
    setEditingPetId(pet.id);
    setShowForm(true);
    setName(pet.name || '');
    setAnimalType((pet.animal_type === 'cat' ? 'cat' : pet.animal_type === 'rabbit' ? 'rabbit' : 'dog') as any);
    const isOtherDogBreed = pet.breed?.startsWith('Другая: ');
    setBreed(isOtherDogBreed ? '__other__' : (pet.breed || ''));
    setCustomDogBreed(isOtherDogBreed ? (pet.breed || '').replace(/^Другая:\s*/, '') : '');
    setSex((pet.sex === 'ж' ? 'ж' : 'м') as any);
    setKnowsBirthDate(pet.knows_birth_date ? 'yes' : 'no');
    setBirthMonth(pet.birth_month ? String(pet.birth_month) : '');
    setBirthYear(pet.birth_year ? String(pet.birth_year) : '');
    setApproxAge(pet.approx_age_years != null ? String(pet.approx_age_years) : (pet.age != null ? String(pet.age) : ''));
    setPhotoFile(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить питомца из списка?')) return;
    const { success, error } = await remove(id);
    if (error) alert(error);
    else refetchList();
  };

  if (loadingList) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-10 h-10 text-[#53C9CA] animate-spin" />
      </div>
    );
  }

  if (loadingListError) {
    return (
      <div className="p-8">
        <p className="text-amber-600 dark:text-amber-400">{loadingListError}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Питомцы
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Ваши питомцы и дневники</p>
      {!user && (
        <div className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm">
          Для добавления питомца необходимо войти в аккаунт.
        </div>
      )}

      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#53C9CA] to-[#9ADFE0] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          {editingPetId != null ? 'Редактировать питомца' : 'Добавить питомца'}
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-xl p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-[#53C9CA]/20 max-h-[90vh] overflow-y-auto"
        >
          <h3 className="text-lg font-bold mb-4 text-[#53C9CA]">{editingPetId != null ? 'Редактирование питомца' : 'Новый питомец'}</h3>
          <form onSubmit={handleAddPet} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Имя *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#53C9CA]"
                placeholder="Кличка"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Тип животного *</label>
              <AppSelect
                value={animalType}
                onChange={(v) => {
                  const next = v as 'dog' | 'cat' | 'rabbit';
                  setAnimalType(next);
                  setBreed('');
                }}
                required
                options={[
                  { value: 'dog', label: 'Собака' },
                  { value: 'cat', label: 'Кошка' },
                  { value: 'rabbit', label: 'Кролик' },
                ]}
              />
            </div>

            {animalType !== 'rabbit' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Порода *</label>
                <AppSelect
                  value={breed}
                  onChange={setBreed}
                  required
                  options={[
                    { value: '', label: 'Выберите породу', disabled: true },
                    ...(animalType === 'dog' ? dogBreeds : catBreeds).map((b) => ({ value: b, label: b })),
                    ...(animalType === 'dog' ? [{ value: '__other__', label: 'Породы моего питомца нет в списке' }] : []),
                  ]}
                />
                {animalType === 'dog' && breed === '__other__' && (
                  <input
                    type="text"
                    value={customDogBreed}
                    onChange={(e) => setCustomDogBreed(e.target.value)}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#53C9CA]"
                    placeholder="Введите породу собаки"
                    pattern="^[А-Яа-яA-Za-z0-9\\-\\s]{2,60}$"
                    title="Укажите породу от 2 до 60 символов"
                    required
                  />
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Пол *</label>
              <AppSelect
                value={sex}
                onChange={(v) => setSex(v as 'м' | 'ж')}
                required
                options={[
                  { value: 'м', label: 'Мужской' },
                  { value: 'ж', label: 'Женский' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Вы знаете, когда родился питомец? *
              </label>
              <AppSelect
                value={knowsBirthDate}
                onChange={(v) => setKnowsBirthDate(v as 'yes' | 'no')}
                required
                options={[
                  { value: 'yes', label: 'Да' },
                  { value: 'no', label: 'Нет' },
                ]}
              />
            </div>

            {knowsBirthDate === 'yes' ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Месяц *</label>
                  <AppSelect
                    value={birthMonth}
                    onChange={setBirthMonth}
                    required
                    options={[
                      { value: '', label: 'Выберите', disabled: true },
                      ...MONTHS_RU.map((monthName, i) => ({ value: String(i + 1), label: monthName })),
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Год *</label>
                  <AppSelect
                    value={birthYear}
                    onChange={setBirthYear}
                    required
                    options={[
                      { value: '', label: 'Выберите', disabled: true },
                      ...Array.from({ length: 25 }).map((_, i) => {
                        const y = new Date().getFullYear() - i;
                        return { value: String(y), label: String(y) };
                      }),
                    ]}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Примерный возраст (лет)</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={approxAge}
                  onChange={(e) => setApproxAge(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#53C9CA]"
                  placeholder="Например: 2"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Фото</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#53C9CA]/10 file:text-[#2b9fa0]"
              />
            </div>
            {createError && <p className="text-red-500 text-sm">{createError}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={(creating || updating) || !user}
                className="px-6 py-2 bg-gradient-to-r from-[#53C9CA] to-[#9ADFE0] text-white rounded-xl font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {(creating || updating) ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Сохранить
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingPetId(null); }} className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-xl">
                Отмена
              </button>
            </div>
            {updateError && <p className="text-red-500 text-sm">{updateError}</p>}
          </form>
        </motion.div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet, i) => (
          <motion.div
            key={pet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg flex flex-col"
          >
            <img
              src={petPhotoUrl(pet.photo)}
              alt={pet.name}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-center">{pet.name}</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex justify-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">Тип:</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {pet.animal_type ? (pet.animal_type === 'dog' ? 'Собака' : pet.animal_type === 'cat' ? 'Кошка' : 'Кролик') : '—'}
                </span>
              </div>
              <div className="flex justify-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">Порода:</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">{pet.breed || '—'}</span>
              </div>
              <div className="flex justify-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">Пол:</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {pet.sex ? (pet.sex === 'м' ? 'Мужской' : pet.sex === 'ж' ? 'Женский' : String(pet.sex)) : '—'}
                </span>
              </div>
              <div className="flex justify-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">Возраст:</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {pet.knows_birth_date && pet.birth_month && pet.birth_year
                    ? formatYears(calcAgeFromBirth(pet.birth_month, pet.birth_year) ?? 0)
                    : (pet.approx_age_years != null ? `~${formatYears(pet.approx_age_years)}` : '—')}
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link
                to="/dashboard/health"
                className="px-4 py-2 bg-gradient-to-r from-[#53C9CA]/80 to-[#9ADFE0]/80 text-white rounded-xl text-sm font-medium"
              >
                Дневник
              </Link>
              <button
                type="button"
                onClick={() => openEditPet(pet)}
                className="px-4 py-2 border border-[#53C9CA]/40 text-[#2fa7a8] dark:text-[#9ADFE0] rounded-xl text-sm hover:bg-[#53C9CA]/10 dark:hover:bg-[#53C9CA]/15 flex items-center gap-1"
              >
                <Pencil className="w-4 h-4" /> Изменить
              </button>
              <button
                type="button"
                onClick={() => handleDelete(pet.id)}
                disabled={deleting}
                className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl text-sm hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Удалить
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {pets.length === 0 && !showForm && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Пока нет питомцев. Нажмите «Добавить питомца», чтобы добавить.
        </p>
      )}
    </div>
  );
}
