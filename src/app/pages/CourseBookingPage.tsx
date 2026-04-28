import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import { BookingForm } from '@/app/components/BookingForm';
<<<<<<< Updated upstream
import { useEntity } from '@/app/hooks';

type Course = { id: number; name: string };
type Master = { id: number; full_name: string };
=======
import { AuthModal } from '@/app/components/AuthModal';
import { courses as allCourses } from '@/app/data/mockData';
import { masters } from '@/app/data/mockData';
import { useEntity } from '@/app/hooks';
import { useAuth } from '@/app/context/AuthContext';
import { useState } from 'react';
>>>>>>> Stashed changes

export function CourseBookingPage() {
  const navigate = useNavigate();
  const { user, login, register } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const masterIdParam = searchParams.get('masterId');
  const { list: courses, loadingList: loadingCourses } = useEntity<Course>('courses', { fetchListOnMount: true, listParams: { limit: 200 } });
  const { list: masters, loadingList: loadingMasters } = useEntity<Master>('masters', { fetchListOnMount: true, listParams: { limit: 200 } });

  const courseId = id ? parseInt(id, 10) : undefined;
<<<<<<< Updated upstream
  const course = courseId ? courses.find((c) => c.id === courseId) : undefined;
=======
  const { item: apiCourse } = useEntity<{ id: number; name: string }>('courses', {
    fetchListOnMount: false,
    id: courseId ?? null,
    fetchItemOnMount: !!courseId,
    enabled: !!courseId,
  });
  const { list: coursesList } = useEntity<{ id: number; name: string; loyalty_points?: number | null }>('courses', {
    fetchListOnMount: true,
    listParams: { limit: 100 },
  });
  const { list: schedulesList } = useEntity<{ id: number; course_id: number; start_date: string; start_time: string | null; spots: number }>('course_schedules', {
    fetchListOnMount: true,
    listParams: { limit: 200 },
  });
  const course = apiCourse ?? (courseId ? allCourses.find((c) => c.id === courseId) : undefined);
>>>>>>> Stashed changes
  const masterId = masterIdParam ? parseInt(masterIdParam, 10) : undefined;
  const master = masterId ? masters.find((m) => m.id === masterId) : undefined;
  const handleLogin = async (email: string, password: string) => {
    const res = await login(email, password);
    if (res.ok) setIsAuthOpen(false);
    if (res.ok && res.role === 'admin') navigate('/dashboard-admin');
    if (res.ok && res.role === 'groomer') navigate('/dashboard-groomer');
    return res;
  };
  const handleRegister = async (data: { name: string; email: string; password: string; phone?: string }) => {
    const res = await register(data);
    if (res.ok) setIsAuthOpen(false);
    return res;
  };

  if (loadingCourses || loadingMasters) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-[#40AB40]" /></div>;
  }

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
<<<<<<< Updated upstream
            masterName={master?.full_name}
=======
            masterName={master?.name}
            coursesList={coursesList}
            courseSchedulesList={schedulesList}
>>>>>>> Stashed changes
            onSuccess={() => {}}
            onRequireAuth={() => setIsAuthOpen(true)}
          />
        </motion.div>
      </div>
      {!user && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
}
