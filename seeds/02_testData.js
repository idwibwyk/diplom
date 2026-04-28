/**
 * Заполнение всех таблиц БД достоверными данными на основе mockData и фронта.
 * Запускать после 01_users.js.
 */
const MASTERS_MOCK = [
  { full_name: 'Анна Петрова', experience: 10, specialization: 'Мелкие породы, декоративные стрижки, преподаватель', rating: 4.9, image: '/pictures/Groomer Anna.jpg' },
  { full_name: 'Мария Иванова', experience: 8, specialization: 'Крупные породы, выставочный груминг, преподаватель', rating: 4.8, image: '/pictures/Groomer Maria.jpg' },
  { full_name: 'Иван Соколов', experience: 12, specialization: 'Креативные стрижки, пудели, преподаватель', rating: 5.0, image: '/pictures/Groomer Ivan.jpg' },
  { full_name: 'Елена Смирнова', experience: 7, specialization: 'Груминг кошек, экзотические животные, преподаватель', rating: 4.9, image: '/pictures/Groomer Elena.jpg' },
  { full_name: 'Дмитрий Волков', experience: 9, specialization: 'СПА-процедуры, гигиенический уход, преподаватель', rating: 4.7, image: '/pictures/Groomer Dmitry.jpg' },
  { full_name: 'Ольга Козлова', experience: 11, specialization: 'Шпицы, йорки, экспресс-уход, преподаватель', rating: 4.9, image: '/pictures/Groomer Olga.jpg' },
];

const FAQ_MOCK = [
  { question: 'С какого возраста можно стричь собаку?', answer: 'Щенков можно начинать приучать к грумингу с 3-4 месяцев. Первые процедуры должны быть короткими и комфортными.', category: 'general', sort_order: 1 },
  { question: 'Используете ли вы седативные препараты?', answer: 'Нет, мы работаем только с профессиональными методами успокоения и не используем медикаменты без острой необходимости и назначения ветеринара.', category: 'safety', sort_order: 2 },
  { question: 'Как часто нужно стричь собаку?', answer: 'Частота стрижки зависит от породы. Собак с длинной шерстью рекомендуется стричь раз в 1-2 месяца.', category: 'care', sort_order: 3 },
  { question: 'Можно ли стричь кошку?', answer: 'Да, мы предоставляем услуги стрижки кошек. Особенно это актуально для длинношёрстных пород и в жаркое время года.', category: 'cats', sort_order: 4 },
  { question: 'Что делать, если питомец агрессивен?', answer: 'Мы работаем с агрессивными животными, но за это взимается дополнительная плата от 300 рублей.', category: 'safety', sort_order: 5 },
  { question: 'Нужна ли предварительная запись?', answer: 'Да, мы рекомендуем записываться заранее, чтобы выбрать удобное время и мастера. Запись доступна онлайн или по телефону.', category: 'booking', sort_order: 6 },
];

