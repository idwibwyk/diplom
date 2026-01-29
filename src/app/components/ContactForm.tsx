import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useLocation, Link } from 'react-router-dom';
import { Send, Mail, Phone, MapPin } from 'lucide-react';

export function ContactForm() {
  const location = useLocation();
  const mapRef = useRef<HTMLDivElement>(null);

  // Определяем цвет в зависимости от страницы
  const getColorScheme = () => {
    if (location.pathname.startsWith('/services')) {
      return {
        primary: '#4A90E2',
        secondary: '#9EC3EF',
        gradient: 'from-[#4A90E2] to-[#9EC3EF]',
        ring: 'ring-[#4A90E2]',
      };
    } else if (location.pathname.startsWith('/courses') || location.pathname.startsWith('/library')) {
      return {
        primary: '#40AB40',
        secondary: '#89E689',
        gradient: 'from-[#40AB40] to-[#89E689]',
        ring: 'ring-[#40AB40]',
      };
    } else {
      return {
        primary: '#53C9CA',
        secondary: '#9ADFE0',
        gradient: 'from-[#53C9CA] to-[#9ADFE0]',
        ring: 'ring-[#53C9CA]',
      };
    }
  };

  const colors = getColorScheme();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    // Яндекс карта
    if (mapRef.current && !mapRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU';
      script.async = true;
      script.onload = () => {
        if ((window as any).ymaps) {
          (window as any).ymaps.ready(() => {
            const map = new (window as any).ymaps.Map(mapRef.current!, {
              center: [56.106309, 40.366696], // Владимир, ул. Нижняя Дуброва, д. 7
              zoom: 15,
            });
            const placemark = new (window as any).ymaps.Placemark([56.106309, 40.366696], {
              balloonContent: 'MARS GROOM<br>г. Владимир, ул. Нижняя Дуброва, д. 7',
            });
            map.geoObjects.add(placemark);
          });
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      alert('Необходимо дать согласие на обработку персональных данных.');
      return;
    }
    alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
    setFormData({ name: '', email: '', phone: '' });
    setConsent(false);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6">Остались вопросы?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Оставьте контакты — мы перезвоним и ответим на всё
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Адрес</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  г. Владимир, ул. Нижняя Дуброва, д. 7
                </p>
              </div>
            </div>

            {/* Яндекс карта */}
            <div className="w-full h-64 rounded-xl overflow-hidden shadow-lg">
              <div ref={mapRef} className="w-full h-full" />
            </div>

            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Телефон</h3>
                <p className="text-gray-600 dark:text-gray-300">+7 (995) 020-50-13</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="text-gray-600 dark:text-gray-300">mars-groom@yandex.ru</p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Имя</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:${colors.ring}`}
                  style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:${colors.ring}`}
                  style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Телефон</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:${colors.ring}`}
                  style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Даю согласие на{' '}
                  <Link to="/personal-data" className="underline font-medium hover:opacity-80">
                    обработку персональных данных
                  </Link>
                </span>
              </label>

              <button
                type="submit"
                className={`w-full bg-gradient-to-r ${colors.gradient} text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2`}
              >
                <Send className="w-5 h-5" />
                Перезвоните мне — хочу задать вопрос
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
