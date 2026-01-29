import { motion } from 'motion/react';
import { FileText, Award, Calendar } from 'lucide-react';

export function LicensesPage() {
  const licenses = [
    {
      id: 1,
      title: 'Лицензия на осуществление образовательной деятельности',
      number: 'ЛО-77-01-019123',
      issuedBy: 'Департамент образования г. Москвы',
      date: '2020-01-15',
      validUntil: '2025-01-15',
      file: '/documents/license-education.pdf',
    },
    {
      id: 2,
      title: 'Свидетельство о государственной регистрации',
      number: '1027746216350',
      issuedBy: 'Межрайонная ИФНС России №46 по г. Москве',
      date: '2018-03-20',
      validUntil: null,
      file: '/documents/registration.pdf',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6">Лицензии</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Документы, подтверждающие право на осуществление деятельности
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {licenses.map((license, index) => (
            <motion.div
              key={license.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#53C9CA] to-[#9ADFE0] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4">{license.title}</h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-300">
                    <p><span className="font-bold">Номер:</span> {license.number}</p>
                    <p><span className="font-bold">Выдано:</span> {license.issuedBy}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Дата выдачи: {new Date(license.date).toLocaleDateString('ru-RU')}</span>
                      </div>
                      {license.validUntil && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Действительно до: {new Date(license.validUntil).toLocaleDateString('ru-RU')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#53C9CA] hover:bg-[#9ADFE0] text-white rounded-xl font-medium transition-colors">
                  <FileText className="w-5 h-5" />
                  Скачать
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
