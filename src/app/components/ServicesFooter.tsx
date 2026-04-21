import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Phone, Mail, MapPin, BookOpen, ArrowRight } from 'lucide-react';

const CONTACTS = (
  <div>
    <h4 className="font-bold text-lg mb-4">Контакты</h4>
    <ul className="space-y-3 text-gray-400">
      <li className="flex items-start"><MapPin className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" /><span>ул. Нижняя Дуброва 7, г. Владимир</span></li>
      <li className="flex items-center"><Phone className="w-5 h-5 mr-2 flex-shrink-0" /><a href="tel:+79950205013" className="hover:text-[#4A90E2] transition-colors">+7 (995) 020-50-13</a></li>
      <li className="flex items-center"><Mail className="w-5 h-5 mr-2 flex-shrink-0" /><a href="mailto:mars-groom@yandex.ru" className="hover:text-[#4A90E2] transition-colors">mars-groom@yandex.ru</a></li>
      <li className="text-sm">Ежедневно: 10:00 — 22:00</li>
    </ul>
    <div className="flex gap-4 mt-4">
  <a 
    href="https://vk.com/mars.grom" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="w-10 h-10 bg-[#53C9CA] rounded-full flex items-center justify-center transition-colors" 
    aria-label="VK"
  >
    <svg 
      className="w-5 h-5 text-white" 
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M19.915 13.028c-.388-.49-.277-.708 0-1.146.005-.005 3.208-4.431 3.538-5.932l.001-.001c.164-.547 0-.949-.793-.949h-2.624c-.668 0-.976.347-1.141.731 0 0-1.336 3.198-3.226 5.271-.61.599-.89.791-1.225.791-.164 0-.419-.192-.419-.739V5.949c0-.656-.187-.949-.74-.949H9.161c-.419 0-.668.306-.668.591 0 .622.945.765 1.043 2.515v3.797c0 .832-.151.985-.486.985-.892 0-3.057-3.211-4.34-6.886-.259-.713-.512-1.001-1.185-1.001H1.101c-.749 0-.9.346-.9.731 0 .682.892 4.073 4.148 8.553C6.315 17.343 9.367 19 12.148 19c1.671 0 1.875-.368 1.875-1.001 0-2.922-.151-3.198.686-3.198.388 0 1.056.192 2.616 1.667C18.41 18.217 18.804 19 20.405 19h2.624c.748 0 1.127-.368.909-1.094-.499-1.527-3.871-4.668-4.023-4.878z" 
        fill="currentColor"
      />
    </svg>
  </a>
</div>
  </div>
);

export function ServicesFooter() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className="bg-gray-900 dark:bg-[#1e2939] text-white pt-16 pb-8 border-t-4 border-[#4A90E2]">
      <div className="container mx-auto px-4">
        <div className={`mb-12 p-6 rounded-2xl text-center ${isDark ? 'bg-[#4A90E2]/30' : 'bg-[#4A90E2]/20'}`}>
          <p className="text-xl md:text-2xl font-medium mb-4 text-gray-200">Хотите стать грумером?</p>
          <Link to="/courses" className="inline-flex items-center gap-2 btn-gradient-blue text-white px-8 py-4 rounded-full text-lg font-bold">
            Перейти к курсам MARS GROOM
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">MARS GROOM — Услуги</h3>
            <p className="text-gray-400">Груминг для питомцев. Стрижки, гигиена, уход.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Услуги</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/services" className="hover:text-[#4A90E2] transition-colors">Главная</Link></li>
              <li><Link to="/services/list" className="hover:text-[#4A90E2] transition-colors">Прайс</Link></li>
              <li><Link to="/book/service" className="hover:text-[#4A90E2] transition-colors">Записаться</Link></li>
              <li><Link to="/services/blog" className="hover:text-[#4A90E2] transition-colors">Блог</Link></li>
              <li><Link to="/services/shelters" className="hover:text-[#4A90E2] transition-colors">Для приютов</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Обучение</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/courses" className="hover:text-[#4A90E2] transition-colors">Курсы</Link></li>
              <li><Link to="/courses/list" className="hover:text-[#4A90E2] transition-colors">Каталог</Link></li>
              <li><Link to="/courses/schedule" className="hover:text-[#4A90E2] transition-colors">Расписание</Link></li>
              <li><Link to="/library" className="hover:text-[#4A90E2] transition-colors">Библиотека</Link></li>
            </ul>
          </div>
          {CONTACTS}
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <Link to="/licenses" className="hover:text-[#4A90E2] transition-colors">Лицензии</Link>
            <Link to="/certificates" className="hover:text-[#4A90E2] transition-colors">Сертификаты</Link>
            <Link to="/privacy" className="hover:text-[#4A90E2] transition-colors">Политика конфиденциальности</Link>
          </div>
          <p className="text-center text-gray-500 mt-6">© 2023–{new Date().getFullYear()} MARS GROOM. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
