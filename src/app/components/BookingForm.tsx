import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Phone, Mail, Heart, Check, Sparkles, UserCircle } from 'lucide-react';

interface BookingFormProps {
  type: 'service' | 'course';
  serviceId?: number;
  courseId?: number;
  serviceName?: string;
  courseName?: string;
  masterId?: number;
  masterName?: string;
  onSuccess?: () => void;
}

export function BookingForm({ type, serviceId, courseId, serviceName, courseName, masterId, masterName, onSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    petName: '',
    petBreed: '',
    date: '',
    time: '',
    notes: '',
    contactMethod: 'по звонку' as string,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Симуляция отправки формы
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 2000);
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
      {(serviceName || courseName) && (
        <div className="p-4 bg-[#53C9CA]/10 dark:bg-[#53C9CA]/20 rounded-xl border border-[#53C9CA]/30">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {type === 'service' ? 'Услуга' : 'Курс'}
          </p>
          <p className="font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#53C9CA]" />
            {type === 'service' ? serviceName : courseName}
          </p>
        </div>
      )}
      {masterName && (
        <div className="p-4 bg-[#53C9CA]/10 dark:bg-[#53C9CA]/20 rounded-xl border border-[#53C9CA]/30">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Мастер</p>
          <p className="font-bold flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-[#53C9CA]" />
            {masterName}
          </p>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Name */}
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

        {/* Phone */}
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

        {/* Email */}
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

        {/* Date */}
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

        {/* Time */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            Время *
          </label>
          <select
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#53C9CA]"
            required
          >
            <option value="">Выберите время</option>
            {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(
              (time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              )
            )}
          </select>
        </div>

        {/* Способ связи — по умолчанию "по звонку" */}
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
      </div>

      {type === 'service' && (
        <>
          {/* Pet Name */}
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

          {/* Pet Breed */}
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

      {/* Notes */}
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#53C9CA] hover:bg-[#9ADFE0] text-white py-4 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Отправка...' : `Записаться на ${type === 'service' ? 'услугу' : 'курс'}`}
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

