import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, Heart, Check, Sparkles, UserCircle, Loader2, Scissors, User, MessageSquare, PawPrint } from 'lucide-react';
import { api, type TimeSlot } from '@/app/api/client';
import { useAuth } from '@/app/context/AuthContext';
import { useEntity } from '@/app/hooks';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { Calendar as DateCalendar } from '@/app/components/ui/calendar';
import { AppSelect } from '@/app/components/ui/AppSelect';

interface ServiceItem {
  id: number;
  name: string;
  category?: string | null;
  type?: string | null;
  breed?: string | null;
  duration?: string | null;
  duration_minutes?: number | null;
  duration_slots?: number | null;
  loyalty_points?: number | null;
  price?: number | null;
}
interface MasterItem { id: number; full_name: string }
interface CourseItem { id: number; name: string; price?: number | null; loyalty_points?: number | null }
interface CourseScheduleItem { id: number; course_id: number; start_date: string; start_time?: string | null; spots?: number | null }
interface LoyaltyRow { user_id: number; points: number }
interface UserProfile { id: number; birth_date?: string | null }

type PetItem = { id: number; name: string; animal_type?: string | null; breed?: string | null; sex?: string | null };

interface BookingFormProps {
  type: 'service' | 'course';
  serviceId?: number;
  courseId?: number;
  serviceName?: string;
  courseName?: string;
  masterId?: number;
  masterName?: string;
  servicesList?: ServiceItem[];
  mastersList?: MasterItem[];
  onSuccess?: () => void;
  onSubmitted?: () => void;
}

