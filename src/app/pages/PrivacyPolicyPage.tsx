import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText, Phone } from 'lucide-react';

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          
          <h1 className="text-5xl font-bold mb-6">Политика конфиденциальности</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Последнее обновление: 1 января 2026 г.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
          >
            <div className="flex items-start gap-4 mb-4">
              <FileText className="w-6 h-6 text-[#53C9CA] flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Общие положения</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных 
                  пользователей веб-сайта MARS GROOM (далее — Сайт). Используя Сайт, вы соглашаетесь с условиями 
                  настоящей Политики конфиденциальности.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
          >
            <div className="flex items-start gap-4 mb-4">
              <Eye className="w-6 h-6 text-[#53C9CA] flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">2. Собираемые данные</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Мы собираем следующие виды персональных данных:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-6">
                  <li>Имя и контактная информация (телефон, email)</li>
                  <li>Информация о питомцах</li>
                  <li>История посещений и заказов</li>
                  <li>Технические данные (IP-адрес, тип браузера)</li>
                </ul>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
          >
            <div className="flex items-start gap-4 mb-4">
              <Lock className="w-6 h-6 text-[#53C9CA] flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">3. Использование данных</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Персональные данные используются для:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-6">
                  <li>Обработки заказов и записи на услуги</li>
                  <li>Связи с клиентами</li>
                  <li>Улучшения качества услуг</li>
                  <li>Отправки информационных материалов (с вашего согласия)</li>
                </ul>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
          >
            <div className="flex items-start gap-4 mb-4">
              <Shield className="w-6 h-6 text-[#53C9CA] flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">4. Защита данных</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Мы принимаем необходимые меры для защиты ваших персональных данных от несанкционированного 
                  доступа, изменения, раскрытия или уничтожения. Все данные передаются по защищенному соединению.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
          >
            <div className="flex items-start gap-4 mb-4">
              <Phone className="w-6 h-6 text-[#53C9CA] flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">5. Контакты</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  По всем вопросам, связанным с обработкой персональных данных, обращайтесь:
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-4">
                  Email: mars-groom@yandex.ru<br />
                  Телефон: +7 (995) 020-50-13<br />
                  Адрес: г. Владимир, просп. Ленина, 42
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
