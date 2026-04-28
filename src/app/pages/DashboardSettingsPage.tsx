import { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/app/context/AuthContext';
import { useEntity } from '@/app/hooks';

export function DashboardSettingsPage() {
  const { user } = useAuth();
  const { update, updating } = useEntity<any>('users', { fetchListOnMount: false, enabled: !!user });
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const [birthDate, setBirthDate] = useState(user?.birth_date ? String(user.birth_date).slice(0, 10) : '');
  const [saved, setSaved] = useState(false);

  return (
    <div className="p-8">
      <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
        Настройки профиля
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Заполните данные клиента для персонализации сервиса.</p>

      <div className="max-w-2xl rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">Имя:</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Email:</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Телефон:</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Город:</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Дата рождения:</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-900" />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            disabled={!user || updating}
            onClick={async () => {
              if (!user) return;
              await update(user.id, {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim() || null,
                city: city.trim() || null,
                birth_date: birthDate || null,
              } as any);
              setSaved(true);
              setTimeout(() => setSaved(false), 1800);
            }}
            className="rounded-xl bg-[#53C9CA] px-5 py-3 font-semibold text-white hover:bg-[#3fb8b9] disabled:opacity-60"
          >
            Сохранить
          </button>
          {saved ? <span className="text-sm text-emerald-600">Сохранено</span> : null}
        </div>
      </div>
    </div>
  );
}

