import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Dog, Heart, Plus, Loader2, Trash2 } from 'lucide-react';
import { useEntity } from '@/app/hooks';
import { api, getUploadBaseUrl } from '@/app/api/client';

type PetRow = { id: number; name: string; breed: string | null; age: number | null; photo: string | null };

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200';

function petPhotoUrl(photo: string | null): string {
  if (!photo) return DEFAULT_AVATAR;
  if (photo.startsWith('http')) return photo;
  return getUploadBaseUrl() + photo;
}

export function DashboardPetsPage() {
  const { list: pets, loadingList, loadingListError, refetchList, create, remove, creating, createError, deleting } = useEntity<PetRow>('pets', { fetchListOnMount: true });
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
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
    const { data, error } = await create({
      name: name.trim(),
      breed: breed.trim() || null,
      age: age.trim() ? parseInt(age.trim(), 10) : null,
      photo: photoUrl,
    });
    if (error) {
      alert(error);
      return;
    }
    if (data) {
      setName('');
      setBreed('');
      setAge('');
      setPhotoFile(null);
      setShowForm(false);
      refetchList();
    }
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
        <Loader2 className="w-10 h-10 text-[#4A90E2] animate-spin" />
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

      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Добавить питомца
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[#4A90E2]/20"
        >
          <h3 className="text-lg font-bold mb-4 text-[#4A90E2]">Новый питомец</h3>
          <form onSubmit={handleAddPet} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Имя *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#4A90E2]"
                placeholder="Кличка"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Порода</label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#4A90E2]"
                placeholder="Например: Шпиц"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Возраст (лет)</label>
              <input
                type="number"
                min="0"
                max="30"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#4A90E2]"
                placeholder="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Фото</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#4A90E2]/10 file:text-[#4A90E2]"
              />
            </div>
            {createError && <p className="text-red-500 text-sm">{createError}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating}
                className="px-6 py-2 bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] text-white rounded-xl font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Сохранить
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-xl">
                Отмена
              </button>
            </div>
          </form>
        </motion.div>
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
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
              {pet.breed || '—'} {pet.age != null ? `· ${pet.age} ${pet.age === 1 ? 'год' : pet.age < 5 ? 'года' : 'лет'}` : ''}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2 text-[#4A90E2]">
              <Heart className="w-5 h-5" />
              <span className="font-medium text-sm">Дневник питомца</span>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link
                to="/dashboard/health"
                className="px-4 py-2 bg-gradient-to-r from-[#4A90E2]/80 to-[#9EC3EF]/80 text-white rounded-xl text-sm font-medium"
              >
                Дневник
              </Link>
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
