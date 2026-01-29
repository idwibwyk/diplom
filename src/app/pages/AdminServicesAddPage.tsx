import { PlusCircle } from 'lucide-react';

export function AdminServicesAddPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Добавление услуг</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Новые услуги в прайс (мок-страница).
      </p>
      <div className="p-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-center text-gray-500">
        <PlusCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
        Раздел в разработке
      </div>
    </div>
  );
}