export function BookingForm({ type, serviceId: initialServiceId, courseId, serviceName, courseName, masterId: initialMasterId, masterName, servicesList = [], mastersList = [], onSuccess, onSubmitted }: BookingFormProps) {
  const { user } = useAuth();
  const { list: pets, loadingList: loadingPets, loadingListError: petsError } = useEntity<PetItem>('pets', { fetchListOnMount: true, enabled: !!user });
  const { list: coursesList } = useEntity<CourseItem>('courses', { fetchListOnMount: true, listParams: { limit: 200 } });
  const { list: scheduleList } = useEntity<CourseScheduleItem>('course_schedules', { fetchListOnMount: type === 'course', listParams: { limit: 300 } });
  const { list: loyaltyList } = useEntity<LoyaltyRow>('loyalty_accounts', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 50 } });
  const { list: usersList } = useEntity<UserProfile>('users', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 200 } });
  const [selectedServiceId, setSelectedServiceId] = useState<number | undefined>(initialServiceId);
  const [selectedMasterId, setSelectedMasterId] = useState<number | undefined>(initialMasterId);
  useEffect(() => {
    if (initialServiceId != null) setSelectedServiceId(initialServiceId);
    if (initialMasterId != null) setSelectedMasterId(initialMasterId);
  }, [initialServiceId, initialMasterId]);
  const serviceId = selectedServiceId ?? initialServiceId;
  const masterId = selectedMasterId ?? initialMasterId;

  const [formData, setFormData] = useState({
    petId: '' as string,
    date: '',
    phone: '',
    notes: '',
  });
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [autoServiceLocked, setAutoServiceLocked] = useState(false);
  const [selectedCourseScheduleId, setSelectedCourseScheduleId] = useState<number | null>(null);

  const fetchSlots = useCallback(
    async (date: string) => {
      if (type !== 'service' || !date) {
        setSlots([]);
        return;
      }
      setLoadingSlots(true);
      setSlotsError(null);
      setSelectedSlot(null);
      const res = await api.getSlots({
        date,
        master_id: masterId,
        service_id: serviceId,
      });
      setLoadingSlots(false);
      if ('error' in res) {
        setSlotsError(res.error || 'Не удалось загрузить слоты');
        setSlots([]);
        return;
      }
      setSlots(Array.isArray(res.data?.data) ? res.data.data : []);
    },
    [type, masterId, serviceId]
  );

  useEffect(() => {
    if (formData.date) fetchSlots(formData.date);
    else {
      setSlots([]);
      setSelectedSlot(null);
    }
  }, [formData.date, fetchSlots]);

  const selectedPet = useMemo(() => {
    const pid = formData.petId ? parseInt(formData.petId, 10) : null;
    if (!pid) return null;
    return pets.find((p) => p.id === pid) ?? null;
  }, [formData.petId, pets]);
  const requiresAdminCall = useMemo(
    () => selectedPet?.animal_type === 'dog' && !!selectedPet.breed && selectedPet.breed.toLowerCase().startsWith('другая:'),
    [selectedPet]
  );

  const selectedService = useMemo(
    () => servicesList.find((s) => s.id === serviceId),
    [servicesList, serviceId]
  );
  const selectedCourse = useMemo(() => coursesList.find((c) => c.id === courseId), [coursesList, courseId]);
  const courseSchedules = useMemo(
    () => scheduleList.filter((s) => s.course_id === courseId).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()),
    [scheduleList, courseId]
  );
  const profile = useMemo(() => usersList.find((u) => u.id === user?.id) ?? null, [usersList, user?.id]);
  const loyaltyPoints = useMemo(() => loyaltyList.find((l) => l.user_id === user?.id)?.points ?? 0, [loyaltyList, user?.id]);

  const isBirthdayWindow = useMemo(() => {
    const birth = profile?.birth_date;
    if (!birth || !user) return false;
    const b = new Date(birth);
    if (Number.isNaN(b.getTime())) return false;
    const now = new Date();
    const thisYearBirthday = new Date(now.getFullYear(), b.getMonth(), b.getDate());
    const diffDays = Math.floor((now.getTime() - thisYearBirthday.getTime()) / 86400000);
    return diffDays >= 0 && diffDays <= 7;
  }, [profile?.birth_date, user]);
  const loyaltyDiscount = loyaltyPoints >= 100 ? 15 : 0;
  const birthdayDiscount = isBirthdayWindow ? 5 : 0;
  const totalDiscountPercent = Math.max(loyaltyDiscount, birthdayDiscount);
  const basePrice = type === 'service' ? Number(selectedService?.price ?? 0) : Number(selectedCourse?.price ?? 0);
  const discountedPrice = Math.max(0, Math.round(basePrice * (1 - totalDiscountPercent / 100)));

  const serviceSlots = useMemo(() => {
    if (!selectedService) return 1;
    if (selectedService.duration_slots != null) return Math.max(1, Number(selectedService.duration_slots));
    if (selectedService.duration_minutes != null) return Math.max(1, Math.ceil(Number(selectedService.duration_minutes) / 30));
    return 1;
  }, [selectedService]);

  const selectedChain = useMemo(() => {
    if (!selectedSlot) return new Set<string>();
    const idx = slots.findIndex((s) => s.datetime === selectedSlot.datetime);
    if (idx < 0) return new Set<string>();
    const chain = new Set<string>();
    for (let i = idx; i < Math.min(idx + serviceSlots, slots.length); i++) chain.add(slots[i].datetime);
    return chain;
  }, [selectedSlot, slots, serviceSlots]);

  const availableServices = useMemo(() => {
    if (!selectedPet) return servicesList;
    const petType = selectedPet.animal_type;
    if (petType === 'dog') {
      return servicesList.filter((s) => s.category === 'dogs');
    }
    if (petType === 'cat') {
      const breed = (selectedPet.breed || '').toLowerCase();
      if (breed.includes('мейн') || breed.includes('мейкун')) {
        return servicesList.filter((s) => s.name.toLowerCase().includes('мейн-куна') || s.name.toLowerCase().includes('когтей'));
      }
      return servicesList.filter((s) => s.name.toLowerCase().includes('стрижка кошки') || s.name.toLowerCase().includes('купание кошки') || s.name.toLowerCase().includes('когтей'));
    }
    if (petType === 'rabbit') {
      return servicesList.filter((s) => s.name.toLowerCase().includes('кролик') || s.name.toLowerCase().includes('когтей'));
    }
    return servicesList;
  }, [servicesList, selectedPet, requiresAdminCall]);

  useEffect(() => {
    if (!serviceId) return;
    if (!availableServices.some((s) => s.id === serviceId)) {
      setSelectedServiceId(undefined);
    }
  }, [availableServices, serviceId]);

  useEffect(() => {
    if (!selectedPet || selectedPet.animal_type !== 'dog' || !selectedPet.breed) {
      setAutoServiceLocked(false);
      return;
    }
    // Для собак — автоматический подбор услуги по породе
    const breed = selectedPet.breed.toLowerCase();
    const byBreed = servicesList.find((s) => (s.category === 'dogs') && (s.breed?.toLowerCase().includes(breed) || s.name.toLowerCase().includes(breed)));
    if (byBreed) {
      setSelectedServiceId(byBreed.id);
      setAutoServiceLocked(true);
    } else {
      setAutoServiceLocked(false);
    }
  }, [selectedPet, servicesList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (type === 'service' && !selectedSlot) {
      if (requiresAdminCall) {
        // Для собак с нештатной породой дата/время согласовываются с администратором.
      } else {
        setSubmitError('Выберите время из доступных слотов');
        return;
      }
    }
    if (type === 'service' && requiresAdminCall && !formData.phone.trim()) {
      setSubmitError('Укажите номер телефона для согласования даты и времени с администратором');
      return;
    }
    if (type === 'service' && !requiresAdminCall && !formData.date) {
      setSubmitError('Выберите дату');
      return;
    }
    if (type === 'service' && !requiresAdminCall && !selectedSlot) {
      setSubmitError('Выберите время из доступных слотов');
      return;
    }
    if (type === 'service' && !user) {
      setSubmitError('Для записи на услугу необходимо войти в аккаунт.');
      return;
    }
    if (type === 'service' && !formData.petId) {
      setSubmitError('Выберите питомца из списка');
      return;
    }
    setIsSubmitting(true);

    try {
      if (type === 'service') {
        if (requiresAdminCall) {
          const serviceNameForCall = servicesList.find((s) => s.id === serviceId)?.name ?? 'Услуга для собаки';
          const reminder = await api.post<{ success?: boolean; data?: unknown; error?: string }>('/notifications', {
            user_id: user!.id,
            type: 'callback_request',
            title: 'Запрос на согласование записи',
            body: `Питомец: ${selectedPet?.name ?? 'Собака'} (${selectedPet?.breed ?? 'без породы'}). Услуга: ${serviceNameForCall}. Телефон: ${formData.phone.trim()}.`,
          });
          if ('error' in reminder && reminder.error) {
            setSubmitError(reminder.error);
            setIsSubmitting(false);
            return;
          }
          setIsSubmitting(false);
          setIsSubmitted(true);
          onSubmitted?.();
          if (onSuccess) setTimeout(onSuccess, 2000);
          return;
        }
        const notesWithDiscount = [
          formData.notes?.trim() || '',
          totalDiscountPercent > 0 ? `Скидка: ${totalDiscountPercent}% (итог: ${discountedPrice}₽).` : '',
          isBirthdayWindow ? 'Бонус ДР клиента активен (окно 7 дней).' : '',
          loyaltyDiscount > 0 ? 'Скидка за 100+ лапок активна.' : '',
        ].filter(Boolean).join('\n');
        const body = {
          user_id: user!.id,
          service_id: serviceId,
          master_id: masterId ?? null,
          pet_id: parseInt(formData.petId, 10),
          scheduled_at: selectedSlot!.datetime,
          status: 'pending',
          contact_method: null,
          notes: notesWithDiscount || null,
        };
        const res = await api.post<{ success?: boolean; data?: unknown; error?: string }>('/service_bookings', body);
        if ('error' in res && res.error) {
          setSubmitError(res.error);
          setIsSubmitting(false);
          return;
        }
      } else {
        if (!user) {
          setSubmitError('Для записи на курс необходимо войти в аккаунт.');
          setIsSubmitting(false);
          return;
        }
        if (!courseId) {
          setSubmitError('Не выбран курс.');
          setIsSubmitting(false);
          return;
        }
        const scheduleId = selectedCourseScheduleId ?? courseSchedules[0]?.id ?? null;
        if (!scheduleId) {
          setSubmitError('Для курса пока нет доступного расписания.');
          setIsSubmitting(false);
          return;
        }
        const notesWithDiscount = [
          formData.notes?.trim() || '',
          totalDiscountPercent > 0 ? `Скидка: ${totalDiscountPercent}% (итог: ${discountedPrice}₽).` : '',
          isBirthdayWindow ? 'Бонус ДР клиента активен (окно 7 дней).' : '',
          loyaltyDiscount > 0 ? 'Скидка за 100+ лапок активна.' : '',
        ].filter(Boolean).join('\n');
        const res = await api.post<{ success?: boolean; data?: unknown; error?: string }>('/course_bookings', {
          user_id: user.id,
          course_id: courseId,
          course_schedule_id: scheduleId,
          master_id: masterId ?? null,
          status: 'pending',
          notes: notesWithDiscount || null,
        });
        if ('error' in res && res.error) {
          setSubmitError(res.error);
          setIsSubmitting(false);
          return;
        }
      }
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSubmitted?.();
      if (onSuccess) setTimeout(onSuccess, 2000);
    } catch (err) {
      setSubmitError('Ошибка сети. Проверьте, что сервер запущен (npm run server).');
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700"
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
          <Check className="w-8 h-8 text-[#4A90E2]" />
        </div>
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Запись успешно оформлена!</h3>
        <p className="mb-6 text-gray-600 dark:text-gray-300">Мы свяжемся с вами в ближайшее время для подтверждения</p>
        <Link to="/dashboard/schedule" className="text-[#4A90E2] font-semibold hover:underline">
          Перейти в личный кабинет к моим записям
        </Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {type === 'service' && (
        <div>
          <label className="block text-sm font-medium mb-2">
            <Heart className="w-4 h-4 inline mr-2" />
            Питомец *
          </label>
          {!user ? (
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 text-sm">
              Для выбора питомца нужно войти в аккаунт (кнопка «Войти» сверху).
            </div>
          ) : loadingPets ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              Загрузка питомцев...
            </div>
          ) : petsError ? (
            <p className="text-amber-600 dark:text-amber-400 text-sm">{petsError}</p>
          ) : (
            <>
              <AppSelect
                value={formData.petId}
                onChange={(v) => setFormData({ ...formData, petId: v })}
                required
                options={[
                  { value: '', label: 'Выберите питомца', disabled: true },
                  ...pets.map((p) => ({
                    value: String(p.id),
                    label: `${p.name}${p.animal_type ? ` (${p.animal_type === 'dog' ? 'собака' : p.animal_type === 'cat' ? 'кошка' : 'кролик'})` : ''}`,
                  })),
                ]}
              />
              {selectedPet && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {selectedPet.breed ? <>Порода: <span className="font-medium">{selectedPet.breed}</span></> : null}
                  {selectedPet.sex ? <> · Пол: <span className="font-medium">{selectedPet.sex === 'м' ? 'Мужской' : 'Женский'}</span></> : null}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {type === 'service' && availableServices.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2"><Scissors className="w-4 h-4" />Услуга *</label>
          <AppSelect
            value={serviceId != null ? String(serviceId) : ''}
            onChange={(v) => setSelectedServiceId(v ? parseInt(v, 10) : undefined)}
            required
            disabled={autoServiceLocked || !formData.petId}
            options={[
              { value: '', label: '—', disabled: true },
              ...availableServices.map((s) => ({ value: String(s.id), label: s.name })),
            ]}
          />
          {autoServiceLocked && (
            <p className="mt-2 text-xs text-[#4A90E2]">Услуга автоматически выбрана по породе собаки.</p>
          )}
        </div>
      )}
      {type === 'service' && mastersList.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2"><User className="w-4 h-4" />Мастер *</label>
          <AppSelect
            value={masterId != null ? String(masterId) : ''}
            onChange={(v) => setSelectedMasterId(v ? parseInt(v, 10) : undefined)}
            disabled={!serviceId}
            options={[
              { value: '', label: 'Случайный мастер (автоназначение)' },
              ...mastersList.map((m) => ({ value: String(m.id), label: m.full_name })),
            ]}
          />
        </div>
      )}
      {type === 'course' && courseName && (
        <div className="p-4 bg-[#4A90E2]/10 dark:bg-[#4A90E2]/20 rounded-xl border border-[#4A90E2]/30">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Курс</p>
          <p className="font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#4A90E2]" />
            {courseName}
          </p>
        </div>
      )}
      {type === 'service' && servicesList.length === 0 && serviceName && (
        <div className="p-4 bg-[#4A90E2]/10 dark:bg-[#4A90E2]/20 rounded-xl border border-[#4A90E2]/30">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Услуга</p>
          <p className="font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#4A90E2]" />
            {serviceName}
          </p>
        </div>
      )}
      {masterName && !(type === 'service' && mastersList.length > 0) && (
        <div className="p-4 bg-[#4A90E2]/10 dark:bg-[#4A90E2]/20 rounded-xl border border-[#4A90E2]/30">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Мастер</p>
          <p className="font-bold flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-[#4A90E2]" />
            {masterName}
          </p>
        </div>
      )}

      {requiresAdminCall ? (
        <div className="space-y-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/40 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">Для этой породы запись согласуется с администратором по телефону.</p>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+7 (___) ___-__-__"
            className="w-full px-4 py-3 border border-blue-200 dark:border-blue-800 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            required
          />
        </div>
      ) : (
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Дата *
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={!serviceId}
                className="w-full px-4 py-3 border border-blue-200 dark:border-blue-800 rounded-xl bg-blue-50/40 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4A90E2] text-left disabled:opacity-60"
              >
                {formData.date ? new Date(formData.date).toLocaleDateString('ru-RU') : 'Выберите дату'}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <DateCalendar
                mode="single"
                selected={formData.date ? new Date(formData.date) : undefined}
                onSelect={(d) => {
                  if (!d) return;
                  const iso = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10);
                  setFormData({ ...formData, date: iso });
                }}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
        </div>
        {type === 'service' && pets.length === 0 && user && (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Нет питомцев в профиле. Добавьте питомца в разделе{' '}
            <Link to="/dashboard/pets" className="text-[#4A90E2] font-medium hover:underline">«Питомцы»</Link>.
          </div>
        )}
      </div>
      )}

      {type === 'service' && !requiresAdminCall && (
        <div>
          <label className="block text-sm font-medium mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            Время (выберите слот) *
          </label>
          {!formData.date ? (
            <p className="text-gray-500 text-sm">Сначала выберите дату</p>
          ) : loadingSlots ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              Загрузка слотов...
            </div>
          ) : slotsError ? (
            <p className="text-amber-600 dark:text-amber-400 text-sm">{slotsError}</p>
          ) : slots.length === 0 ? (
            <p className="text-gray-500 text-sm">На эту дату нет свободных слотов</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.datetime}
                  type="button"
                  onClick={() => slot.available !== false && setSelectedSlot(slot)}
                  disabled={slot.available === false}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    selectedChain.has(slot.datetime)
                      ? 'bg-[#4A90E2] text-white'
                      : slot.available === false
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 border border-gray-300 dark:border-gray-600 cursor-not-allowed'
                        : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-[#4A90E2]'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
          {selectedService && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Длительность услуги: <span className="font-medium">{selectedService.duration || `${serviceSlots * 30} мин`}</span> ({serviceSlots} слота по 30 мин).
            </p>
          )}
          {selectedService?.loyalty_points != null && selectedService.loyalty_points > 0 && (
            <p className="mt-1 text-sm text-[#4A90E2] flex items-center gap-2">
              <PawPrint className="w-4 h-4" />
              Начисление после завершения записи: +{selectedService.loyalty_points} лапок
            </p>
          )}
        </div>
      )}

      {type === 'course' && (
        <div>
          <label className="block text-sm font-medium mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            Время
          </label>
          {courseSchedules.length ? (
            <AppSelect
              value={String(selectedCourseScheduleId ?? courseSchedules[0]?.id ?? '')}
              onChange={(v) => setSelectedCourseScheduleId(v ? parseInt(v, 10) : null)}
              options={courseSchedules.map((s) => ({
                value: String(s.id),
                label: `${new Date(s.start_date).toLocaleDateString('ru-RU')}${s.start_time ? ` • ${String(s.start_time).slice(0, 5)}` : ''}${s.spots != null ? ` • мест: ${s.spots}` : ''}`,
              }))}
            />
          ) : (
            <p className="text-gray-500 text-sm">Нет доступных дат запуска курса</p>
          )}
        </div>
      )}

      {basePrice > 0 ? (
        <div className="rounded-xl border border-[#4A90E2]/25 bg-[#4A90E2]/5 p-4 text-sm">
          <p className="font-semibold mb-1">Стоимость записи</p>
          <p>Базовая цена: <span className="font-medium">{basePrice.toLocaleString('ru-RU')} ₽</span></p>
          {birthdayDiscount > 0 ? <p>Бонус на ДР клиента: <span className="font-medium">-5%</span></p> : null}
          {loyaltyDiscount > 0 ? <p>Скидка за 100+ лапок: <span className="font-medium">-15%</span></p> : null}
          <p className="mt-1 text-base font-bold">Итог: {discountedPrice.toLocaleString('ru-RU')} ₽</p>
          {birthdayDiscount === 0 && !profile?.birth_date ? (
            <p className="mt-1 text-xs text-gray-500">Чтобы получать бонус в ДР, заполните дату рождения в настройках профиля.</p>
          ) : null}
        </div>
      ) : null}

      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4" />Дополнительные пожелания</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-blue-200 dark:border-blue-800 rounded-xl bg-blue-50/40 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
          placeholder="Расскажите нам о своих пожеланиях..."
        />
      </div>

      {submitError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={
          isSubmitting ||
          (type === 'service' &&
            (!user ||
              !formData.petId ||
              (requiresAdminCall ? !formData.phone.trim() : (!formData.date || !selectedSlot)))) ||
          (type === 'course' && (!user || !courseId || courseSchedules.length === 0))
        }
        className="w-full bg-[#4A90E2] hover:bg-[#3b7dd4] text-white py-4 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Отправка...
          </>
        ) : (
          `Записаться на ${type === 'service' ? 'услугу' : 'курс'}`
        )}
      </button>

      <p className="text-sm text-gray-500 text-center">
        Нажимая кнопку, вы даёте{' '}
        <Link to="/personal-data" className="text-[#4A90E2] font-medium hover:underline">
          согласие на обработку персональных данных
        </Link>
      </p>
    </form>
  );
}
