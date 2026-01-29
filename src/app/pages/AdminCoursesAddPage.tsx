import { BookOpen } from 'lucide-react';

export function AdminCoursesAddPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Добавление курсов</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Новые курсы обучения (мок-страница).
      </p>
      <div className="p-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-center text-gray-500">
        <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
        Раздел в разработке
      </div>
    </div>
  );
}
