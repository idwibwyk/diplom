import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import React from 'react';
import {
  Settings,
  Trash2,
  Calendar,
  BookOpen,
  Plus,
  Loader2,
  Pencil,
} from 'lucide-react';
import { LoyaltySystem } from '../components/LoyaltySystem';
import { PersonalRecommendations, getRecommendationsForUser } from '../components/PersonalRecommendations';
import { useFavoritesContext } from '../context/FavoritesContext';
import { FavoriteButton } from '../components/FavoriteButton';
import { useAuth } from '../context/AuthContext';
import { useEntity } from '../hooks';
import { AppSelect } from '../components/ui/AppSelect';

type PetRow = { id: number; name: string; breed: string | null; age: number | null; photo: string | null };
type ServiceRow = { id: number; name: string };
type VisitRow = { id: number; visit_date: string; notes: string | null; service_id: number; master_id: number | null };

const DEFAULT_PET_AVATAR = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200';

export function ClientDashboard() {
  const { user } = useAuth();
  const { list: petsList, loadingList: loadingPets, update: updatePet, updating: updatingPet } = useEntity<any>('pets', {
    fetchListOnMount: !!user,
    listParams: {},
  });
  const { list: servicesList } = useEntity<ServiceRow>('services', { fetchListOnMount: true, listParams: { limit: 100 } });
  const { list: bookingsList } = useEntity<{ id: number; user_id: number; service_id: number; master_id: number | null; scheduled_at: string; status: string }>('service_bookings', {
    fetchListOnMount: !!user,
    listParams: {},
  });
  const { list: loyaltyList } = useEntity<{ user_id: number; points: number }>('loyalty_accounts', {
    fetchListOnMount: !!user,
    listParams: {},
  });

  const { favorites } = useFavoritesContext();
  const favServices = servicesList.filter((s) => favorites.services.includes(s.id));
  const pets = petsList;
  const completedBookings = bookingsList.filter((b) => b.status === 'completed' || new Date(b.scheduled_at) < new Date());
  const visits = completedBookings.map((b) => ({
    id: b.id,
    date: b.scheduled_at?.slice(0, 10),
    service: servicesList.find((s) => s.id === b.service_id)?.name ?? 'Услуга',
    master: 'Мастер',
    cost: '-',
    notes: '',
  }));
  const loyaltyPoints = loyaltyList.find((l) => l.user_id === user?.id)?.points ?? (user ? 0 : 0);
  const [editingPet, setEditingPet] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editBreed, setEditBreed] = useState('');
  const [editSex, setEditSex] = useState<'м' | 'ж'>('м');
  const [editKnowsBirth, setEditKnowsBirth] = useState<'yes' | 'no'>('no');
  const [editBirthMonth, setEditBirthMonth] = useState('');
  const [editBirthYear, setEditBirthYear] = useState('');
  const [editApproxAge, setEditApproxAge] = useState('');

  const formatYears = (years: number) => {
    if (years === 1) return '1 год';
    if (years >= 2 && years <= 4) return `${years} года`;
    return `${years} лет`;
  };
  const calcAge = (month?: number | null, year?: number | null) => {
    if (!month || !year) return null;
    const now = new Date();
    let age = now.getFullYear() - year;
    const m = now.getMonth() + 1;
    if (m < month) age -= 1;
    return age < 0 ? 0 : age;
  };
  const openEditPet = (pet: any) => {
    setEditingPet(pet);
    setEditName(pet.name || '');
    setEditBreed(pet.breed || '');
    setEditSex(pet.sex === 'ж' ? 'ж' : 'м');
    setEditKnowsBirth(pet.knows_birth_date ? 'yes' : 'no');
    setEditBirthMonth(pet.birth_month ? String(pet.birth_month) : '');
    setEditBirthYear(pet.birth_year ? String(pet.birth_year) : '');
    setEditApproxAge(pet.approx_age_years != null ? String(pet.approx_age_years) : (pet.age != null ? String(pet.age) : ''));
  };

  if (user && loadingPets) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-[#53C9CA] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Обзор</h1>
          <p className="text-gray-600 dark:text-gray-300">Добро пожаловать, {user?.name ?? 'Гость'}!</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/book/service"
            className="flex items-center gap-2 px-6 py-3 btn-gradient-teal text-white rounded-xl font-medium"
          >
            <Calendar className="w-5 h-5" />
            Записаться на услугу
          </Link>
          <Link
            to="/book/course"
            className="flex items-center gap-2 px-6 py-3 btn-gradient-teal text-white rounded-xl font-medium"
          >
            <Calendar className="w-5 h-5" />
            Записаться на курс
          </Link>
          <Link
            to="/dashboard/settings"
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <Settings className="w-5 h-5" />
            Настройки
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0 space-y-8">
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Мои питомцы</h2>
              <Link
                to="/dashboard/pets"
                className="flex items-center gap-2 px-4 py-2 bg-[#53C9CA] hover:bg-[#45b5b6] text-white rounded-xl font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Добавить питомца
              </Link>
            </div>
            {pets.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <p className="text-gray-600 dark:text-gray-400 mb-4">У вас пока нет питомцев</p>
                <Link
                  to="/dashboard/pets"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#53C9CA] hover:bg-[#45b5b6] text-white rounded-xl font-medium transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Добавить питомца
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                {pets.map((pet: any) => (
                  <motion.div
                    key={pet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-gradient-to-r from-[#53C9CA]/10 to-[#9ADFE0]/10 dark:from-[#53C9CA]/20 dark:to-[#9ADFE0]/20 rounded-2xl"
                  >
                    <img
                      src={pet.photo || DEFAULT_PET_AVATAR}
                      alt={pet.name}
                      className="w-24 h-24 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{pet.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {pet.breed ?? '—'} · {pet.knows_birth_date && pet.birth_month && pet.birth_year
                          ? `Возраст: ${formatYears(calcAge(pet.birth_month, pet.birth_year) ?? 0)}`
                          : `Возраст: ~${formatYears(pet.approx_age_years ?? pet.age ?? 0)}`}
                      </p>
                      <Link
                        to="/dashboard/health"
                        className="inline-flex items-center gap-2 px-4 py-2 btn-gradient-teal text-white rounded-xl font-medium"
                      >
                        Дневник
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditPet(pet)}
                        className="inline-flex items-center gap-2 ml-2 px-4 py-2 border border-[#53C9CA]/50 text-[#53C9CA] rounded-xl font-medium hover:bg-[#53C9CA]/10"
                      >
                        <Pencil className="w-4 h-4" />
                        Изменить
                      </button>
                    </div>
                    <button type="button" className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg" aria-label="Удалить">
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </motion.div>
                ))}
                </div>
              </>
            )}
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Избранное</h2>
              <Link to="/dashboard/favorites" className="text-[#53C9CA] hover:underline text-sm font-medium">
                Всё избранное →
              </Link>
            </div>
            {favServices.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 py-4">Пока ничего не добавлено в избранное</p>
            ) : (
              <div className="space-y-4">
                {favServices.slice(0, 6).map((s) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-l-4 border-[#53C9CA] pl-6 py-4 rounded-r-xl bg-gray-50 dark:bg-gray-700/30"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Link to={`/services/${s.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-[#53C9CA]">
                        {s.name}
                      </Link>
                      <FavoriteButton type="service" id={s.id} />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">История посещений</h2>
              <Link to="/dashboard/visits" className="text-[#53C9CA] hover:underline text-sm font-medium">
                Вся история →
              </Link>
            </div>
            <div className="space-y-4">
              {visits.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 py-4">История посещений появится после завершённых записей</p>
              ) : (
                <>
                  {visits.slice(0, 5).map((visit) => (
                    <motion.div
                      key={visit.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border-l-4 border-[#53C9CA] pl-6 py-4"
                    >
                      <div className="flex flex-wrap justify-between gap-4">
                        <div>
                          <p className="font-bold text-lg">{visit.service}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Мастер: {visit.master}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#53C9CA]">{visit.cost}{visit.cost !== '-' ? '₽' : ''}</p>
                          <p className="text-sm text-gray-500">{visit.date ? new Date(visit.date).toLocaleDateString('ru-RU') : '—'}</p>
                        </div>
                      </div>
                      {visit.notes && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 italic">«{visit.notes}»</p>}
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          </section>
        </div>

        <div className="lg:w-80 flex-shrink-0 space-y-6">
          <LoyaltySystem points={loyaltyPoints} totalForDiscount={100} discountPercent={15} />
          <PersonalRecommendations
            recommendations={getRecommendationsForUser({
              userId: user?.id ?? 0,
              petBreeds: pets.map((p) => p.breed || '').filter(Boolean),
              hasFavoriteServices: favorites.services.length > 0,
              hasFavoriteCourses: favorites.courses.length > 0,
              visitsCount: visits.length,
            }).slice(0, 1)}
          />
        </div>
      </div>
      {editingPet ? (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Изменение данных питомца</h3>
            <div className="space-y-3">
              <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Имя" className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3" />
              <input value={editBreed} onChange={(e) => setEditBreed(e.target.value)} placeholder="Порода" className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3" />
              <AppSelect
                value={editSex}
                onChange={(v) => setEditSex(v as 'м' | 'ж')}
                options={[
                  { value: 'м', label: 'Мужской' },
                  { value: 'ж', label: 'Женский' },
                ]}
              />
              <AppSelect
                value={editKnowsBirth}
                onChange={(v) => setEditKnowsBirth(v as 'yes' | 'no')}
                options={[
                  { value: 'yes', label: 'Дата рождения известна' },
                  { value: 'no', label: 'Известен только примерный возраст' },
                ]}
              />
              {editKnowsBirth === 'yes' ? (
                <div className="grid grid-cols-2 gap-3">
                  <input value={editBirthMonth} onChange={(e) => setEditBirthMonth(e.target.value)} type="number" min="1" max="12" placeholder="Месяц" className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3" />
                  <input value={editBirthYear} onChange={(e) => setEditBirthYear(e.target.value)} type="number" min="2000" max="2100" placeholder="Год" className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3" />
                </div>
              ) : (
                <input value={editApproxAge} onChange={(e) => setEditApproxAge(e.target.value)} type="number" min="0" max="40" placeholder="Примерный возраст (лет)" className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3" />
              )}
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setEditingPet(null)} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700">Отмена</button>
              <button
                type="button"
                disabled={updatingPet}
                onClick={async () => {
                  await updatePet(editingPet.id, {
                    name: editName.trim(),
                    breed: editBreed.trim() || null,
                    sex: editSex,
                    knows_birth_date: editKnowsBirth === 'yes',
                    birth_month: editKnowsBirth === 'yes' ? parseInt(editBirthMonth || '0', 10) || null : null,
                    birth_year: editKnowsBirth === 'yes' ? parseInt(editBirthYear || '0', 10) || null : null,
                    approx_age_years: editKnowsBirth === 'no' ? parseInt(editApproxAge || '0', 10) || null : null,
                    age: editKnowsBirth === 'no' ? parseInt(editApproxAge || '0', 10) || null : null,
                  } as any);
                  setEditingPet(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#53C9CA] text-white font-semibold"
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
