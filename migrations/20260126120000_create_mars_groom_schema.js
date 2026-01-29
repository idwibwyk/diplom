/**
 * MARS GROOM — схема БД для груминг-салона (услуги + курсы).
 *
 * Сущности проекта:
 * 1) Пользователи (users): id, email, password_hash, name, phone, role
 * 2) Мастера (masters): id, user_id, full_name, phone, experience, specialization, rating, image
 * 3) Услуги (services): id, name, category, type, price, duration, description, image, breed, price_range
 * 4) Курсы (courses): id, name, level, format, duration, price, description, image
 * 5) Расписание курсов (course_schedules): id, course_id, start_date, start_time, spots
 * 6) Связь мастер–услуга (master_services): master_id, service_id
 * 7) Связь курс–преподаватель (course_instructors): course_id, master_id
 * 8) Питомцы (pets): id, user_id, name, breed, age, photo
 * 9) Записи на услуги (service_bookings): id, user_id, service_id, master_id, pet_id, scheduled_at, status, contact_method, notes
 * 10) Записи на курсы (course_bookings): id, user_id, course_id, course_schedule_id, master_id, status, notes
 * 11) Визиты (visits): id, pet_id, service_booking_id, service_id, master_id, visit_date, notes, weight, health_status, recommendations
 * 12) Отзывы (reviews): id, user_id, service_id, course_id, master_id, rating, text, pet_name, type
 * 13) Избранные услуги (favorite_services): id, user_id, service_id
 * 14) Избранные курсы (favorite_courses): id, user_id, course_id
 * 15) Лояльность (loyalty_accounts): id, user_id, points, total_earned
 * 16) Дневник настроения (pet_mood_entries): id, pet_id, user_id, mood, note, entry_date
 * 17) Наблюдения за питомцем (pet_observations): id, pet_id, user_id, text, type, observation_date
 * 18) Заявки приютов (shelter_applications): id, org_name, inn, kpp, contact_name, phone, email, message
 * 19) Заявки на аренду зоны (zone_rental_applications): id, user_id, name, phone, email, hours, message
 * 20) Заявки/лиды (leads): id, name, email, phone, source, status
 * 21) Задачи «позвонить» (lead_call_tasks): id, lead_id, assignee_id, status, due_date
 * 22) Статьи блога (blog_posts): id, title, excerpt, content, author_id, category, read_time, image, published_at
 * 23) FAQ (faq_items): id, question, answer, category, sort_order
 * 24) Библиотека знаний (library_articles): id, title, slug, excerpt, content, category, image
 * 25) Уведомления (notifications): id, user_id, type, title, body, read_at
 * 26) Расписание грумеров (master_schedules): id, master_id, day_of_week, start_time, end_time, is_available
 * 27) Галерея (gallery_items): id, title, description, image, category, master_id, service_id, course_id
 * 28) Документы (documents): id, title, slug, content, type, file_path, is_active
 * 29) Контакты (contacts): id, type, label, value, icon, sort_order, is_active
 * 30) Вопросы теста курсов (course_quiz_questions): id, question, type, sort_order
 * 31) Варианты ответов теста (course_quiz_options): id, question_id, option_text, points, sort_order
 * 32) Ответы пользователей на тест (course_quiz_answers): id, user_id, question_id, option_id
 * 33) Сведения об образовательной организации (education_org_info): id, org_name, license_number, inn, ogrn, address
 * 34) Модули курсов (course_modules): id, course_id, title, description, sort_order
 * 35) Контент курсов (course_content): id, module_id, title, type, content, file_path, duration_minutes
 * 36) Прогресс пользователя по курсу (user_course_progress): id, user_id, course_id, module_id, content_id, is_completed, progress_percent
 * 37) Портфолио грумера (groomer_portfolio): id, master_id, title, description, image, service_id, breed, work_date
 * 38) Сообщения/чат (messages): id, sender_id, recipient_id, message, is_read, type
 * 39) SMS-рассылки (sms_campaigns): id, title, message, status, scheduled_at, total_recipients, sent_count
 * 40) Получатели SMS (sms_recipients): id, campaign_id, user_id, phone, status, sent_at
 * 41) Товары склада (warehouse_items): id, name, sku, category, quantity, unit, price, min_stock, supplier
 * 42) Транзакции склада (warehouse_transactions): id, item_id, type, quantity, notes, related_booking_id
 * 43) Финансовые транзакции (financial_transactions): id, type, amount, category, description, service_booking_id, course_booking_id, transaction_date
 * 44) Отчёты (reports): id, title, type, period_start, period_end, data, file_path
 *
 * Во все таблицы добавлены: id, created_at, updated_at, created_by (nullable, FK → users.id).
 */

