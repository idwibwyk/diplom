import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { BookingForm } from '@/app/components/BookingForm';
import { courses as allCourses } from '@/app/data/mockData';
import { masters } from '@/app/data/mockData';

export function CourseBookingPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const masterIdParam = searchParams.get('masterId');

  const courseId = id ? parseInt(id, 10) : undefined;
  const course = courseId ? allCourses.find((c) => c.id === courseId) : undefined;
  const masterId = masterIdParam ? parseInt(masterIdParam, 10) : undefined;
  const master = masterId ? masters.find((m) => m.id === masterId) : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link
          to={course ? `/courses/${course.id}` : '/courses'}
          className="inline-flex items-center gap-2 text-[#40AB40] hover:text-[#89E689] mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {course ? 'Назад к курсу' : 'К курсам'}
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-2 border-[#40AB40]/20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-[#40AB40] rounded-xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Запись на курс</h1>
              <p className="text-gray-500 dark:text-gray-400">
                {course ? `Вы записываетесь: ${course.name}` : 'Выберите курс на сайте и вернитесь по ссылке или заполните форму'}
              </p>
            </div>
          </div>
          <BookingForm
            type="course"
            courseId={course?.id}
            courseName={course?.name}
            masterId={master?.id}
            masterName={master?.name}
            onSuccess={() => {}}
          />
        </motion.div>
      </div>
    </div>
  );
}
