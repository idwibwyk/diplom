import { motion } from 'motion/react';
import { Award, Calendar, Star } from 'lucide-react';

export function CertificatesPage() {
  const certificates = [
    {
      id: 1,
      title: 'Сертификат качества услуг',
      organization: 'Российская Ассоциация Грумеров',
      date: '2023-06-10',
      description: 'Подтверждение соответствия услуг высоким стандартам качества',
    },
    {
      id: 2,
      title: 'Сертификат профессионального грумера',
      organization: 'Международная Академия Груминга',
      date: '2022-03-15',
      description: 'Подтверждение профессиональной квалификации мастеров',
    },
    {
      id: 3,
      title: 'Диплом за вклад в развитие груминга',
      organization: 'Союз Кинологов России',
      date: '2024-11-20',
      description: 'Признание заслуг в развитии индустрии груминга',
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
          <h1 className="text-5xl font-bold mb-6">Сертификаты</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Подтверждения качества и профессионализма нашей работы
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-2 border-[#53C9CA]/20 hover:border-[#53C9CA] transition-colors"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#53C9CA] to-[#9ADFE0] rounded-xl flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{cert.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{cert.organization}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{cert.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{new Date(cert.date).toLocaleDateString('ru-RU')}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
