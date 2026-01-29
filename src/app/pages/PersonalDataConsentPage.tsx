import { motion } from 'motion/react';
import { FileCheck, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PersonalDataConsentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#53C9CA] to-[#9ADFE0] rounded-full flex items-center justify-center mx-auto mb-6">
            <FileCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6">Согласие на обработку персональных данных</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            MARS GROOM • Актуальная версия: 1 января 2026 г.
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
              <Shield className="w-6 h-6 text-[#53C9CA] flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Где используются ваши данные</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Персональные данные обрабатываются при:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-6">
                  <li>Записи на услуги груминга (имя, телефон, email, данные о питомце)</li>
                  <li>Записи на образовательные курсы</li>
                  <li>Отправке обратной связи через форму на сайте</li>
                  <li>Работе личного кабинета и дневника питомца</li>
                </ul>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-4">Цели обработки</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Мы используем персональные данные исключительно для организации записи, связи с вами, 
              улучшения качества услуг и информирования (при вашем согласии).
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Данные не передаются третьим лицам, за исключением случаев, предусмотренных законодательством РФ.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-4">Ваши права</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Вы имеете право на доступ, исправление и удаление своих персональных данных. 
              Обращайтесь: mars-groom@yandex.ru, +7 (995) 020-50-13.
            </p>
          </motion.section>

          <div className="text-center">
            <Link
              to="/privacy"
              className="inline-flex items-center gap-2 text-[#53C9CA] font-bold hover:underline"
            >
              Полная политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
