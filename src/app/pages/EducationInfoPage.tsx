import { motion } from 'motion/react';
import { useState } from 'react';
import { ChevronDown, Building2, Users, FileText, GraduationCap, UserCheck, Wrench, DollarSign, Briefcase, Globe, Utensils } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';


export function EducationInfoPage() {
  const sections = [
    {
      id: 'basic',
      title: 'Основные сведения',
      icon: Building2,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-2">Полное наименование:</h4>
            <p>Образовательная организация "MARS GROOM Academy"</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Сокращенное наименование:</h4>
            <p>MARS GROOM Academy</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Дата создания:</h4>
            <p>2018 год</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Адрес:</h4>
            <p>г. Владимир, ул. Нижняя Дуброва, д. 7</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Контактная информация:</h4>
            <p>Телефон: +7 (999) 123-45-67</p>
            <p>Email: academy@groomroom.ru</p>
          </div>
        </div>
      ),
    },
    {
      id: 'structure',
      title: 'Структура и органы управления образовательной организацией',
      icon: Users,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-2">Руководитель:</h4>
            <p>Директор - Иванова Мария Сергеевна</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Заместитель директора по учебной работе:</h4>
            <p>Петров Иван Александрович</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Методический совет:</h4>
            <p>Состоит из ведущих преподавателей и мастеров-грумеров</p>
          </div>
        </div>
      ),
    },
    {
      id: 'documents',
      title: 'Документы',
      icon: FileText,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-2">Лицензия на образовательную деятельность:</h4>
            <p>№ ЛО-77-01-012345 от 15.03.2018</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Устав образовательной организации:</h4>
            <p>Утвержден 01.01.2018</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Правила приема:</h4>
            <p>Документ доступен по запросу</p>
          </div>
        </div>
      ),
    },
    {
      id: 'education',
      title: 'Образование',
      icon: GraduationCap,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-2">Реализуемые программы:</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>Основы груминга собак (144 часа)</li>
              <li>Профессиональный груминг (288 часов)</li>
              <li>Выставочный груминг (144 часа)</li>
              <li>Креативный груминг (72 часа)</li>
              <li>Груминг кошек (144 часа)</li>
              <li>Экспресс-линька для длинношёрстных собак (72 часа)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Форма обучения:</h4>
            <p>Очная, очно-заочная, дистанционная</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Язык обучения:</h4>
            <p>Русский</p>
          </div>
        </div>
      ),
    },
    {
      id: 'leadership',
      title: 'Руководство',
      icon: UserCheck,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-2">Директор:</h4>
            <p>Иванова Мария Сергеевна</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Образование: высшее, стаж работы 15 лет</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Заместитель директора:</h4>
            <p>Петров Иван Александрович</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Образование: высшее, стаж работы 12 лет</p>
          </div>
        </div>
      ),
    },
    {
      id: 'teachers',
      title: 'Педагогический состав',
      icon: Users,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-2">Преподаватели:</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>Смирнова Ольга Викторовна - мастер-грумер, преподаватель (стаж 12 лет)</li>
              <li>Козлов Дмитрий Игоревич - мастер-грумер, преподаватель (стаж 10 лет)</li>
              <li>Волкова Елена Петровна - мастер-грумер, преподаватель (стаж 8 лет)</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'material',
      title: 'Материально-техническое обеспечение и оснащенность образовательного процесса. Доступная среда',
      icon: Wrench,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-2">Учебные помещения:</h4>
            <p>3 учебных класса, оснащенных современным оборудованием</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Практические площадки:</h4>
            <p>2 груминг-стола, полный набор профессиональных инструментов</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Доступная среда:</h4>
            <p>Обеспечен доступ для лиц с ограниченными возможностями здоровья</p>
          </div>
        </div>
      ),
    },
    {
      id: 'scholarships',
      title: 'Стипендии и иные виды материальной поддержки',
      icon: DollarSign,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-2">Стипендии:</h4>
            <p>Образовательная организация не предоставляет стипендии</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Материальная поддержка:</h4>
            <p>Возможна рассрочка платежа, скидки для льготных категорий</p>
          </div>
        </div>
      ),
    },
    {
      id: 'paid',
      title: 'Платные образовательные услуги',
      icon: Briefcase,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-2">Порядок оказания платных услуг:</h4>
            <p>Все образовательные программы являются платными. Стоимость указана на странице курсов.</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Договор:</h4>
            <p>Заключается в письменной форме при поступлении</p>
          </div>
        </div>
      ),
    },
    {
      id: 'financial',
      title: 'Финансово хозяйственная деятельность',
      icon: DollarSign,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-2">Финансирование:</h4>
            <p>За счет средств от оказания платных образовательных услуг</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Отчетность:</h4>
            <p>Финансовая отчетность ведется в соответствии с законодательством РФ</p>
          </div>
        </div>
      ),
    },
    {
      id: 'vacancies',
      title: 'Вакантные места для приема (перевода)',
      icon: Briefcase,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-2">Текущие вакансии:</h4>
            <p>Информация о вакансиях размещается на странице "Вакансии"</p>
          </div>
        </div>
      ),
    },
    {
      id: 'international',
      title: 'Международное сотрудничество',
      icon: Globe,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-2">Международные программы:</h4>
            <p>В настоящее время международное сотрудничество не осуществляется</p>
          </div>
        </div>
      ),
    },
    {
      id: 'food',
      title: 'Организация питания в общеобразовательной организации',
      icon: Utensils,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-2">Питание:</h4>
            <p>Образовательная организация не предоставляет услуги питания</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section
        className="relative py-32 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #40AB40 0%, #89E689 100%)',
        }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-bold mb-6">Сведения об образовательной организации</h1>
            <p className="text-2xl mb-8 max-w-3xl mx-auto">
              Полная информация о нашей образовательной деятельности
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Изучите подробную информацию о структуре, документах и деятельности нашей организации
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Accordion.Root type="single" collapsible className="space-y-4">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Accordion.Item
                  key={section.id}
                  value={section.id}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="w-full px-6 py-4 text-left font-bold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6 text-[#40AB40]" />
                        <span>{section.title}</span>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="px-6 py-4">
                    {section.content}
                  </Accordion.Content>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
        </div>
      </div>
    </div>
  );
}
