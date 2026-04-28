import React from 'react';
import { motion } from 'motion/react';
import { Building2, FileText, BookOpen, ExternalLink, Users, GraduationCap, Wallet, Briefcase, Globe, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  { id: 'main', title: 'Основные сведения', icon: Building2, content: 'MARS GROOM — образовательный центр по подготовке грумеров. Мы проводим курсы повышения квалификации, обучаем основам груминга и профессиональным техникам работы с различными породами собак и кошек.', extra: ['Полное наименование: MARS GROOM', 'Направление: Образовательные курсы по грумингу', 'Адрес: г. Владимир, просп. Ленина, 42'] },
  { id: 'structure', title: 'Структура и органы управления образовательной организацией', icon: Building2, content: 'Управление осуществляет руководитель организации. Образовательный процесс организуют методисты и преподаватели. Структура включает учебный отдел, отдел практики и администрацию.' },
  { id: 'documents', title: 'Документы', icon: FileText, content: 'Документы, подтверждающие право на осуществление образовательной деятельности.', links: [{ to: '/licenses', label: 'Лицензии' }, { to: '/certificates', label: 'Свидетельства' }] },
  { id: 'education', title: 'Образование', icon: BookOpen, content: 'Реализуемые программы: базовый курс груминга собак, профессиональный груминг, выставочный груминг, креативный груминг, груминг кошек, экспресс-линька для длинношёрстных собак. Форма обучения: очная, очно-заочная, с применением дистанционных технологий.' },
  { id: 'leadership', title: 'Руководство', icon: Briefcase, content: 'Руководство образовательной организацией осуществляет директор. Контактные данные для обращений: mars-groom@yandex.ru, +7 (995) 020-50-13.' },
  { id: 'teachers', title: 'Педагогический состав', icon: Users, content: 'Преподаватели — действующие мастера-грумеры с многолетним стажем и опытом участия в выставках. Информация о каждом преподавателе доступна в разделе «Мастера» на сайте.' },
  { id: 'material', title: 'Материально-техническое обеспечение и оснащённость. Доступная среда', icon: GraduationCap, content: 'Учебные классы оборудованы профессиональными столами, мойками, сушилками и полным набором инструментов. Для людей с ограниченными возможностями здоровья предусмотрена возможность согласования индивидуальных условий.' },
  { id: 'scholarships', title: 'Стипендии и иные виды материальной поддержки', icon: Wallet, content: 'Стипендии не предусмотрены. Возможны скидки при ранней оплате курса и акции, информация о которых публикуется на сайте и в сообществе VK.' },
  { id: 'paid', title: 'Платные образовательные услуги', icon: FileText, content: 'Образовательные программы реализуются на платной основе. Стоимость и условия оплаты указаны в описании каждого курса. Оплата возможна единовременно или по согласованию в рассрочку.' },
  { id: 'finance', title: 'Финансово-хозяйственная деятельность', icon: Briefcase, content: 'Образовательная организация осуществляет финансово-хозяйственную деятельность в соответствии с законодательством РФ. Отчётность формируется в установленном порядке.' },
  { id: 'vacancies', title: 'Вакантные места для приёма (перевода)', icon: Users, content: 'Информация о наборе на курсы и наличии свободных мест публикуется в разделе «Расписание» и в официальном сообществе VK. Приём осуществляется в течение года по мере формирования групп.' },
  { id: 'international', title: 'Международное сотрудничество', icon: Globe, content: 'В настоящее время международные программы не реализуются. Планируется развитие партнёрских связей с образовательными организациями в сфере груминга.' },
  { id: 'food', title: 'Организация питания', icon: Utensils, content: 'Образовательная организация не предоставляет питание обучающимся. Рядом с учебным классом расположены пункты общественного питания.' },
];

export function EducationInfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Сведения об образовательной организации
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            MARS GROOM — образовательный центр
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {SECTIONS.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:border-[#40AB40]/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#40AB40] to-[#89E689] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                      {section.content}
                    </p>
                    {section.extra && (
                      <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 text-sm">
                        {section.extra.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {section.links && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        {section.links.map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#40AB40] hover:bg-[#89E689] text-white rounded-xl font-medium transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
