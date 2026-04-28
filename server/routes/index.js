/**
 * API MARS GROOM — все 44 роутера (по одному на каждую таблицу БД).
 * Порядок соответствует сущностям БД.
 */
import express from 'express';
import { optionalAuth } from '../middleware/auth.js';
import authRoutes from './auth.js';
import usersRoutes from './users.js';
import mastersRoutes from './masters.js';
import servicesRoutes from './services.js';
import coursesRoutes from './courses.js';
import courseSchedulesRoutes from './course_schedules.js';
import masterServicesRoutes from './master_services.js';
import courseInstructorsRoutes from './course_instructors.js';
import petsRoutes from './pets.js';
import serviceBookingsRoutes from './service_bookings.js';
import courseBookingsRoutes from './course_bookings.js';
import visitsRoutes from './visits.js';
import reviewsRoutes from './reviews.js';
import favoriteServicesRoutes from './favorite_services.js';
import favoriteCoursesRoutes from './favorite_courses.js';
import loyaltyAccountsRoutes from './loyalty_accounts.js';
import petMoodEntriesRoutes from './pet_mood_entries.js';
import petObservationsRoutes from './pet_observations.js';
import petHealthEntriesRoutes from './pet_health_entries.js';
import shelterApplicationsRoutes from './shelter_applications.js';
import zoneRentalApplicationsRoutes from './zone_rental_applications.js';
import leadsRoutes from './leads.js';
import leadCallTasksRoutes from './lead_call_tasks.js';
import blogPostsRoutes from './blog_posts.js';
import faqItemsRoutes from './faq_items.js';
import libraryArticlesRoutes from './library_articles.js';
import notificationsRoutes from './notifications.js';
import masterSchedulesRoutes from './master_schedules.js';
import galleryItemsRoutes from './gallery_items.js';
import documentsRoutes from './documents.js';
import contactsRoutes from './contacts.js';
import courseQuizQuestionsRoutes from './course_quiz_questions.js';
import courseQuizOptionsRoutes from './course_quiz_options.js';
import courseQuizAnswersRoutes from './course_quiz_answers.js';
import educationOrgInfoRoutes from './education_org_info.js';
import courseModulesRoutes from './course_modules.js';
import courseContentRoutes from './course_content.js';
import userCourseProgressRoutes from './user_course_progress.js';
import groomerPortfolioRoutes from './groomer_portfolio.js';
import uploadRoutes from './upload.js';
import messagesRoutes from './messages.js';
import smsCampaignsRoutes from './sms_campaigns.js';
import smsRecipientsRoutes from './sms_recipients.js';
import warehouseItemsRoutes from './warehouse_items.js';
import warehouseTransactionsRoutes from './warehouse_transactions.js';
import financialTransactionsRoutes from './financial_transactions.js';
import reportsRoutes from './reports.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    name: 'MARS GROOM API',
    version: '1.0',
    docs: 'GET /api/health — проверка работы',
    endpoints: [
      'auth', 'users', 'masters', 'services', 'courses', 'course_schedules', 'master_services', 'course_instructors',
      'pets', 'service_bookings', 'course_bookings', 'visits', 'reviews', 'favorite_services', 'favorite_courses',
      'loyalty_accounts', 'pet_mood_entries', 'pet_observations', 'shelter_applications', 'zone_rental_applications',
      'leads', 'lead_call_tasks', 'blog_posts', 'faq_items', 'library_articles', 'notifications', 'master_schedules',
      'gallery_items', 'documents', 'contacts', 'course_quiz_questions', 'course_quiz_options', 'course_quiz_answers',
      'education_org_info', 'course_modules', 'course_content', 'user_course_progress', 'groomer_portfolio',
      'messages', 'sms_campaigns', 'sms_recipients', 'warehouse_items', 'warehouse_transactions',
      'financial_transactions', 'reports',
    ].map((name) => `/api/${name}`),
  });
});

router.use('/auth', authRoutes);
router.use(optionalAuth);

router.use('/users', usersRoutes);
router.use('/masters', mastersRoutes);
router.use('/services', servicesRoutes);
router.use('/courses', coursesRoutes);
router.use('/course_schedules', courseSchedulesRoutes);
router.use('/master_services', masterServicesRoutes);
router.use('/course_instructors', courseInstructorsRoutes);
router.use('/pets', petsRoutes);
router.use('/service_bookings', serviceBookingsRoutes);
router.use('/course_bookings', courseBookingsRoutes);
router.use('/visits', visitsRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/favorite_services', favoriteServicesRoutes);
router.use('/favorite_courses', favoriteCoursesRoutes);
router.use('/loyalty_accounts', loyaltyAccountsRoutes);
router.use('/pet_mood_entries', petMoodEntriesRoutes);
router.use('/pet_observations', petObservationsRoutes);
router.use('/pet_health_entries', petHealthEntriesRoutes);
router.use('/shelter_applications', shelterApplicationsRoutes);
router.use('/zone_rental_applications', zoneRentalApplicationsRoutes);
router.use('/leads', leadsRoutes);
router.use('/lead_call_tasks', leadCallTasksRoutes);
router.use('/blog_posts', blogPostsRoutes);
router.use('/faq_items', faqItemsRoutes);
router.use('/library_articles', libraryArticlesRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/master_schedules', masterSchedulesRoutes);
router.use('/gallery_items', galleryItemsRoutes);
router.use('/documents', documentsRoutes);
router.use('/contacts', contactsRoutes);
router.use('/course_quiz_questions', courseQuizQuestionsRoutes);
router.use('/course_quiz_options', courseQuizOptionsRoutes);
router.use('/course_quiz_answers', courseQuizAnswersRoutes);
router.use('/education_org_info', educationOrgInfoRoutes);
router.use('/course_modules', courseModulesRoutes);
router.use('/course_content', courseContentRoutes);
router.use('/user_course_progress', userCourseProgressRoutes);
router.use('/groomer_portfolio', groomerPortfolioRoutes);
router.use('/upload', uploadRoutes);
router.use('/messages', messagesRoutes);
router.use('/sms_campaigns', smsCampaignsRoutes);
router.use('/sms_recipients', smsRecipientsRoutes);
router.use('/warehouse_items', warehouseItemsRoutes);
router.use('/warehouse_transactions', warehouseTransactionsRoutes);
router.use('/financial_transactions', financialTransactionsRoutes);
router.use('/reports', reportsRoutes);

export default router;
