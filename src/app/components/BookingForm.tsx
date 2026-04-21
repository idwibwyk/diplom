import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Phone, Mail, Heart, Check, Sparkles, UserCircle, Loader2 } from 'lucide-react';
import { api, type TimeSlot } from '@/app/api/client';
import { useAuth } from '@/app/context/AuthContext';

interface ServiceItem { id: number; name: string }
interface MasterItem { id: number; full_name: string }

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
}

export function BookingForm({ type, serviceId: initialServiceId, courseId, serviceName, courseName, masterId: initialMasterId, masterName, servicesList = [], mastersList = [], onSuccess }: BookingFormProps) {
  const { user } = useAuth();
  const [selectedServiceId, setSelectedServiceId] = useState<number | undefined>(initialServiceId);
  const [selectedMasterId, setSelectedMasterId] = useState<number | undefined>(initialMasterId);
  useEffect(() => {
    if (initialServiceId != null) setSelectedServiceId(initialServiceId);
    if (initialMasterId != null) setSelectedMasterId(initialMasterId);
  }, [initialServiceId, initialMasterId]);
  const serviceId = selectedServiceId ?? initialServiceId;
  const masterId = selectedMasterId ?? initialMasterId;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    petName: '',
    petBreed: '',
    date: '',
    notes: '',
    contactMethod: 'по звонку' as string,
  });
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (type === 'service' && !selectedSlot) {
      setSubmitError('Выберите время из доступных слотов');
      return;
    }
    setIsSubmitting(true);

    try {
      if (type === 'service') {
        if (user) {
          const body = {
            user_id: user.id,
            service_id: serviceId,
            master_id: masterId ?? null,
            pet_id: null,
            scheduled_at: selectedSlot!.datetime,
            status: 'pending',
            contact_method: formData.contactMethod,
            notes: formData.notes || null,
          };
          const res = await api.post<{ success?: boolean; data?: unknown; error?: string }>('/service_bookings', body);
          if ('error' in res && res.error) {
            setSubmitError(res.error);
            setIsSubmitting(false);
            return;
          }
        } else {
          const body = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            source: 'booking',
            status: 'new',
            scheduled_at: selectedSlot!.datetime,
            service_id: serviceId ?? null,
          };
          const res = await api.post<{ success?: boolean; error?: string }>('/leads', body);
          if ('error' in res && res.error) {
            setSubmitError(res.error);
            setIsSubmitting(false);
            return;
          }
        }
      } else {
        // Курс: пока оставляем как лид с контактами (без слотов)
        const body = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          source: 'course_booking',
          status: 'new',
        };
        const res = await api.post<{ success?: boolean; error?: string }>('/leads', body);
        if ('error' in res && res.error) {
          setSubmitError(res.error);
          setIsSubmitting(false);
          return;
        }
      }
      setIsSubmitting(false);
      setIsSubmitted(true);
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
        className="bg-gradient-to-br from-[#06D6A0] to-[#53C9CA] rounded-2xl p-8 text-center text-white"
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
          <Check className="w-8 h-8 text-[#06D6A0]" />
        </div>
        <h3 className="text-2xl font-bold mb-4">Запись успешно оформлена!</h3>
        <p className="mb-6">Мы свяжемся с вами в ближайшее время для подтверждения</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {type === 'service' && servicesList.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Услуга *</label>
          <select
            value={serviceId ?? ''}
            onChange={(e) => setSelectedServiceId(e.target.value ? parseInt(e.target.value, 10) : undefined)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#53C9CA]"
            required
          >
            <option value="">Выберите услугу</option>
            {servicesList.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}
      {type === 'service' && mastersList.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Мастер (по желанию)</label>
          <select
            value={masterId ?? ''}
            onChange={(e) => setSelectedMasterId(e.target.value ? parseInt(e.target.value, 10) : undefined)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#53C9CA]"
          >
            <option value="">Любой мастер</option>
            {mastersList.map((m) => (
              <option key={m.id} value={m.id}>{m.full_name}</option>
            ))}
          </select>
        </div>
      )}
      {type === 'course' && courseName && (
        <div className="p-4 bg-[#53C9CA]/10 dark:bg-[#53C9CA]/20 rounded-xl border border-[#53C9CA]/30">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Курс</p>
          <p className="font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#53C9CA]" />
            {courseName}
          </p>
        </div>
      )}
      {type === 'service' && servicesList.length === 0 && serviceName && (
        <div className="p-4 bg-[#53C9CA]/10 dark:bg-[#53C9CA]/20 rounded-xl border border-[#53C9CA]/30">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Услуга</p>
          <p className="font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#53C9CA]" />
            {serviceName}
          </p>
        </div>
      )}
      {masterName && !(type === 'service' && mastersList.length > 0) && (
        <div className="p-4 bg-[#53C9CA]/10 dark:bg-[#53C9CA]/20 rounded-xl border border-[#53C9CA]/30">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Мастер</p>
          <p className="font-bold flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-[#53C9CA]" />
            {masterName}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Ваше имя *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#53C9CA]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Телефон *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#53C9CA]"
            placeholder="+7 (999) 123-45-67"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#53C9CA]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Дата *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#53C9CA]"
            required
          />
        </div>
      </div>

      {type === 'service' && (
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
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    selectedSlot?.datetime === slot.datetime
                      ? 'bg-[#53C9CA] text-white'
                      : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-[#53C9CA]'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {type === 'course' && (
        <div>
          <label className="block text-sm font-medium mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            Время
          </label>
          <p className="text-gray-500 text-sm">Дата и время курса уточняются при подтверждении записи</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">
          <Phone className="w-4 h-4 inline mr-2" />
          Способ связи
        </label>
        <select
          value={formData.contactMethod}
          onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#53C9CA]"
        >
          <option value="по звонку">По звонку</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Telegram">Telegram</option>
          <option value="Email">Email</option>
        </select>
      </div>

      {type === 'service' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">
              <Heart className="w-4 h-4 inline mr-2" />
              Имя питомца *
            </label>
            <input
              type="text"
              value={formData.petName}
              onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#53C9CA]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              <Heart className="w-4 h-4 inline mr-2" />
              Порода питомца *
            </label>
            <input
              type="text"
              value={formData.petBreed}
              onChange={(e) => setFormData({ ...formData, petBreed: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#53C9CA]"
              placeholder="Например: Шпиц, Пудель"
              required
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Дополнительные пожелания</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#53C9CA]"
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
        disabled={isSubmitting || (type === 'service' && !selectedSlot && !!formData.date)}
        className="w-full bg-[#53C9CA] hover:bg-[#9ADFE0] text-white py-4 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        <Link to="/personal-data" className="text-[#53C9CA] font-medium hover:underline">
          согласие на обработку персональных данных
        </Link>
      </p>
    </form>
  );
}
