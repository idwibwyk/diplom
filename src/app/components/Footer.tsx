import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import React from 'react';

const CONTACTS = (
  <div>
    <h4 className="font-bold text-lg mb-4">Контакты</h4>
    <ul className="space-y-3 text-gray-400">
      <li className="flex items-start"><MapPin className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" /><span>г. Владимир, просп. Ленина, 42</span></li>
      <li className="flex items-center"><Phone className="w-5 h-5 mr-2 flex-shrink-0" /><a href="tel:+79950205013" className="hover:text-[#53C9CA] transition-colors">+7 (995) 020-50-13</a></li>
      <li className="flex items-center"><Mail className="w-5 h-5 mr-2 flex-shrink-0" /><a href="mailto:mars-groom@yandex.ru" className="hover:text-[#53C9CA] transition-colors">mars-groom@yandex.ru</a></li>
      <li className="text-sm">Ежедневно: 10:00 — 22:00</li>
    </ul>
    <div className="mt-4">
      <a
        href="https://vk.com/mars.grom"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#53C9CA] hover:underline font-medium"
      >
        Сообщество в VK
      </a>
    </div>
  </div>
);

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-[#1e2939] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">MARS GROOM</h3>
            <p className="text-gray-400">Красота и забота для ваших питомцев. Груминг и обучение.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Меню навигации</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-[#53C9CA] transition-colors">Главная</Link></li>
              <li><Link to="/services" className="hover:text-[#53C9CA] transition-colors">Услуги</Link></li>
              <li><Link to="/courses" className="hover:text-[#53C9CA] transition-colors">Курсы</Link></li>
              <li><Link to="/book/service" className="hover:text-[#53C9CA] transition-colors">Запись на услугу</Link></li>
              <li><Link to="/book/course" className="hover:text-[#53C9CA] transition-colors">Запись на курс</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Документы</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/licenses" className="hover:text-[#53C9CA] transition-colors">Лицензии</Link></li>
              <li><Link to="/certificates" className="hover:text-[#53C9CA] transition-colors">Сертификаты</Link></li>
              <li><Link to="/privacy" className="hover:text-[#53C9CA] transition-colors">Политика конфиденциальности</Link></li>
              <li><Link to="/personal-data" className="hover:text-[#53C9CA] transition-colors">Обработка ПД</Link></li>
            </ul>
          </div>
          {CONTACTS}
        </div>
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-4">
            <Link to="/licenses" className="hover:text-[#53C9CA] transition-colors">Лицензии</Link>
            <Link to="/certificates" className="hover:text-[#53C9CA] transition-colors">Сертификаты</Link>
            <Link to="/privacy" className="hover:text-[#53C9CA] transition-colors">Политика конфиденциальности</Link>
          </div>
          <p className="text-center text-gray-500">© 2023–{new Date().getFullYear()} MARS GROOM. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
