import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram } from 'lucide-react';

const CONTACTS = (
  <div>
    <h4 className="font-bold text-lg mb-4">Контакты</h4>
    <ul className="space-y-3 text-gray-400">
      <li className="flex items-start"><MapPin className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" /><span>ул. Нижняя Дуброва 7, г. Владимир</span></li>
      <li className="flex items-center"><Phone className="w-5 h-5 mr-2 flex-shrink-0" /><a href="tel:+79950205013" className="hover:text-[#53C9CA] transition-colors">+7 (995) 020-50-13</a></li>
      <li className="flex items-center"><Mail className="w-5 h-5 mr-2 flex-shrink-0" /><a href="mailto:mars-groom@yandex.ru" className="hover:text-[#53C9CA] transition-colors">mars-groom@yandex.ru</a></li>
      <li className="text-sm">Ежедневно: 10:00 — 22:00</li>
    </ul>
    <div className="flex gap-4 mt-4">
      <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#53C9CA] transition-colors" aria-label="VK"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2z" /></svg></a>
      <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#53C9CA] transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
    </div>
  </div>
);

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">MARS GROOM</h3>
            <p className="text-gray-400">Красота и забота для ваших питомцев. Груминг и обучение.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Меню</h4>
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
          <p className="text-center text-gray-500">© 2026 MARS GROOM. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
