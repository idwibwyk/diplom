import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Phone, Mail, MapPin, Scissors, ArrowRight } from 'lucide-react';
import React from 'react';

const CONTACTS = (
  <div>
    <h4 className="font-bold text-lg mb-4">Контакты</h4>
    <ul className="space-y-3 text-gray-400">
      <li className="flex items-start"><MapPin className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" /><span>г. Владимир, просп. Ленина, 42</span></li>
      <li className="flex items-center"><Phone className="w-5 h-5 mr-2 flex-shrink-0" /><a href="tel:+79950205013" className="hover:text-[#40AB40] transition-colors">+7 (995) 020-50-13</a></li>
      <li className="flex items-center"><Mail className="w-5 h-5 mr-2 flex-shrink-0" /><a href="mailto:mars-groom@yandex.ru" className="hover:text-[#40AB40] transition-colors">mars-groom@yandex.ru</a></li>
      <li className="text-sm">Ежедневно: 10:00 — 22:00</li>
    </ul>
    <div className="mt-4">
      <a
        href="https://vk.com/mars.grom"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#40AB40] hover:underline font-medium"
      >
        Сообщество в VK
      </a>
    </div>
  </div>
);

export function CoursesFooter() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className="bg-gray-900 dark:bg-[#1e2939] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">MARS GROOM — Курсы</h3>
            <p className="text-gray-400">Обучение грумеров. Базовые и продвинутые курсы.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">MARS GROOM — Курсы</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/courses" className="hover:text-[#40AB40] transition-colors">Главная</Link></li>
              <li><Link to="/courses/list" className="hover:text-[#40AB40] transition-colors">Каталог</Link></li>
              <li><Link to="/courses/schedule" className="hover:text-[#40AB40] transition-colors">Расписание</Link></li>
              <li><Link to="/book/course" className="hover:text-[#40AB40] transition-colors">Записаться на курс</Link></li>
              <li><Link to="/library" className="hover:text-[#40AB40] transition-colors">Библиотека</Link></li>
              <li><Link to="/licenses" className="hover:text-[#40AB40] transition-colors">Сведения об организации</Link></li>
              <li><Link to="/courses/zone-rental" className="hover:text-[#40AB40] transition-colors">Аренда зоны</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">MARS GROOM — Услуги</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/services" className="hover:text-[#40AB40] transition-colors">Главная</Link></li>
              <li><Link to="/services/list" className="hover:text-[#4A90E2] transition-colors">Прайс-лист</Link></li>
              <li><Link to="/book/service" className="hover:text-[#40AB40] transition-colors">Записаться на услугу</Link></li>
              <li><Link to="/services/blog" className="hover:text-[#40AB40] transition-colors">Блог</Link></li>
              <li><Link to="/services/shelters" className="hover:text-[#40AB40] transition-colors">Приюты</Link></li>
            </ul>
          </div>
          {CONTACTS}
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <Link to="/licenses" className="hover:text-[#40AB40] transition-colors">Лицензии</Link>
            <Link to="/certificates" className="hover:text-[#40AB40] transition-colors">Сертификаты</Link>
            <Link to="/privacy" className="hover:text-[#40AB40] transition-colors">Политика конфиденциальности</Link>
          </div>
          <p className="text-center text-gray-500 mt-6">© 2023–{new Date().getFullYear()} MARS GROOM. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