export const seed = async function (knex) {
  const users = await knex('users').select('id', 'role').orderBy('id');
  const adminId = users.find((u) => u.role === 'admin')?.id ?? 1;
  const groomerIds = users.filter((u) => u.role === 'groomer').map((u) => u.id);
  const clientIds = users.filter((u) => u.role === 'client').map((u) => u.id);

  // Masters (6, привязка к groomer user_id по порядку)
  await knex('masters').del();
  const masterInserts = MASTERS_MOCK.map((m, i) => ({
    user_id: groomerIds[i] ?? null,
    full_name: m.full_name,
    phone: null,
    experience: m.experience,
    specialization: m.specialization,
    rating: m.rating,
    image: m.image,
    created_by: adminId,
  }));
  await knex('masters').insert(masterInserts);
  const mastersRows = await knex('masters').select('id').orderBy('id');
  const masterIds = mastersRows.map((r) => r.id);

  // Services — полный список как на /services/list (27 услуг), с duration_minutes для слотов
  await knex('services').del();
  const servicesData = [
    { name: 'Стрижка йоркширского терьера (йорка)', category: 'dogs', type: 'grooming', price: 1400, duration: '2-3 часа', duration_minutes: 150, description: 'Профессиональная стрижка йоркширского терьера с учетом стандарта породы', image: '/pictures/Yorkshire Terrier (York).jpg', breed: 'Йоркширский терьер', price_range: null, loyalty_points: 5 },
    { name: 'Стрижка ши-тцу', category: 'dogs', type: 'grooming', price: 1600, duration: '2-3 часа', duration_minutes: 150, description: 'Комплексная стрижка ши-тцу с укладкой', image: '/pictures/Shih Tzu.jpg', breed: 'Ши-тцу', price_range: null },
    { name: 'Стрижка пуделя (карликовый)', category: 'dogs', type: 'grooming', price: 1800, duration: '2-3 часа', duration_minutes: 150, description: 'Стрижка карликового пуделя с различными вариантами укладки', image: '/pictures/Poodle (dwarf).jpg', breed: 'Пудель карликовый', price_range: null },
    { name: 'Стрижка спаниелей (американский/английский кокер)', category: 'dogs', type: 'grooming', price: 1900, duration: '2-3 часа', duration_minutes: 150, description: 'Стрижка спаниелей с учетом особенностей породы', image: '/pictures/Spaniels (American or English Cocker).jpg', breed: 'Спаниель', price_range: null },
    { name: 'Стрижка цвергшнауцера', category: 'dogs', type: 'grooming', price: 1800, duration: '2-3 часа', duration_minutes: 150, description: 'Тримминг и стрижка цвергшнауцера', image: '/pictures/Miniature Schnauzer.jpg', breed: 'Цвергшнауцер', price_range: null },
    { name: 'Стрижка шпица', category: 'dogs', type: 'grooming', price: 1600, duration: '2-3 часа', duration_minutes: 150, description: 'Стрижка шпица с сохранением пышной шерсти', image: '/pictures/‎Pomeranian (Pomeranian, German miniature).jpg', breed: 'Шпиц', price_range: null },
    { name: 'Стрижка мальтезе', category: 'dogs', type: 'grooming', price: 1400, duration: '2-3 часа', duration_minutes: 150, description: 'Стрижка мальтезе с укладкой белой шерсти', image: '/pictures/Maltese Lapdog (Maltese).jpg', breed: 'Мальтезе', price_range: null },
    { name: 'Стрижка бишон фризе', category: 'dogs', type: 'grooming', price: 1800, duration: '2-3 часа', duration_minutes: 150, description: 'Стрижка бишон фризе с пышной укладкой', image: '/pictures/Bichon Frise.jpg', breed: 'Бишон фризе', price_range: null },
    { name: 'Стрижка чихуахуа', category: 'dogs', type: 'grooming', price: 1200, duration: '1-2 часа', duration_minutes: 90, description: 'Гигиеническая и декоративная стрижка чихуахуа (короткошёрстная и длинношёрстная)', image: '/pictures/‎Chihuahua.jpg', breed: 'Чихуахуа', price_range: null },
    { name: 'Стрижка таксы (все типы шерсти)', category: 'dogs', type: 'grooming', price: 1200, duration: '1.5-2.5 часа', duration_minutes: 120, description: 'Стрижка таксы с учетом типа шерсти', image: '/pictures/Dachshund (all types of wool).jpg', breed: 'Такса', price_range: '1200-1700' },
    { name: 'Стрижка лабрадора-ретривера', category: 'dogs', type: 'grooming', price: 2200, duration: '2-3 часа', duration_minutes: 150, description: 'Комплексный груминг лабрадора', image: '/pictures/Labrador Retriever.jpg', breed: 'Лабрадор', price_range: null },
    { name: 'Стрижка золотистого ретривера', category: 'dogs', type: 'grooming', price: 2800, duration: '3-4 часа', duration_minutes: 210, description: 'Полный груминг золотистого ретривера', image: '/pictures/Golden Retriever.jpg', breed: 'Золотистый ретривер', price_range: null },
    { name: 'Стрижка немецкой овчарки', category: 'dogs', type: 'grooming', price: 4000, duration: '3-4 часа', duration_minutes: 210, description: 'Комплексный груминг немецкой овчарки', image: '/pictures/‎German Shepherd.jpg', breed: 'Немецкая овчарка', price_range: null },
    { name: 'Стрижка сибирского хаски', category: 'dogs', type: 'grooming', price: 3500, duration: '3-4 часа', duration_minutes: 210, description: 'Груминг сибирского хаски с учетом густого подшерстка', image: '/pictures/Siberian Husky.jpg', breed: 'Хаски', price_range: null },
    { name: 'Стрижка спаниеля (кавалер кинг чарльз)', category: 'dogs', type: 'grooming', price: 1600, duration: '2-3 часа', duration_minutes: 150, description: 'Стрижка кавалер кинг чарльз спаниеля', image: '/pictures/Spaniel (Cavalier King Charles).jpg', breed: 'Кавалер Кинг Чарльз', price_range: null },
    { name: 'Стрижка мопса', category: 'dogs', type: 'grooming', price: 1400, duration: '1.5-2 часа', duration_minutes: 105, description: 'Гигиенический груминг мопса', image: '/pictures/Pug.jpg', breed: 'Мопс', price_range: null },
    { name: 'Стрижка французского бульдога', category: 'dogs', type: 'grooming', price: 1400, duration: '1.5-2 часа', duration_minutes: 105, description: 'Гигиенический груминг французского бульдога', image: '/pictures/French Bulldog.jpg', breed: 'Французский бульдог', price_range: null },
    { name: 'Стрижка джек-рассел-терьера', category: 'dogs', type: 'grooming', price: 1600, duration: '2-3 часа', duration_minutes: 150, description: 'Тримминг джек-рассел-терьера', image: '/pictures/Jack Russell Terrier.jpg', breed: 'Джек-рассел-терьер', price_range: null },
    { name: 'Стрижка шелти', category: 'dogs', type: 'grooming', price: 2000, duration: '2-3 часа', duration_minutes: 150, description: 'Груминг шелти с учетом длинной шерсти', image: '/pictures/Sheltie.jpg', breed: 'Шелти', price_range: null },
    { name: 'Стрижка пуделя (средний/королевский)', category: 'dogs', type: 'grooming', price: 2000, duration: '3-4 часа', duration_minutes: 210, description: 'Стрижка среднего или королевского пуделя', image: '/pictures/Poodle (medium or royal).jpg', breed: 'Пудель', price_range: '2000-3500' },
    { name: 'Стрижка кошки', category: 'cats', type: 'grooming', price: 1600, duration: '1.5-2 часа', duration_minutes: 105, description: 'Профессиональная стрижка кошки', image: '/pictures/Cat haircut.jpg', breed: 'Кошки', price_range: null },
    { name: 'Купание кошки', category: 'cats', type: 'bathing', price: 1000, duration: '1 час', duration_minutes: 60, description: 'Профессиональное купание кошки', image: '/pictures/Bathing a cat.jpg', breed: 'Кошки', price_range: null },
    { name: 'Стрижка мейн-куна', category: 'cats', type: 'grooming', price: 2000, duration: '2-3 часа', duration_minutes: 150, description: 'Стрижка мейн-куна с учетом длинной шерсти', image: '/pictures/Meikun\'s haircut.jpg', breed: 'Мейн-кун', price_range: null },
    { name: 'Стрижка когтей', category: 'other', type: 'nail', price: 200, duration: '15-30 мин', duration_minutes: 30, description: 'Стрижка когтей для собак и кошек', image: '/pictures/‎Clipping claws.jpg', breed: 'Все', price_range: null },
    { name: 'Стрижка кроликов', category: 'other', type: 'grooming', price: 2000, duration: '1-1.5 часа', duration_minutes: 75, description: 'Профессиональная стрижка кроликов', image: '/pictures/Rabbit grooming from.jpg', breed: 'Кролики', price_range: 'от 2000' },
    { name: 'Доплата за агрессию', category: 'other', type: 'extra', price: 300, duration: '0', duration_minutes: 30, description: 'Доплата за работу с агрессивным животным', image: '/pictures/Aggression.jpg', breed: 'Все', price_range: 'от 300', loyalty_points: 0 },
  ];
  await knex('services').insert(servicesData.map((s) => ({ ...s, loyalty_points: s.loyalty_points ?? 5, created_by: adminId })));
  // Пример бизнес-правила: для "Стрижка шпица" закладываем 4 слота (2 часа)
  await knex('services').where({ name: 'Стрижка шпица' }).update({ duration_slots: 4, duration_minutes: 120 });
  const serviceIds = (await knex('services').select('id').orderBy('id')).map((r) => r.id);

  // Courses
  await knex('courses').del();
  const coursesData = [
    { name: 'Основы груминга собак', level: 'beginner', format: 'hybrid', duration: '3 месяца', price: 35000, description: 'Базовый курс для начинающих грумеров', image: '/pictures/The basics of dog grooming.jpg', loyalty_points: 50 },
    { name: 'Профессиональный груминг', level: 'advanced', format: 'online', duration: '6 месяцев', price: 65000, description: 'Углубленная программа для действующих грумеров', image: '/pictures/Professional grooming.jpg', loyalty_points: 100 },
    { name: 'Выставочный груминг', level: 'advanced', format: 'offline', duration: '2 месяца', price: 45000, description: 'Специализированные техники для выставочных собак', image: '/pictures/Exhibition grooming.jpg', loyalty_points: 75 },
    { name: 'Креативный груминг', level: 'advanced', format: 'hybrid', duration: '1 месяц', price: 28000, description: 'Создание уникальных дизайнерских стрижек', image: '/pictures/Creative grooming.jpg', loyalty_points: 40 },
    { name: 'Груминг кошек', level: 'beginner', format: 'online', duration: '2 месяца', price: 30000, description: 'Специфика работы с кошками разных пород', image: '/pictures/Cat grooming.jpg', loyalty_points: 50 },
    { name: 'Экспресс-линька для длинношёрстных собак', level: 'beginner', format: 'hybrid', duration: '1 месяц', price: 25000, description: 'Специализированный курс по работе с линькой', image: '/pictures/Express molting for long-haired dogs.jpg', loyalty_points: 25 },
  ];
  await knex('courses').insert(coursesData.map((c) => ({ ...c, loyalty_points: c.loyalty_points ?? 50, created_by: adminId })));
  const courseIds = (await knex('courses').select('id').orderBy('id')).map((r) => r.id);

  // course_schedules
  await knex('course_schedules').del();
  const scheduleData = [
    { course_id: courseIds[0], start_date: '2026-02-01', start_time: '10:00', spots: 12 },
    { course_id: courseIds[1], start_date: '2026-02-15', start_time: '14:00', spots: 8 },
    { course_id: courseIds[2], start_date: '2026-02-20', start_time: '11:00', spots: 10 },
    { course_id: courseIds[3], start_date: '2026-03-01', start_time: '13:00', spots: 15 },
  ];
  await knex('course_schedules').insert(scheduleData.map((s) => ({ ...s, created_by: adminId })));
  const scheduleIds = (await knex('course_schedules').select('id').orderBy('id')).map((r) => r.id);

  // master_services (каждый мастер — несколько услуг)
  await knex('master_services').del();
  const ms = [];
  for (let m = 0; m < masterIds.length; m++) {
    for (let s = 0; s < Math.min(4, serviceIds.length); s++) {
      ms.push({ master_id: masterIds[m], service_id: serviceIds[(m + s) % serviceIds.length], created_by: adminId });
    }
  }
  await knex('master_services').insert(ms);

  // course_instructors
  await knex('course_instructors').del();
  const ci = [];
  for (let c = 0; c < courseIds.length; c++) {
    ci.push({ course_id: courseIds[c], master_id: masterIds[c % masterIds.length], created_by: adminId });
  }
  await knex('course_instructors').insert(ci);

  // pets (у клиентов)
  await knex('pets').del();
  await knex('pets').insert([
    { user_id: clientIds[0], name: 'Барсик', animal_type: 'dog', breed: 'Шпиц', sex: 'м', age: 3, photo: null, created_by: clientIds[0] },
    { user_id: clientIds[0], name: 'Мурка', animal_type: 'cat', breed: 'Короткошерстная', sex: 'ж', age: 2, photo: null, created_by: clientIds[0] },
    { user_id: clientIds[1], name: 'Рекс', animal_type: 'dog', breed: 'Лабрадор', sex: 'м', age: 5, photo: null, created_by: clientIds[1] },
    { user_id: clientIds[2], name: 'Зефирка', animal_type: 'rabbit', breed: null, sex: 'ж', age: 1, photo: null, created_by: clientIds[2] },
  ]);
  const petIds = (await knex('pets').select('id').orderBy('id')).map((r) => r.id);

  // service_bookings
  await knex('service_bookings').del();
  await knex('service_bookings').insert([
    { user_id: clientIds[0], service_id: serviceIds[0], master_id: masterIds[0], pet_id: petIds[0], scheduled_at: new Date('2026-02-05T10:00:00'), status: 'confirmed', contact_method: null, notes: null, created_by: clientIds[0] },
    { user_id: clientIds[1], service_id: serviceIds[4], master_id: masterIds[1], pet_id: petIds[2], scheduled_at: new Date('2026-02-06T14:00:00'), status: 'pending', contact_method: null, notes: null, created_by: clientIds[1] },
  ]);
  const bookingIds = (await knex('service_bookings').select('id').orderBy('id')).map((r) => r.id);

  // course_bookings
  await knex('course_bookings').del();
  await knex('course_bookings').insert([
    { user_id: clientIds[0], course_id: courseIds[0], course_schedule_id: scheduleIds[0], master_id: masterIds[0], status: 'confirmed', notes: null, created_by: clientIds[0] },
    { user_id: clientIds[2], course_id: courseIds[3], course_schedule_id: scheduleIds[3], master_id: masterIds[3], status: 'pending', notes: null, created_by: clientIds[2] },
  ]);
  const courseBookingIds = (await knex('course_bookings').select('id').orderBy('id')).map((r) => r.id);

  // visits (created_by — user_id того, кто создал запись; у нас это грумер, выполнявший визит)
  await knex('visits').del();
  await knex('visits').insert([
    { pet_id: petIds[0], service_booking_id: bookingIds[0], service_id: serviceIds[0], master_id: masterIds[0], visit_date: '2026-01-05', notes: 'Отличная работа', weight: '4 кг', health_status: 'норма', recommendations: null, created_by: groomerIds[0] },
  ]);

  // reviews
  await knex('reviews').del();
  const reviewsData = [
    { user_id: clientIds[0], service_id: serviceIds[0], course_id: null, master_id: masterIds[0], rating: 5, text: 'Отличный салон! Моя собака всегда выходит довольной и красивой.', pet_name: 'Барсик', type: 'service', created_by: clientIds[0] },
    { user_id: clientIds[1], service_id: serviceIds[1], course_id: null, master_id: masterIds[1], rating: 5, text: 'Впервые привела йорку, результат превзошёл ожидания!', pet_name: 'Йоркширский терьер', type: 'service', created_by: clientIds[1] },
    { user_id: clientIds[2], service_id: null, course_id: courseIds[0], master_id: masterIds[0], rating: 5, text: 'Отличный курс! Преподаватели опытные, материал доступен.', pet_name: null, type: 'course', created_by: clientIds[2] },
  ];
  await knex('reviews').insert(reviewsData);

  // favorite_services, favorite_courses
  await knex('favorite_services').del();
  await knex('favorite_services').insert([
    { user_id: clientIds[0], service_id: serviceIds[0], created_by: clientIds[0] },
    { user_id: clientIds[0], service_id: serviceIds[3], created_by: clientIds[0] },
  ]);
  await knex('favorite_courses').del();
  await knex('favorite_courses').insert([
    { user_id: clientIds[0], course_id: courseIds[0], created_by: clientIds[0] },
  ]);

  // loyalty_accounts (на каждого клиента по одному)
  await knex('loyalty_accounts').del();
  for (const cid of clientIds) {
    await knex('loyalty_accounts').insert({ user_id: cid, points: 50, total_earned: 150, created_by: adminId });
  }

  // pet_mood_entries, pet_observations
  await knex('pet_mood_entries').del();
  await knex('pet_mood_entries').insert([
    { pet_id: petIds[0], user_id: clientIds[0], mood: 'радостный', note: 'После груминга', entry_date: '2026-01-06', created_by: clientIds[0] },
  ]);
  await knex('pet_observations').del();
  await knex('pet_observations').insert([
    { pet_id: petIds[0], user_id: clientIds[0], text: 'Шерсть стала мягче после стрижки', type: 'positive', observation_date: '2026-01-07', created_by: clientIds[0] },
  ]);

  // shelter_applications, zone_rental_applications
  await knex('shelter_applications').del();
  await knex('shelter_applications').insert([
    { org_name: 'Приют «Добрый дом»', inn: '7707123456', kpp: '770701001', contact_name: 'Ирина Волкова', phone: '+7 (999) 777-88-99', email: 'shelter@mail.ru', message: 'Заявка на выездной груминг, 15 собак', created_by: null },
  ]);
  await knex('zone_rental_applications').del();
  await knex('zone_rental_applications').insert([
    { user_id: clientIds[3], name: 'Ольга К.', phone: '+7 (999) 000-11-22', email: 'zone@mail.ru', hours: 4, message: 'Аренда зоны на 4 часа', created_by: clientIds[3] },
  ]);

  // leads, lead_call_tasks
  await knex('leads').del();
  await knex('leads').insert([
    { name: 'Мария Иванова', email: 'm@mail.ru', phone: '+7 999 111-22-33', source: 'contact_form', status: 'new', created_by: null },
    { name: 'Алексей Петров', email: 'a@mail.ru', phone: '+7 999 444-55-66', source: 'booking', status: 'contacted', created_by: adminId },
  ]);
  const leadIds = (await knex('leads').select('id').orderBy('id')).map((r) => r.id);
  await knex('lead_call_tasks').del();
  await knex('lead_call_tasks').insert([
    { lead_id: leadIds[0], assignee_id: adminId, status: 'pending', due_date: '2026-02-01', created_by: adminId },
  ]);

  // blog_posts: Услуги (для /services/blog) и Курсы (для /courses/blog)
  await knex('blog_posts').del();
  const blogPostsData = [
    { title: 'Как выбрать правильную стрижку для вашей собаки', excerpt: 'Подробный гид по выбору стрижки: тип шерсти, образ жизни, сезон и анатомия питомца.', content: `<div class="rounded-2xl border border-[#4A90E2]/25 bg-gradient-to-br from-[#4A90E2]/10 to-[#9EC3EF]/20 p-5"><p><strong>Анна Петрова, ведущий грумер-стилист</strong>: правильная стрижка всегда опирается на тип шерсти и задачи ухода, а не только на красивую фотографию.</p></div><h2>Тип шерсти - базовый критерий</h2><ul><li><strong>Жесткошерстные породы</strong> (шнауцеры, жесткошерстные таксы): предпочтителен тримминг, а не бритье машинкой.</li><li><strong>Породы с подшерстком</strong> (шпицы, хаски, овчарки): основной акцент на вычесывание и экспресс-линьку.</li><li><strong>Постоянно растущая шерсть</strong> (йорк, пудель, бишон): регулярная стрижка раз в 4-8 недель.</li></ul><h2>Как влияет образ жизни</h2><p>Активным питомцам подходят более практичные варианты длины, городским и шоу-питомцам - более декоративные формы с регулярным домашним уходом.</p><h2>Сезонность</h2><p>Летом важна гигиена и вентиляция шерсти, зимой - защита от реагентов, весной и осенью - работа с линькой и восстановлением покрова.</p><blockquote>Совет мастера: перед записью отправьте фото питомца в стойке и расскажите, сколько времени готовы тратить на домашный уход.</blockquote>`, author_id: masterIds[0], category: 'Услуги', read_time: '5 мин', image: '/pictures/Yorkshire Terrier (York).jpg', published_at: new Date('2026-01-15'), created_by: adminId },
    { title: '10 советов по уходу за шерстью собаки', excerpt: 'Пошаговый домашний уход между визитами к грумеру: расчесывание, мытье, сушка и лапы.', content: `<div class="rounded-2xl border border-[#4A90E2]/25 bg-gradient-to-r from-[#4A90E2]/10 to-transparent p-5"><p><strong>Мария Иванова</strong> делится 10 правилами, которые помогают сохранить шерсть здоровой и избежать колтунов.</p></div><ol><li><strong>Расчесывайте до мытья</strong>, а не после.</li><li><strong>Подберите правильный инструмент</strong> под тип шерсти.</li><li><strong>Используйте шампунь и кондиционер</strong> как обязательную пару.</li><li><strong>Сушите до полного высыхания</strong>, особенно подшерсток.</li><li><strong>Осматривайте лапы ежедневно</strong> после прогулок.</li><li><strong>Следите за питанием</strong> и балансом Омега-кислот.</li><li><strong>Приучайте к уходу с детства</strong> маленькими сессиями.</li><li><strong>Работайте с запахом системно</strong>: уши, зубы, зона гигиены.</li><li><strong>Не срезайте колтуны ножницами дома</strong> без навыка.</li><li><strong>Ведите график ухода</strong> и не откладывайте визиты.</li></ol><p>Регулярность всегда дешевле и безопаснее, чем экстренное устранение запущенных колтунов.</p>`, author_id: masterIds[1], category: 'Услуги', read_time: '7 мин', image: '/pictures/Golden Retriever.jpg', published_at: new Date('2026-01-10'), created_by: adminId },
    { title: 'Как подготовить щенка к первому визиту к грумеру', excerpt: 'Мягкая адаптация щенка к грумингу: подготовка дома, первый визит и закрепление положительного опыта.', content: `<div class="rounded-2xl border border-[#4A90E2]/25 bg-gradient-to-br from-[#4A90E2]/10 to-[#9EC3EF]/20 p-5"><p><strong>Дмитрий Волков</strong>: первый визит формирует отношение щенка к уходу на годы вперед.</p></div><h2>Лучший возраст</h2><p>Оптимально приходить после базовой вакцинации и карантина, в формате короткого знакомства.</p><h2>Подготовка дома за 2-3 недели</h2><ul><li>Прикасайтесь к лапам, ушам и хвосту с похвалой и лакомством.</li><li>Адаптируйте к звуку фена и машинки постепенно.</li><li>Тренируйте спокойную стойку на нескользкой поверхности.</li></ul><h2>Первый визит</h2><p>Рекомендуем формат «гигиена-знакомство»: без сложной модельной стрижки, с мягкой сушкой и короткой длительностью.</p><h2>После визита</h2><p>Закрепляйте позитив: похвала, прогулка, любимое лакомство.</p>`, author_id: masterIds[4], category: 'Услуги', read_time: '6 мин', image: '/pictures/Poodle (dwarf).jpg', published_at: new Date('2026-01-05'), created_by: adminId },
    { title: 'Гигиенический груминг: что входит и зачем он нужен', excerpt: 'Базовые процедуры, которые поддерживают здоровье кожи, ушей, лап и когтей у собак и кошек.', content: `<div class="rounded-2xl border border-[#4A90E2]/25 bg-gradient-to-r from-[#4A90E2]/10 to-transparent p-5"><p><strong>Иван Соколов</strong>: гигиенический груминг - это не про «красиво», а про «безопасно и комфортно».</p></div><h2>Что входит в процедуру</h2><ul><li>Гигиена интимной зоны и живота.</li><li>Обработка подушечек лап и межпальцевых промежутков.</li><li>Уход за зоной глаз и слезными дорожками.</li><li>Удаление лишней шерсти из ушей и деликатная чистка.</li><li>Стрижка и шлифовка когтей.</li></ul><h2>Почему это важно</h2><p>Регулярная профилактика снижает риск дерматитов, отитов, травм лап и дискомфорта в быту.</p><blockquote>Рекомендуемая частота: каждые 3-4 недели.</blockquote>`, author_id: masterIds[2], category: 'Услуги', read_time: '5 мин', image: '/pictures/‎Clipping claws.jpg', published_at: new Date('2026-01-08'), created_by: adminId },
    { title: 'Груминг кошек: особенности и мифы', excerpt: 'Разбираем мифы о стрижке кошек и объясняем, когда груминг действительно необходим.', content: `<div class="rounded-2xl border border-[#4A90E2]/25 bg-gradient-to-br from-[#4A90E2]/10 to-[#9EC3EF]/20 p-5"><p><strong>Елена Смирнова</strong>: кошачий груминг требует отдельного протокола, тишины и деликатной работы.</p></div><h2>Мифы и факты</h2><ul><li>Стрижка может быть безопасной при корректной технике и разумной длине.</li><li>Кошки действительно вылизываются, но этого не всегда достаточно для гигиены.</li><li>При колтунах, возрасте и ограниченной подвижности груминг необходим.</li></ul><h2>Когда показан груминг</h2><p>Колтуны, выраженная линька, проблемы с уходом в пожилом возрасте, рекомендации ветеринарного врача.</p><h2>Как мы работаем</h2><p>Отдельная зона, минимум шума, деликатная фиксация и короткая процедура с контролем стресса.</p>`, author_id: masterIds[3], category: 'Услуги', read_time: '6 мин', image: '/pictures/Cat grooming.jpg', published_at: new Date('2026-01-12'), created_by: adminId },
    { title: 'Стрижка йорка: стандарт породы и вариации', excerpt: 'От шоу-стандарта до удобных повседневных форм: как выбрать лучший вариант для йорка.', content: `<div class="rounded-2xl border border-[#4A90E2]/25 bg-gradient-to-r from-[#4A90E2]/10 to-transparent p-5"><p><strong>Анна Петрова</strong>: шерсть йорка требует регулярности - это ключ к красивому и здоровому виду.</p></div><h2>Основные форматы</h2><ul><li><strong>Show trim</strong> - длинная выставочная шерсть с ежедневным уходом.</li><li><strong>Puppy cut</strong> - практичный вариант для комфортной жизни.</li><li><strong>Asian style</strong> - акцент на декоративный силуэт и «игрушечный» образ.</li></ul><h2>Как часто приходить</h2><p>В среднем каждые 4-6 недель, чтобы поддерживать форму и здоровье шерсти.</p><h2>Распространенные сложности</h2><p>Колтуны за ушами, секущиеся концы и потеря блеска - решаются регулярной профилактикой и профессиональной косметикой.</p>`, author_id: masterIds[0], category: 'Услуги', read_time: '8 мин', image: '/pictures/Gallery services - Yorkshire Terrier haircut.jpg', published_at: new Date('2026-01-18'), created_by: adminId },
    { title: 'СПА-процедуры для собак: что это и кому подходит', excerpt: 'Озонирование, маски, кератин и уход за лапами: когда СПА реально полезно питомцу.', content: `<div class="rounded-2xl border border-[#4A90E2]/25 bg-gradient-to-br from-[#4A90E2]/10 to-[#9EC3EF]/20 p-5"><p><strong>Дмитрий Волков</strong>: СПА-процедуры в груминге - это оздоровление кожи и шерсти, а не просто «дополнительная опция».</p></div><h2>Что входит в СПА</h2><ul><li>Озонирование кожи и шерсти.</li><li>Кератиновое восстановление и уходовые маски.</li><li>Массаж и парафинотерапия лап.</li><li>Релакс-протокол для снижения стресса.</li></ul><h2>Кому особенно подходит</h2><p>Питомцам с сухой кожей, тусклой шерстью, сезонными проблемами и возрастными изменениями.</p><blockquote>Оптимальная частота: 1 раз в 2-3 месяца, при показаниях - чаще.</blockquote>`, author_id: masterIds[4], category: 'Услуги', read_time: '5 мин', image: '/pictures/Gallery services - Spa care for large breeds.jpg', published_at: new Date('2026-01-20'), created_by: adminId },
    { title: 'Экспресс-линька: помощь длинношёрстным породам', excerpt: 'Как работает экспресс-линька и почему она снижает количество шерсти дома на 70-90%.', content: `<div class="rounded-2xl border border-[#4A90E2]/25 bg-gradient-to-r from-[#4A90E2]/10 to-transparent p-5"><p><strong>Мария Иванова</strong>: экспресс-линька - это комплексная процедура с вымыванием и выдуванием созревшего подшерстка.</p></div><h2>Этапы процедуры</h2><ol><li>Предварительное вычесывание.</li><li>Глубокое очищение специальным шампунем.</li><li>Кондиционер для облегчения выхода подшерстка.</li><li>Сушка мощным компрессором.</li><li>Финишная проработка инструментами.</li></ol><h2>Результат</h2><p>Меньше шерсти в доме, более чистая кожа, выраженный блеск и снижение запаха «псины».</p><h2>Кому рекомендовано</h2><p>Шпицам, хаски, овчаркам, ретриверам, корги и другим породам с плотным подшерстком.</p>`, author_id: masterIds[1], category: 'Услуги', read_time: '6 мин', image: '/pictures/Express molting for long-haired dogs.jpg', published_at: new Date('2026-01-22'), created_by: adminId },
    { title: 'Работа с агрессивными питомцами: как мы это делаем', excerpt: 'Безопасный протокол работы со «сложными» питомцами без излишнего стресса.', content: `<div class="rounded-2xl border border-[#4A90E2]/25 bg-gradient-to-br from-[#4A90E2]/10 to-[#9EC3EF]/20 p-5"><p><strong>Ольга Козлова</strong>: в большинстве случаев агрессия - это реакция страха, а не «плохой характер».</p></div><h2>Наш протокол</h2><ul><li>Подробный анамнез перед записью.</li><li>Увеличенное время на процедуру.</li><li>Постепенное привыкание к инструментам.</li><li>Работа в паре с ассистентом и паузы на отдых.</li><li>Фокус на безопасности питомца и мастера.</li></ul><h2>Почему есть доплата</h2><p>Такие визиты занимают больше времени, требуют повышенной концентрации и специального подхода.</p><h2>Когда нужна консультация ветеринара</h2><p>Если реакция появилась резко или привязана к конкретной зоне, важно исключить боль и медицинские причины.</p>`, author_id: masterIds[5], category: 'Услуги', read_time: '4 мин', image: '/pictures/Aggression.jpg', published_at: new Date('2026-01-25'), created_by: adminId },
    // Курсы
    { title: 'С чего начать обучение грумингу', excerpt: 'Первый шаг в профессию: выбор курса и формата обучения.', content: '<p>Онлайн, офлайн или гибрид — плюсы и минусы. Базовый курс для начинающих.</p>', author_id: masterIds[0], category: 'Курсы', read_time: '6 мин', image: '/pictures/The basics of dog grooming.jpg', published_at: new Date('2026-01-14'), created_by: adminId },
    { title: 'Практика на курсах: как устроены занятия', excerpt: 'Как проходят практические занятия и работа с моделями.', content: '<p>Расписание, модели (собаки/кошки), отработка техник и обратная связь от преподавателей.</p>', author_id: masterIds[1], category: 'Курсы', read_time: '5 мин', image: '/pictures/Gallery courses - Practical lesson.jpg', published_at: new Date('2026-01-16'), created_by: adminId },
    { title: 'Выставочный груминг: тонкости подготовки', excerpt: 'Как готовить собаку к выставке: стрижка, укладка, психология.', content: '<p>Специфика выставочного груминга и чему учат на курсе.</p>', author_id: masterIds[2], category: 'Курсы', read_time: '7 мин', image: '/pictures/Exhibition grooming.jpg', published_at: new Date('2026-01-11'), created_by: adminId },
    { title: 'Креативный груминг: от идеи до результата', excerpt: 'Как создают дизайнерские стрижки и окрашивания.', content: '<p>Идеи, эскизы, инструменты и краски. Курс для тех, кто хочет выделяться.</p>', author_id: masterIds[2], category: 'Курсы', read_time: '6 мин', image: '/pictures/Creative grooming.jpg', published_at: new Date('2026-01-19'), created_by: adminId },
    { title: 'Груминг кошек: курс для специалистов', excerpt: 'Чему учат на курсе по грумингу кошек и кому он подойдёт.', content: '<p>Особенности работы с кошками, породы, стресс-менеджмент.</p>', author_id: masterIds[3], category: 'Курсы', read_time: '5 мин', image: '/pictures/Cat grooming.jpg', published_at: new Date('2026-01-21'), created_by: adminId },
    { title: 'Сертификат и трудоустройство после курсов', excerpt: 'Какие документы вы получите и как мы помогаем с трудоустройством.', content: '<p>Сертификат MARS GROOM, вакансии партнёров и стажировки.</p>', author_id: masterIds[0], category: 'Курсы', read_time: '4 мин', image: '/pictures/Gallery courses - Graduation day.jpg', published_at: new Date('2026-01-23'), created_by: adminId },
    { title: 'Работа с инструментами: теория и практика', excerpt: 'Обзор инструментов на курсе и как ими пользоваться.', content: '<p>Ножницы, машинки, колтунорезы и другое оборудование в учебном классе.</p>', author_id: masterIds[4], category: 'Курсы', read_time: '6 мин', image: '/pictures/Gallery courses - Working with tools.jpg', published_at: new Date('2026-01-26'), created_by: adminId },
    { title: 'Мастер-классы от приглашённых экспертов', excerpt: 'Как проходят мастер-классы и кто к нам приезжает.', content: '<p>Формат мастер-классов и темы от экспертов индустрии.</p>', author_id: masterIds[5], category: 'Курсы', read_time: '4 мин', image: '/pictures/Gallery courses - Master class.jpg', published_at: new Date('2026-01-28'), created_by: adminId },
  ];
  await knex('blog_posts').insert(blogPostsData);

  // faq_items
  await knex('faq_items').del();
  await knex('faq_items').insert(FAQ_MOCK.map((f) => ({ ...f, created_by: adminId })));

  // library_articles (общий бесплатный доступ; после записи на курс добавляются материалы из модулей курсов)
  await knex('library_articles').del();
  await knex('library_articles').insert([
    { title: 'Стандарты стрижки йоркширского терьера', slug: 'york-standard', excerpt: 'Описание стандарта породы для груминга.', content: '<p>Полный текст статьи о стандартах стрижки йорка.</p>', category: 'Собаки', image: '/pictures/Yorkshire Terrier (York).jpg', created_by: adminId },
    { title: 'Уход за длинной шерстью', slug: 'long-coat-care', excerpt: 'Как ухаживать за длинношёрстными породами.', content: '<p>Полный текст об уходе за длинной шерстью.</p>', category: 'Уход', image: '/pictures/Golden Retriever.jpg', created_by: adminId },
    { title: 'Основы груминга для начинающих', slug: 'basics-grooming', excerpt: 'От выбора инструментов до первых стрижек.', content: '<p>Руководство по основам груминга.</p>', category: 'basics', image: '/pictures/The basics of dog grooming.jpg', created_by: adminId },
    { title: 'Техники стрижки: от базовых до профессиональных', slug: 'techniques-cutting', excerpt: 'Базовые и продвинутые методы работы с шерстью.', content: '<p>Обзор техник стрижки.</p>', category: 'techniques', image: '/pictures/Professional grooming.jpg', created_by: adminId },
    { title: 'Здоровье питомцев во время груминга', slug: 'health-grooming', excerpt: 'Безопасность и здоровье питомца во время процедур.', content: '<p>Важная информация о здоровье во время груминга.</p>', category: 'health', image: '/pictures/Cat grooming.jpg', created_by: adminId },
    { title: 'Глоссарий терминов груминга', slug: 'glossary', excerpt: 'Словарь терминов и понятий в груминге.', content: '<p>Полный глоссарий терминов.</p>', category: 'basics', image: null, created_by: adminId },
  ]);

  // education_org_info
  await knex('education_org_info').del();
  await knex('education_org_info').insert([
    { org_name: 'MARS GROOM', license_number: 'ЛО-77-01-012345', inn: '7707123456', ogrn: '1157746123456', address: 'г. Владимир, просп. Ленина, 42', phone: '+7 (995) 020-50-13', email: 'mars-groom@yandex.ru', description: 'Образовательная деятельность в сфере груминга.', created_by: adminId },
  ]);

  // documents
  await knex('documents').del();
  await knex('documents').insert([
    { title: 'Политика конфиденциальности', slug: 'privacy', content: '<p>Текст политики...</p>', type: 'privacy_policy', file_path: null, is_active: true, sort_order: 1, created_by: adminId },
    { title: 'Пользовательское соглашение', slug: 'terms', content: '<p>Текст соглашения...</p>', type: 'terms', file_path: null, is_active: true, sort_order: 2, created_by: adminId },
  ]);

  // contacts
  await knex('contacts').del();
  await knex('contacts').insert([
    { type: 'phone', label: 'Телефон', value: '+7 (995) 020-50-13', icon: 'phone', sort_order: 1, is_active: true, created_by: adminId },
    { type: 'email', label: 'Email', value: 'mars-groom@yandex.ru', icon: 'mail', sort_order: 2, is_active: true, created_by: adminId },
    { type: 'address', label: 'Адрес', value: 'г. Владимир, просп. Ленина, 42', icon: 'map-pin', sort_order: 3, is_active: true, created_by: adminId },
  ]);

  // gallery_items (привязка к мастерам/услугам/курсам)
  await knex('gallery_items').del();
  const galleryInserts = [
    { title: 'Стрижка шпица', description: 'Работа Анны Петровой', image: '/pictures/Gallery courses - Graduation day.jpg', category: 'services', master_id: masterIds[0], service_id: serviceIds[3], course_id: null, sort_order: 1, is_featured: true, created_by: adminId },
    { title: 'Выставочный груминг', description: 'Пудель', image: '/pictures/Exhibition grooming.jpg', category: 'courses', master_id: masterIds[2], service_id: null, course_id: courseIds[2], sort_order: 2, is_featured: false, created_by: adminId },
  ];
  await knex('gallery_items').insert(galleryInserts);

  // groomer_portfolio (портфолио мастеров)
  await knex('groomer_portfolio').del();
  await knex('groomer_portfolio').insert([
    { master_id: masterIds[0], title: 'Стрижка шпица', description: 'Йорк-стрижка', image: '/pictures/Yorkshire Terrier (York).jpg', service_id: serviceIds[0], breed: 'Шпиц', work_date: '2026-01-10', is_featured: true, sort_order: 1, created_by: adminId },
    { master_id: masterIds[0], title: 'Креативная стрижка пуделя', description: null, image: '/pictures/Creative grooming.jpg', service_id: serviceIds[2], breed: 'Пудель', work_date: '2026-01-05', is_featured: false, sort_order: 2, created_by: adminId },
    { master_id: masterIds[1], title: 'Лабрадор', description: 'Полный груминг', image: '/pictures/Labrador Retriever.jpg', service_id: serviceIds[4], breed: 'Лабрадор', work_date: '2026-01-08', is_featured: true, sort_order: 1, created_by: adminId },
  ]);

  // notifications
  await knex('notifications').del();
  await knex('notifications').insert([
    { user_id: clientIds[0], type: 'reminder', title: 'Напоминание о визите', body: 'Барсик записан на 5 февраля, 10:00.', read_at: null, created_by: adminId },
    { user_id: clientIds[0], type: 'promo', title: 'Скидка 10%', body: 'До конца месяца скидка на гигиенический уход.', read_at: new Date(), created_by: adminId },
  ]);

  // master_schedules (расписание мастеров по дням)
  await knex('master_schedules').del();
  for (const mid of masterIds.slice(0, 3)) {
    for (let d = 1; d <= 5; d++) {
      await knex('master_schedules').insert({ master_id: mid, day_of_week: d, start_time: '09:00', end_time: '18:00', is_available: true, date_override: null, created_by: adminId });
    }
  }

  // course_quiz_questions, course_quiz_options, course_quiz_answers
  await knex('course_quiz_answers').del();
  await knex('course_quiz_options').del();
  await knex('course_quiz_questions').del();
  await knex('course_quiz_questions').insert([
    { question: 'Какой тип шерсти у вашего питомца?', type: 'single', sort_order: 1, created_by: adminId },
    { question: 'Какой результат вы хотите?', type: 'single', sort_order: 2, created_by: adminId },
  ]);
  const qIds = (await knex('course_quiz_questions').select('id').orderBy('id')).map((r) => r.id);
  await knex('course_quiz_options').insert([
    { question_id: qIds[0], option_text: 'Длинная', points: 10, sort_order: 1, created_by: adminId },
    { question_id: qIds[0], option_text: 'Короткая', points: 5, sort_order: 2, created_by: adminId },
    { question_id: qIds[1], option_text: 'Гигиеническая стрижка', points: 5, sort_order: 1, created_by: adminId },
    { question_id: qIds[1], option_text: 'Модельная', points: 10, sort_order: 2, created_by: adminId },
  ]);
  const optIds = (await knex('course_quiz_options').select('id').orderBy('id')).map((r) => r.id);
  await knex('course_quiz_answers').insert([
    { user_id: clientIds[0], question_id: qIds[0], option_id: optIds[0], created_by: clientIds[0] },
    { user_id: clientIds[0], question_id: qIds[1], option_id: optIds[2], created_by: clientIds[0] },
  ]);

  // course_modules, course_content
  await knex('course_content').del();
  await knex('course_modules').del();
  await knex('course_modules').insert([
    { course_id: courseIds[0], title: 'Введение в груминг', description: 'Основы', sort_order: 1, created_by: adminId },
    { course_id: courseIds[0], title: 'Практика', description: 'Стрижка на моделях', sort_order: 2, created_by: adminId },
  ]);
  const modIds = (await knex('course_modules').select('id').orderBy('id')).map((r) => r.id);
  await knex('course_content').insert([
    { module_id: modIds[0], title: 'Лекция 1', type: 'article', content: 'Текст лекции...', file_path: null, duration_minutes: null, sort_order: 1, is_required: true, created_by: adminId },
    { module_id: modIds[0], title: 'Видео: инструменты', type: 'video', content: null, file_path: '/videos/tools.mp4', duration_minutes: 15, sort_order: 2, is_required: true, created_by: adminId },
  ]);
  const contentIds = (await knex('course_content').select('id').orderBy('id')).map((r) => r.id);

  // user_course_progress (course_booking_id должен ссылаться на существующую запись)
  await knex('user_course_progress').del();
  await knex('user_course_progress').insert([
    { user_id: clientIds[0], course_id: courseIds[0], course_booking_id: courseBookingIds[0], module_id: modIds[0], content_id: contentIds[0], is_completed: true, progress_percent: 50, completed_at: new Date(), created_by: clientIds[0] },
  ]);

  // messages (чат между пользователями)
  await knex('messages').del();
  await knex('messages').insert([
    { sender_id: adminId, recipient_id: groomerIds[0], message: 'Здравствуйте! Напоминаем о записи завтра в 10:00.', is_read: false, read_at: null, type: 'chat', created_by: adminId },
    { sender_id: groomerIds[0], recipient_id: adminId, message: 'Спасибо, буду.', is_read: true, read_at: new Date(), type: 'chat', created_by: groomerIds[0] },
  ]);

  // sms_campaigns, sms_recipients
  await knex('sms_recipients').del();
  await knex('sms_campaigns').del();
  await knex('sms_campaigns').insert([
    { title: 'Акция январь', message: 'Скидка 10% на первый визит!', status: 'draft', scheduled_at: null, total_recipients: 0, sent_count: 0, failed_count: 0, created_by: adminId },
  ]);
  const campId = (await knex('sms_campaigns').select('id').first()).id;
  await knex('sms_recipients').insert([
    { campaign_id: campId, user_id: clientIds[0], phone: '+7 (999) 222-22-01', status: 'pending', sent_at: null, error_message: null, created_by: adminId },
  ]);

  // warehouse_items, warehouse_transactions
  await knex('warehouse_transactions').del();
  await knex('warehouse_items').del();
  await knex('warehouse_items').insert([
    { name: 'Шампунь для длинношёрстных', sku: 'SH-001', category: 'consumables', description: '500 мл', quantity: 20, unit: 'шт', price: 450, min_stock: 5, supplier: 'Поставщик Х', created_by: adminId },
    { name: 'Ножницы прямые', sku: 'SC-001', category: 'tools', description: null, quantity: 8, unit: 'шт', price: 2500, min_stock: 2, supplier: null, created_by: adminId },
  ]);
  const itemIds = (await knex('warehouse_items').select('id').orderBy('id')).map((r) => r.id);
  await knex('warehouse_transactions').insert([
    { item_id: itemIds[0], type: 'in', quantity: 20, notes: 'Поставка', related_booking_id: null, created_by: adminId },
    { item_id: itemIds[0], type: 'out', quantity: 2, notes: 'Расход на процедуру', related_booking_id: bookingIds[0], created_by: adminId },
  ]);

  // financial_transactions
  await knex('financial_transactions').del();
  await knex('financial_transactions').insert([
    { type: 'income', amount: 1400, category: 'service', description: 'Стрижка йорка', service_booking_id: bookingIds[0], course_booking_id: null, master_id: masterIds[0], transaction_date: '2026-01-05', payment_method: 'card', created_by: adminId },
    { type: 'income', amount: 35000, category: 'course', description: 'Оплата курса', service_booking_id: null, course_booking_id: courseBookingIds[0], master_id: null, transaction_date: '2026-01-03', payment_method: 'online', created_by: adminId },
  ]);

  // reports
  await knex('reports').del();
  await knex('reports').insert([
    { title: 'Выручка за январь 2026', type: 'revenue', period_start: '2026-01-01', period_end: '2026-01-31', data: JSON.stringify({ total: 36400, byCategory: { service: 1400, course: 35000 } }), file_path: null, created_by: adminId },
  ]);
};
