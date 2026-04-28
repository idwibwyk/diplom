import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Header } from '@/app/components/Header';
import { ServicesHeader } from '@/app/components/ServicesHeader';
import { CoursesHeader } from '@/app/components/CoursesHeader';
import { Footer } from '@/app/components/Footer';
import { ServicesFooter } from '@/app/components/ServicesFooter';
import { CoursesFooter } from '@/app/components/CoursesFooter';
import { ChatBot } from '@/app/components/ChatBot';
import { LandingPage } from '@/app/pages/LandingPage';
import { ServicesMainPage } from '@/app/pages/ServicesMainPage';
import { ServicesListPage } from '@/app/pages/ServicesListPage';
import { ServicesPage } from '@/app/pages/ServicesPage';
import { CoursesMainPage } from '@/app/pages/CoursesMainPage';
import { CoursesPage } from '@/app/pages/CoursesPage';
import { CourseTestPage } from '@/app/pages/CourseTestPage';
import { ServiceDetailPage } from '@/app/pages/ServiceDetailPage';
import { ClientDashboard } from '@/app/pages/ClientDashboard';
import { ClientDashboardCourses } from '@/app/pages/ClientDashboardCourses';
import { PetHealthCardPage } from '@/app/pages/PetHealthCardPage';
import { KnowledgeLibraryPage } from '@/app/pages/KnowledgeLibraryPage';
import { CourseDetailPage } from '@/app/pages/CourseDetailPage';
import { ServicesBlogPage } from '@/app/pages/ServicesBlogPage';
import { CoursesBlogPage } from '@/app/pages/CoursesBlogPage';
import { BlogArticlePage } from '@/app/pages/BlogArticlePage';
import { CourseSchedulePage } from '@/app/pages/CourseSchedulePage';
import { EducationInfoPage } from '@/app/pages/EducationInfoPage';
import { LicensesPage } from '@/app/pages/LicensesPage';
import { CertificatesPage } from '@/app/pages/CertificatesPage';
import { PrivacyPolicyPage } from '@/app/pages/PrivacyPolicyPage';
import { PersonalDataConsentPage } from '@/app/pages/PersonalDataConsentPage';
import { ServiceBookingPage } from '@/app/pages/ServiceBookingPage';
import { CourseBookingPage } from '@/app/pages/CourseBookingPage';
import { LibraryArticlePage } from '@/app/pages/LibraryArticlePage';
import { SheltersGroomingPage } from '@/app/pages/SheltersGroomingPage';
import { MasterDetailPage } from '@/app/pages/MasterDetailPage';
import { ZoneRentalPage } from '@/app/pages/ZoneRentalPage';
import { GroomerBoardPage } from '@/app/pages/GroomerBoardPage';
import { AdminApplicationsPage } from '@/app/pages/AdminApplicationsPage';
import { AdminBoardPage } from '@/app/pages/AdminBoardPage';
import { GroomerDashboardMain } from '@/app/pages/GroomerDashboardMain';
import { AdminDashboardMain } from '@/app/pages/AdminDashboardMain';
import { GroomerBookingsPage } from '@/app/pages/GroomerBookingsPage';
import { GroomerTeachingPage } from '@/app/pages/GroomerTeachingPage';
import { GroomerTeachingCoursePage } from '@/app/pages/GroomerTeachingCoursePage';
import { GroomerTeachingStudentChatPage } from '@/app/pages/GroomerTeachingStudentChatPage';
import { GroomerTeachingHomeworkPage } from '@/app/pages/GroomerTeachingHomeworkPage';
import { GroomerPortfolioPage } from '@/app/pages/GroomerPortfolioPage';
import { GroomerReviewsPage } from '@/app/pages/GroomerReviewsPage';
import { GroomerChatPage } from '@/app/pages/GroomerChatPage';
import { GroomerStatsPage } from '@/app/pages/GroomerStatsPage';
import { AdminServicesAddPage } from '@/app/pages/AdminServicesAddPage';
import { AdminCoursesAddPage } from '@/app/pages/AdminCoursesAddPage';
import { AdminServiceBookingsPage } from '@/app/pages/AdminServiceBookingsPage';
import { AdminCourseBookingsPage } from '@/app/pages/AdminCourseBookingsPage';
import { AdminReportsPage } from '@/app/pages/AdminReportsPage';
import { AdminStaffPage } from '@/app/pages/AdminStaffPage';
import { AdminSmsPage } from '@/app/pages/AdminSmsPage';
import { AdminClientsPage } from '@/app/pages/AdminClientsPage';
import { AdminWarehousePage } from '@/app/pages/AdminWarehousePage';
import { AdminFinancePage } from '@/app/pages/AdminFinancePage';
import { AdminStatsPage } from '@/app/pages/AdminStatsPage';
<<<<<<< Updated upstream
import { AdminModerationPage } from '@/app/pages/AdminModerationPage';
import { AdminServicesBlogEditorPage } from '@/app/pages/AdminServicesBlogEditorPage';
=======
import { StaffWorkChatsPage } from '@/app/pages/StaffWorkChatsPage';
>>>>>>> Stashed changes
import { DashboardGroomerLayout } from '@/app/layouts/DashboardGroomerLayout';
import { DashboardAdminLayout } from '@/app/layouts/DashboardAdminLayout';
import { ClientDashboardLayout } from '@/app/layouts/ClientDashboardLayout';
import { DashboardFavoritesPage } from '@/app/pages/DashboardFavoritesPage';
import { DashboardVisitsPage } from '@/app/pages/DashboardVisitsPage';
import { DashboardSchedulePage } from '@/app/pages/DashboardSchedulePage';
import { DashboardNotificationsPage } from '@/app/pages/DashboardNotificationsPage';
import { DashboardReviewsPage } from '@/app/pages/DashboardReviewsPage';
import { DashboardPetsPage } from '@/app/pages/DashboardPetsPage';
<<<<<<< Updated upstream
import { DashboardSettingsPage } from '@/app/pages/DashboardSettingsPage';
=======
import { DashboardMyCoursesPage } from '@/app/pages/DashboardMyCoursesPage';
import { DashboardCourseQuizPage } from '@/app/pages/DashboardCourseQuizPage';
import { DashboardMyCourseMaterialPage } from '@/app/pages/DashboardMyCourseMaterialPage';
import { DashboardMyCourseHomeworkPage } from '@/app/pages/DashboardMyCourseHomeworkPage';
import { DashboardMyCourseSchedulePage } from '@/app/pages/DashboardMyCourseSchedulePage';
import { DashboardMyCourseNewsPage } from '@/app/pages/DashboardMyCourseNewsPage';
import { DashboardMyCourseProgressPage } from '@/app/pages/DashboardMyCourseProgressPage';
import { DashboardMyCourseInstructorChatPage } from '@/app/pages/DashboardMyCourseInstructorChatPage';
>>>>>>> Stashed changes
import { NotFoundPage } from '@/app/pages/NotFoundPage';
import { FavoritesProvider } from '@/app/context/FavoritesContext';
import { AuthProvider } from '@/app/context/AuthContext';
import { ThemeProvider as RouteThemeProvider } from '@/app/context/ThemeContext';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const path = location.pathname;
  const isServicesPage = path.startsWith('/services');
  const isCoursesPage = path.startsWith('/courses');
  const isBookingService = path.startsWith('/book/service');
  const isBookingCourse = path.startsWith('/book/course');
  const isDashboardCourses = path.startsWith('/dashboard-courses');
  const isStaffDashboard = path.startsWith('/dashboard-admin') || path.startsWith('/dashboard-groomer');

  const useServicesLayout = isServicesPage || isBookingService;
  const useCoursesLayout = isCoursesPage || isBookingCourse || isDashboardCourses || path.startsWith('/library');
  const useMainLayout = path === '/';

  const CurrentHeader = isStaffDashboard
    ? Header
    : useMainLayout
    ? Header
    : useServicesLayout
    ? ServicesHeader
    : useCoursesLayout
    ? CoursesHeader
    : Header;
  const CurrentFooter = useMainLayout ? Footer : useServicesLayout ? ServicesFooter : useCoursesLayout ? CoursesFooter : Footer;

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <CurrentHeader />
      <main className="flex-grow">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/services" element={<ServicesMainPage />} />
            <Route path="/services/list" element={<ServicesListPage />} />
            <Route path="/services/blog" element={<ServicesBlogPage />} />
            <Route path="/services/blog/:id" element={<BlogArticlePage />} />
            <Route path="/services/shelters" element={<SheltersGroomingPage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            <Route path="/masters/:id" element={<MasterDetailPage />} />
            <Route path="/courses" element={<CoursesMainPage />} />
            <Route path="/courses/list" element={<CoursesPage />} />
            <Route path="/courses/test" element={<CourseTestPage />} />
            <Route path="/courses/schedule" element={<CourseSchedulePage />} />
            <Route path="/courses/blog" element={<CoursesBlogPage />} />
            <Route path="/courses/blog/:id" element={<BlogArticlePage />} />
            <Route path="/courses/zone-rental" element={<ZoneRentalPage />} />
            <Route path="/courses/education" element={<EducationInfoPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/courses/library" element={<KnowledgeLibraryPage />} />
            <Route path="/courses/library/:id" element={<LibraryArticlePage />} />
            <Route path="/library" element={<KnowledgeLibraryPage />} />
            <Route path="/library/:id" element={<LibraryArticlePage />} />
            <Route path="/dashboard" element={<ClientDashboardLayout />}>
              <Route index element={<ClientDashboard />} />
              <Route path="health" element={<PetHealthCardPage />} />
              <Route path="favorites" element={<DashboardFavoritesPage />} />
              <Route path="visits" element={<DashboardVisitsPage />} />
              <Route path="schedule" element={<DashboardSchedulePage />} />
              <Route path="notifications" element={<DashboardNotificationsPage />} />
              <Route path="reviews" element={<DashboardReviewsPage />} />
              <Route path="pets" element={<DashboardPetsPage />} />
<<<<<<< Updated upstream
              <Route path="settings" element={<DashboardSettingsPage />} />
=======
              <Route path="my-courses" element={<DashboardMyCoursesPage />} />
              <Route path="my-courses/quiz/:courseId/:testIndex" element={<DashboardCourseQuizPage />} />
              <Route path="my-courses/material/:contentId" element={<DashboardMyCourseMaterialPage />} />
              <Route path="my-courses/homework" element={<DashboardMyCourseHomeworkPage />} />
              <Route path="my-courses/schedule" element={<DashboardMyCourseSchedulePage />} />
              <Route path="my-courses/news" element={<DashboardMyCourseNewsPage />} />
              <Route path="my-courses/progress" element={<DashboardMyCourseProgressPage />} />
              <Route path="my-courses/chat" element={<DashboardMyCourseInstructorChatPage />} />
>>>>>>> Stashed changes
            </Route>
            <Route path="/dashboard-courses" element={<ClientDashboardCourses />} />
            <Route path="/licenses" element={<LicensesPage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/personal-data" element={<PersonalDataConsentPage />} />
            <Route path="/book/service" element={<ServiceBookingPage />} />
            <Route path="/book/service/:id" element={<ServiceBookingPage />} />
            <Route path="/book/course" element={<CourseBookingPage />} />
            <Route path="/book/course/:id" element={<CourseBookingPage />} />
            <Route path="/dashboard-groomer" element={<DashboardGroomerLayout />}>
              <Route index element={<GroomerDashboardMain />} />
              <Route path="board" element={<GroomerBoardPage />} />
              <Route path="bookings" element={<GroomerBookingsPage />} />
              <Route path="teaching" element={<GroomerTeachingPage />} />
              <Route path="teaching/course/:courseId" element={<GroomerTeachingCoursePage />} />
              <Route path="teaching/chat" element={<GroomerTeachingStudentChatPage />} />
              <Route path="teaching/homework" element={<GroomerTeachingHomeworkPage />} />
              <Route path="portfolio" element={<GroomerPortfolioPage />} />
              <Route path="reviews" element={<GroomerReviewsPage />} />
              <Route path="chat" element={<GroomerChatPage />} />
              <Route path="work-chats" element={<StaffWorkChatsPage />} />
              <Route path="stats" element={<GroomerStatsPage />} />
            </Route>
            <Route path="/dashboard-admin" element={<DashboardAdminLayout />}>
              <Route index element={<AdminDashboardMain />} />
              <Route path="board" element={<AdminBoardPage />} />
              <Route path="applications" element={<AdminApplicationsPage />} />
              <Route path="bookings" element={<Navigate to="/dashboard-admin/service-bookings" replace />} />
              <Route path="service-bookings" element={<AdminServiceBookingsPage />} />
              <Route path="course-bookings" element={<AdminCourseBookingsPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="staff" element={<AdminStaffPage />} />
              <Route path="sms" element={<AdminSmsPage />} />
              <Route path="clients" element={<AdminClientsPage />} />
              <Route path="warehouse" element={<AdminWarehousePage />} />
              <Route path="finance" element={<AdminFinancePage />} />
              <Route path="services-add" element={<AdminServicesAddPage />} />
              <Route path="services-blog" element={<AdminServicesBlogEditorPage />} />
              <Route path="courses-add" element={<AdminCoursesAddPage />} />
              <Route path="moderation" element={<AdminModerationPage />} />
              <Route path="stats" element={<AdminStatsPage />} />
              <Route path="work-chats" element={<StaffWorkChatsPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <CurrentFooter />
      <ChatBot />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <BrowserRouter>
        <AuthProvider>
          <FavoritesProvider>
            <RouteThemeProvider>
              <AppContent />
            </RouteThemeProvider>
          </FavoritesProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
