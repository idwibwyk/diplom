import { Link } from 'react-router-dom';
import { Home, Scissors, BookOpen } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-2">Упс!</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Страница не найдена</p>
      <p className="text-gray-500 dark:text-gray-400 mb-10 text-center max-w-md">
        Вернитесь на главную или перейдите в разделы услуг и курсов MARS GROOM.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#53C9CA] to-[#9ADFE0] hover:opacity-90 text-white rounded-xl font-bold transition-opacity"
        >
          <Home className="w-5 h-5" />
          MARS GROOM — главная
        </Link>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] hover:opacity-90 text-white rounded-xl font-bold transition-opacity"
        >
          <Scissors className="w-5 h-5" />
          MARS GROOM — услуги
        </Link>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#40AB40] to-[#89E689] hover:opacity-90 text-white rounded-xl font-bold transition-opacity"
        >
          <BookOpen className="w-5 h-5" />
          MARS GROOM — курсы
        </Link>
      </div>
    </div>
  );
}