export const up = async function (knex) {
  await knex.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('email', 255).notNullable().unique();
    t.string('password_hash', 255);
    t.string('name', 255).notNullable();
    t.string('phone', 50);
    t.string('role', 50).notNullable().defaultTo('client'); // client | groomer | admin
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('masters', (t) => {
    t.increments('id').primary();
    t.integer('user_id').nullable().references('id').inTable('users').onDelete('SET NULL');
    t.string('full_name', 255).notNullable();
    t.string('phone', 50);
    t.integer('experience');
    t.text('specialization');
    t.decimal('rating', 3, 2);
    t.string('image', 500);
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('services', (t) => {
    t.increments('id').primary();
    t.string('name', 500).notNullable();
    t.string('category', 50).notNullable(); // dogs, cats, other
    t.string('type', 50).notNullable(); // grooming, bathing, nail, extra
    t.integer('price').notNullable();
    t.string('duration', 100);
    t.text('description');
    t.string('image', 500);
    t.string('breed', 255);
    t.string('price_range', 100);
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('courses', (t) => {
    t.increments('id').primary();
    t.string('name', 500).notNullable();
    t.string('level', 50).notNullable(); // beginner, advanced
    t.string('format', 50).notNullable(); // online, offline, hybrid
    t.string('duration', 100);
    t.integer('price').notNullable();
    t.text('description');
    t.string('image', 500);
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('course_schedules', (t) => {
    t.increments('id').primary();
    t.integer('course_id').notNullable().references('id').inTable('courses').onDelete('CASCADE');
    t.date('start_date').notNullable();
    t.time('start_time');
    t.integer('spots').defaultTo(12);
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('master_services', (t) => {
    t.increments('id').primary();
    t.integer('master_id').notNullable().references('id').inTable('masters').onDelete('CASCADE');
    t.integer('service_id').notNullable().references('id').inTable('services').onDelete('CASCADE');
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
    t.unique(['master_id', 'service_id']);
  });

  await knex.schema.createTable('course_instructors', (t) => {
    t.increments('id').primary();
    t.integer('course_id').notNullable().references('id').inTable('courses').onDelete('CASCADE');
    t.integer('master_id').notNullable().references('id').inTable('masters').onDelete('CASCADE');
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
    t.unique(['course_id', 'master_id']);
  });

  await knex.schema.createTable('pets', (t) => {
    t.increments('id').primary();
    t.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('name', 255).notNullable();
    t.string('breed', 255);
    t.integer('age');
    t.string('photo', 500);
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('service_bookings', (t) => {
    t.increments('id').primary();
    t.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.integer('service_id').notNullable().references('id').inTable('services').onDelete('RESTRICT');
    t.integer('master_id').nullable().references('id').inTable('masters').onDelete('SET NULL');
    t.integer('pet_id').nullable().references('id').inTable('pets').onDelete('SET NULL');
    t.timestamp('scheduled_at').notNullable();
    t.string('status', 50).notNullable().defaultTo('pending'); // pending, confirmed, in_progress, completed, cancelled, postponed
    t.string('contact_method', 100).defaultTo('по звонку');
    t.text('notes');
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('course_bookings', (t) => {
    t.increments('id').primary();
    t.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.integer('course_id').notNullable().references('id').inTable('courses').onDelete('RESTRICT');
    t.integer('course_schedule_id').nullable().references('id').inTable('course_schedules').onDelete('SET NULL');
    t.integer('master_id').nullable().references('id').inTable('masters').onDelete('SET NULL');
    t.string('status', 50).notNullable().defaultTo('pending');
    t.text('notes');
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('visits', (t) => {
    t.increments('id').primary();
    t.integer('pet_id').notNullable().references('id').inTable('pets').onDelete('CASCADE');
    t.integer('service_booking_id').nullable().references('id').inTable('service_bookings').onDelete('SET NULL');
    t.integer('service_id').notNullable().references('id').inTable('services').onDelete('RESTRICT');
    t.integer('master_id').nullable().references('id').inTable('masters').onDelete('SET NULL');
    t.date('visit_date').notNullable();
    t.text('notes');
    t.string('weight', 50);
    t.string('health_status', 100);
    t.text('recommendations');
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('reviews', (t) => {
    t.increments('id').primary();
    t.integer('user_id').nullable().references('id').inTable('users').onDelete('SET NULL');
    t.integer('service_id').nullable().references('id').inTable('services').onDelete('SET NULL');
    t.integer('course_id').nullable().references('id').inTable('courses').onDelete('SET NULL');
    t.integer('master_id').nullable().references('id').inTable('masters').onDelete('SET NULL');
    t.integer('rating').notNullable();
    t.text('text').notNullable();
    t.string('pet_name', 255);
    t.string('type', 50).notNullable(); // service, course
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('favorite_services', (t) => {
    t.increments('id').primary();
    t.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.integer('service_id').notNullable().references('id').inTable('services').onDelete('CASCADE');
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
    t.unique(['user_id', 'service_id']);
  });

  await knex.schema.createTable('favorite_courses', (t) => {
    t.increments('id').primary();
    t.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.integer('course_id').notNullable().references('id').inTable('courses').onDelete('CASCADE');
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
    t.unique(['user_id', 'course_id']);
  });

  await knex.schema.createTable('loyalty_accounts', (t) => {
    t.increments('id').primary();
    t.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').unique();
    t.integer('points').notNullable().defaultTo(0);
    t.integer('total_earned').notNullable().defaultTo(0);
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('pet_mood_entries', (t) => {
    t.increments('id').primary();
    t.integer('pet_id').notNullable().references('id').inTable('pets').onDelete('CASCADE');
    t.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('mood', 100).notNullable();
    t.text('note');
    t.date('entry_date').notNullable();
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('pet_observations', (t) => {
    t.increments('id').primary();
    t.integer('pet_id').notNullable().references('id').inTable('pets').onDelete('CASCADE');
    t.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.text('text').notNullable();
    t.string('type', 50).notNullable(); // concern, positive
    t.date('observation_date').notNullable();
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('shelter_applications', (t) => {
    t.increments('id').primary();
    t.string('org_name', 500).notNullable();
    t.string('inn', 50);
    t.string('kpp', 50);
    t.string('contact_name', 255).notNullable();
    t.string('phone', 50).notNullable();
    t.string('email', 255).notNullable();
    t.text('message');
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('zone_rental_applications', (t) => {
    t.increments('id').primary();
    t.integer('user_id').nullable().references('id').inTable('users').onDelete('SET NULL');
    t.string('name', 255).notNullable();
    t.string('phone', 50).notNullable();
    t.string('email', 255).notNullable();
    t.integer('hours').notNullable();
    t.text('message');
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('leads', (t) => {
    t.increments('id').primary();
    t.string('name', 255).notNullable();
    t.string('email', 255).notNullable();
    t.string('phone', 50);
    t.string('source', 100); // contact_form, booking, etc.
    t.string('status', 50).notNullable().defaultTo('new');
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('lead_call_tasks', (t) => {
    t.increments('id').primary();
    t.integer('lead_id').notNullable().references('id').inTable('leads').onDelete('CASCADE');
    t.integer('assignee_id').nullable().references('id').inTable('users').onDelete('SET NULL');
    t.string('status', 50).notNullable().defaultTo('pending'); // pending, done
    t.date('due_date');
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('blog_posts', (t) => {
    t.increments('id').primary();
    t.string('title', 500).notNullable();
    t.text('excerpt');
    t.text('content');
    t.integer('author_id').nullable().references('id').inTable('masters').onDelete('SET NULL');
    t.string('category', 100);
    t.string('read_time', 50);
    t.string('image', 500);
    t.timestamp('published_at').nullable();
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('faq_items', (t) => {
    t.increments('id').primary();
    t.text('question').notNullable();
    t.text('answer').notNullable();
    t.string('category', 100);
    t.integer('sort_order').defaultTo(0);
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('library_articles', (t) => {
    t.increments('id').primary();
    t.string('title', 500).notNullable();
    t.string('slug', 500).notNullable().unique();
    t.text('excerpt');
    t.text('content');
    t.string('category', 100);
    t.string('image', 500);
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('notifications', (t) => {
    t.increments('id').primary();
    t.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('type', 100).notNullable();
    t.string('title', 500);
    t.text('body');
    t.timestamp('read_at').nullable();
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('master_schedules', (t) => {
    t.increments('id').primary();
    t.integer('master_id').notNullable().references('id').inTable('masters').onDelete('CASCADE');
    t.integer('day_of_week').notNullable(); // 0-6 (понедельник-воскресенье)
    t.time('start_time').notNullable();
    t.time('end_time').notNullable();
    t.boolean('is_available').defaultTo(true);
    t.date('date_override').nullable(); // для особых дат (праздники, отпуск)
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('gallery_items', (t) => {
    t.increments('id').primary();
    t.string('title', 500);
    t.text('description');
    t.string('image', 500).notNullable();
    t.string('category', 100); // services, courses, before_after, etc.
    t.integer('master_id').nullable().references('id').inTable('masters').onDelete('SET NULL');
    t.integer('service_id').nullable().references('id').inTable('services').onDelete('SET NULL');
    t.integer('course_id').nullable().references('id').inTable('courses').onDelete('SET NULL');
    t.integer('sort_order').defaultTo(0);
    t.boolean('is_featured').defaultTo(false);
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('documents', (t) => {
    t.increments('id').primary();
    t.string('title', 500).notNullable();
    t.string('slug', 500).notNullable().unique();
    t.text('content');
    t.string('type', 100).notNullable(); // privacy_policy, terms, contract, etc.
    t.string('file_path', 500); // путь к PDF файлу, если есть
    t.boolean('is_active').defaultTo(true);
    t.integer('sort_order').defaultTo(0);
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('contacts', (t) => {
    t.increments('id').primary();
    t.string('type', 100).notNullable(); // address, phone, email, social
    t.string('label', 255); // "Главный офис", "WhatsApp", "Instagram"
    t.string('value', 500).notNullable(); // значение контакта
    t.string('icon', 100); // название иконки
    t.integer('sort_order').defaultTo(0);
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('course_quiz_questions', (t) => {
    t.increments('id').primary();
    t.text('question').notNullable();
    t.string('type', 50).notNullable().defaultTo('single'); // single, multiple
    t.integer('sort_order').defaultTo(0);
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('course_quiz_options', (t) => {
    t.increments('id').primary();
    t.integer('question_id').notNullable().references('id').inTable('course_quiz_questions').onDelete('CASCADE');
    t.text('option_text').notNullable();
    t.integer('points').defaultTo(0); // баллы за этот вариант
    t.integer('sort_order').defaultTo(0);
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('course_quiz_answers', (t) => {
    t.increments('id').primary();
    t.integer('user_id').nullable().references('id').inTable('users').onDelete('SET NULL');
    t.integer('question_id').notNullable().references('id').inTable('course_quiz_questions').onDelete('CASCADE');
    t.integer('option_id').notNullable().references('id').inTable('course_quiz_options').onDelete('CASCADE');
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('education_org_info', (t) => {
    t.increments('id').primary();
    t.string('org_name', 500).notNullable();
    t.string('license_number', 255);
    t.string('inn', 50);
    t.string('ogrn', 50);
    t.text('address');
    t.string('phone', 50);
    t.string('email', 255);
    t.text('description');
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('course_modules', (t) => {
    t.increments('id').primary();
    t.integer('course_id').notNullable().references('id').inTable('courses').onDelete('CASCADE');
    t.string('title', 500).notNullable();
    t.text('description');
    t.integer('sort_order').defaultTo(0);
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('course_content', (t) => {
    t.increments('id').primary();
    t.integer('module_id').notNullable().references('id').inTable('course_modules').onDelete('CASCADE');
    t.string('title', 500).notNullable();
    t.string('type', 50).notNullable(); // article, video, file, quiz
    t.text('content');
    t.string('file_path', 500); // путь к файлу (видео, PDF и т.д.)
    t.integer('duration_minutes'); // для видео
    t.integer('sort_order').defaultTo(0);
    t.boolean('is_required').defaultTo(true);
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('user_course_progress', (t) => {
    t.increments('id').primary();
    t.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.integer('course_id').notNullable().references('id').inTable('courses').onDelete('CASCADE');
    t.integer('course_booking_id').nullable().references('id').inTable('course_bookings').onDelete('SET NULL');
    t.integer('module_id').nullable().references('id').inTable('course_modules').onDelete('SET NULL');
    t.integer('content_id').nullable().references('id').inTable('course_content').onDelete('SET NULL');
    t.boolean('is_completed').defaultTo(false);
    t.integer('progress_percent').defaultTo(0); // 0-100
    t.timestamp('completed_at').nullable();
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
    t.unique(['user_id', 'course_id', 'content_id']);
  });

  await knex.schema.createTable('groomer_portfolio', (t) => {
    t.increments('id').primary();
    t.integer('master_id').notNullable().references('id').inTable('masters').onDelete('CASCADE');
    t.string('title', 500);
    t.text('description');
    t.string('image', 500).notNullable();
    t.integer('service_id').nullable().references('id').inTable('services').onDelete('SET NULL');
    t.string('breed', 255);
    t.date('work_date');
    t.boolean('is_featured').defaultTo(false);
    t.integer('sort_order').defaultTo(0);
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('messages', (t) => {
    t.increments('id').primary();
    t.integer('sender_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.integer('recipient_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.text('message').notNullable();
    t.boolean('is_read').defaultTo(false);
    t.timestamp('read_at').nullable();
    t.string('type', 50).defaultTo('chat'); // chat, system
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('sms_campaigns', (t) => {
    t.increments('id').primary();
    t.string('title', 500).notNullable();
    t.text('message').notNullable();
    t.string('status', 50).notNullable().defaultTo('draft'); // draft, scheduled, sending, completed, cancelled
    t.timestamp('scheduled_at').nullable();
    t.integer('total_recipients').defaultTo(0);
    t.integer('sent_count').defaultTo(0);
    t.integer('failed_count').defaultTo(0);
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('sms_recipients', (t) => {
    t.increments('id').primary();
    t.integer('campaign_id').notNullable().references('id').inTable('sms_campaigns').onDelete('CASCADE');
    t.integer('user_id').nullable().references('id').inTable('users').onDelete('SET NULL');
    t.string('phone', 50).notNullable();
    t.string('status', 50).defaultTo('pending'); // pending, sent, failed, delivered
    t.timestamp('sent_at').nullable();
    t.text('error_message');
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('warehouse_items', (t) => {
    t.increments('id').primary();
    t.string('name', 500).notNullable();
    t.string('sku', 100).unique(); // артикул
    t.string('category', 100); // tools, consumables, products
    t.text('description');
    t.integer('quantity').notNullable().defaultTo(0);
    t.string('unit', 50).defaultTo('шт'); // шт, кг, л
    t.decimal('price', 10, 2); // цена за единицу
    t.decimal('min_stock', 10, 2).defaultTo(0); // минимальный остаток
    t.string('supplier', 255);
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('warehouse_transactions', (t) => {
    t.increments('id').primary();
    t.integer('item_id').notNullable().references('id').inTable('warehouse_items').onDelete('CASCADE');
    t.string('type', 50).notNullable(); // in, out, adjustment
    t.decimal('quantity', 10, 2).notNullable();
    t.text('notes');
    t.integer('related_booking_id').nullable().references('id').inTable('service_bookings').onDelete('SET NULL');
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('financial_transactions', (t) => {
    t.increments('id').primary();
    t.string('type', 50).notNullable(); // income, expense, refund
    t.decimal('amount', 10, 2).notNullable();
    t.string('category', 100); // service, course, salary, rent, etc.
    t.text('description');
    t.integer('service_booking_id').nullable().references('id').inTable('service_bookings').onDelete('SET NULL');
    t.integer('course_booking_id').nullable().references('id').inTable('course_bookings').onDelete('SET NULL');
    t.integer('master_id').nullable().references('id').inTable('masters').onDelete('SET NULL');
    t.date('transaction_date').notNullable();
    t.string('payment_method', 100); // cash, card, online
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  await knex.schema.createTable('reports', (t) => {
    t.increments('id').primary();
    t.string('title', 500).notNullable();
    t.string('type', 100).notNullable(); // revenue, bookings, clients, etc.
    t.date('period_start').notNullable();
    t.date('period_end').notNullable();
    t.json('data'); // JSON с данными отчета
    t.string('file_path', 500); // путь к сгенерированному файлу (PDF, Excel)
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
  });

  // users.created_by — self-reference (допустимо в PostgreSQL)
};

export const down = async function (knex) {
  const order = [
    'reports',
    'financial_transactions',
    'warehouse_transactions',
    'warehouse_items',
    'sms_recipients',
    'sms_campaigns',
    'messages',
    'groomer_portfolio',
    'user_course_progress',
    'course_content',
    'course_modules',
    'education_org_info',
    'course_quiz_answers',
    'course_quiz_options',
    'course_quiz_questions',
    'contacts',
    'documents',
    'gallery_items',
    'master_schedules',
    'notifications',
    'library_articles',
    'faq_items',
    'blog_posts',
    'lead_call_tasks',
    'leads',
    'zone_rental_applications',
    'shelter_applications',
    'pet_observations',
    'pet_mood_entries',
    'loyalty_accounts',
    'favorite_courses',
    'favorite_services',
    'reviews',
    'visits',
    'course_bookings',
    'service_bookings',
    'pets',
    'course_instructors',
    'master_services',
    'course_schedules',
    'courses',
    'services',
    'masters',
    'users',
  ];
  for (const table of order) {
    await knex.schema.dropTableIfExists(table);
  }
};
