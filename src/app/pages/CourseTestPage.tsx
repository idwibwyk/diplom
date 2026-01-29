import { CourseTest } from '@/app/components/CourseTest';

export function CourseTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#009B00]/10 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <CourseTest />
      </div>
    </div>
  );
}
