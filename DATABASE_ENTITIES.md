# MARS GROOM — Описание сущностей базы данных

## Общая информация

База данных PostgreSQL для груминг-салона MARS GROOM, включающая функционал услуг груминга и образовательных курсов.

**Общие поля для всех таблиц:**
- `id` (integer, primary key, auto-increment) — уникальный идентификатор
- `created_at` (timestamp) — дата и время создания записи
- `updated_at` (timestamp) — дата и время последнего обновления
- `created_by` (integer, nullable, FK → `users.id`) — идентификатор пользователя, создавшего запись

---

## 1. Пользователи (users)

**Назначение:** Хранение данных всех пользователей системы (клиенты, грумеры, администраторы).

**Поля:**
- `id` — уникальный идентификатор
- `email` (string, 255, unique, not null) — электронная почта (логин)
- `password_hash` (string, 255, nullable) — хеш пароля (bcrypt)
- `name` (string, 255, not null) — имя пользователя
- `phone` (string, 50, nullable) — номер телефона
- `role` (string, 50, not null, default: 'client') — роль: `client`, `groomer`, `admin`
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `created_by` → `users.id` (self-reference, nullable)
- Связана с: `masters.user_id`, `pets.user_id`, `service_bookings.user_id`, `course_bookings.user_id`, `reviews.user_id`, `favorite_services.user_id`, `favorite_courses.user_id`, `loyalty_accounts.user_id`, `notifications.user_id`, и др.

---

## 2. Мастера (masters)

**Назначение:** Профили грумеров/преподавателей курсов.

**Поля:**
- `id` — уникальный идентификатор
- `user_id` (integer, nullable, FK → `users.id`, onDelete: SET NULL) — связь с аккаунтом пользователя
- `full_name` (string, 255, not null) — полное имя мастера
- `phone` (string, 50, nullable) — контактный телефон
- `experience` (integer, nullable) — опыт работы (в годах)
- `specialization` (text, nullable) — специализация
- `rating` (decimal, 3, 2, nullable) — рейтинг мастера
- `image` (string, 500, nullable) — путь к фотографии
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `user_id` → `users.id`
- Связана с: `master_services.master_id`, `course_instructors.master_id`, `service_bookings.master_id`, `course_bookings.master_id`, `visits.master_id`, `reviews.master_id`, `blog_posts.author_id`

---

## 3. Услуги (services)

**Назначение:** Каталог услуг груминга (стрижки, купание, маникюр и т.д.).

**Поля:**
- `id` — уникальный идентификатор
- `name` (string, 500, not null) — название услуги
- `category` (string, 50, not null) — категория: `dogs`, `cats`, `other`
- `type` (string, 50, not null) — тип: `grooming`, `bathing`, `nail`, `extra`
- `price` (integer, not null) — цена в рублях
- `duration` (string, 100, nullable) — продолжительность (например, "1-2 часа")
- `description` (text, nullable) — описание услуги
- `image` (string, 500, nullable) — путь к изображению
- `breed` (string, 255, nullable) — порода (если услуга специфична для породы)
- `price_range` (string, 100, nullable) — диапазон цен (если цена варьируется)
- `created_at`, `updated_at`, `created_by`

**Связи:**
- Связана с: `master_services.service_id`, `service_bookings.service_id`, `visits.service_id`, `reviews.service_id`, `favorite_services.service_id`

---

## 4. Курсы (courses)

**Назначение:** Каталог образовательных курсов по грумингу.

**Поля:**
- `id` — уникальный идентификатор
- `name` (string, 500, not null) — название курса
- `level` (string, 50, not null) — уровень: `beginner`, `advanced`
- `format` (string, 50, not null) — формат: `online`, `offline`, `hybrid`
- `duration` (string, 100, nullable) — продолжительность курса
- `price` (integer, not null) — цена в рублях
- `description` (text, nullable) — описание курса
- `image` (string, 500, nullable) — путь к изображению
- `created_at`, `updated_at`, `created_by`

**Связи:**
- Связана с: `course_schedules.course_id`, `course_instructors.course_id`, `course_bookings.course_id`, `reviews.course_id`, `favorite_courses.course_id`

---

## 5. Расписание курсов (course_schedules)

**Назначение:** Расписание ближайших стартов курсов.

**Поля:**
- `id` — уникальный идентификатор
- `course_id` (integer, not null, FK → `courses.id`, onDelete: CASCADE) — идентификатор курса
- `start_date` (date, not null) — дата начала
- `start_time` (time, nullable) — время начала
- `spots` (integer, default: 12) — количество мест
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `course_id` → `courses.id`
- Связана с: `course_bookings.course_schedule_id`

---

## 6. Связь мастер–услуга (master_services)

**Назначение:** Многие-ко-многим: какие мастера предоставляют какие услуги.

**Поля:**
- `id` — уникальный идентификатор
- `master_id` (integer, not null, FK → `masters.id`, onDelete: CASCADE) — идентификатор мастера
- `service_id` (integer, not null, FK → `services.id`, onDelete: CASCADE) — идентификатор услуги
- `created_at`, `updated_at`, `created_by`
- **Уникальное ограничение:** `(master_id, service_id)`

**Связи:**
- `master_id` → `masters.id`
- `service_id` → `services.id`

---

## 7. Связь курс–преподаватель (course_instructors)

**Назначение:** Многие-ко-многим: какие мастера преподают какие курсы.

**Поля:**
- `id` — уникальный идентификатор
- `course_id` (integer, not null, FK → `courses.id`, onDelete: CASCADE) — идентификатор курса
- `master_id` (integer, not null, FK → `masters.id`, onDelete: CASCADE) — идентификатор мастера
- `created_at`, `updated_at`, `created_by`
- **Уникальное ограничение:** `(course_id, master_id)`

**Связи:**
- `course_id` → `courses.id`
- `master_id` → `masters.id`

---

## 8. Питомцы (pets)

**Назначение:** Профили питомцев клиентов.

**Поля:**
- `id` — уникальный идентификатор
- `user_id` (integer, not null, FK → `users.id`, onDelete: CASCADE) — владелец питомца
- `name` (string, 255, not null) — кличка питомца
- `breed` (string, 255, nullable) — порода
- `age` (integer, nullable) — возраст (в годах)
- `photo` (string, 500, nullable) — путь к фотографии
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `user_id` → `users.id`
- Связана с: `service_bookings.pet_id`, `visits.pet_id`, `pet_mood_entries.pet_id`, `pet_observations.pet_id`

---

## 9. Записи на услуги (service_bookings)

**Назначение:** Записи клиентов на услуги груминга.

**Поля:**
- `id` — уникальный идентификатор
- `user_id` (integer, not null, FK → `users.id`, onDelete: CASCADE) — клиент
- `service_id` (integer, not null, FK → `services.id`, onDelete: RESTRICT) — услуга
- `master_id` (integer, nullable, FK → `masters.id`, onDelete: SET NULL) — выбранный мастер
- `pet_id` (integer, nullable, FK → `pets.id`, onDelete: SET NULL) — питомец
- `scheduled_at` (timestamp, not null) — запланированное время визита
- `status` (string, 50, not null, default: 'pending') — статус: `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`, `postponed`
- `contact_method` (string, 100, default: 'по звонку') — способ связи
- `notes` (text, nullable) — дополнительные заметки
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `user_id` → `users.id`
- `service_id` → `services.id`
- `master_id` → `masters.id`
- `pet_id` → `pets.id`
- Связана с: `visits.service_booking_id`

---

## 10. Записи на курсы (course_bookings)

**Назначение:** Записи клиентов на образовательные курсы.

**Поля:**
- `id` — уникальный идентификатор
- `user_id` (integer, not null, FK → `users.id`, onDelete: CASCADE) — клиент
- `course_id` (integer, not null, FK → `courses.id`, onDelete: RESTRICT) — курс
- `course_schedule_id` (integer, nullable, FK → `course_schedules.id`, onDelete: SET NULL) — выбранное расписание
- `master_id` (integer, nullable, FK → `masters.id`, onDelete: SET NULL) — преподаватель
- `status` (string, 50, not null, default: 'pending') — статус записи
- `notes` (text, nullable) — дополнительные заметки
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `user_id` → `users.id`
- `course_id` → `courses.id`
- `course_schedule_id` → `course_schedules.id`
- `master_id` → `masters.id`

---

## 11. Визиты (visits)

**Назначение:** История визитов питомцев в салон (после завершения записи).

**Поля:**
- `id` — уникальный идентификатор
- `pet_id` (integer, not null, FK → `pets.id`, onDelete: CASCADE) — питомец
- `service_booking_id` (integer, nullable, FK → `service_bookings.id`, onDelete: SET NULL) — связанная запись
- `service_id` (integer, not null, FK → `services.id`, onDelete: RESTRICT) — оказанная услуга
- `master_id` (integer, nullable, FK → `masters.id`, onDelete: SET NULL) — мастер
- `visit_date` (date, not null) — дата визита
- `notes` (text, nullable) — заметки о визите
- `weight` (string, 50, nullable) — вес питомца
- `health_status` (string, 100, nullable) — состояние здоровья
- `recommendations` (text, nullable) — рекомендации мастера
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `pet_id` → `pets.id`
- `service_booking_id` → `service_bookings.id`
- `service_id` → `services.id`
- `master_id` → `masters.id`

---

## 12. Отзывы (reviews)

**Назначение:** Отзывы клиентов об услугах, курсах и мастерах.

**Поля:**
- `id` — уникальный идентификатор
- `user_id` (integer, nullable, FK → `users.id`, onDelete: SET NULL) — автор отзыва
- `service_id` (integer, nullable, FK → `services.id`, onDelete: SET NULL) — услуга (если отзыв об услуге)
- `course_id` (integer, nullable, FK → `courses.id`, onDelete: SET NULL) — курс (если отзыв о курсе)
- `master_id` (integer, nullable, FK → `masters.id`, onDelete: SET NULL) — мастер (если отзыв о мастере)
- `rating` (integer, not null) — оценка (1-5)
- `text` (text, not null) — текст отзыва
- `pet_name` (string, 255, nullable) — кличка питомца (для контекста)
- `type` (string, 50, not null) — тип: `service`, `course`
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `user_id` → `users.id`
- `service_id` → `services.id`
- `course_id` → `courses.id`
- `master_id` → `masters.id`

**Примечание:** Один отзыв может относиться к услуге/курсу и/или мастеру.

---

## 13. Избранные услуги (favorite_services)

**Назначение:** Список избранных услуг для каждого пользователя.

**Поля:**
- `id` — уникальный идентификатор
- `user_id` (integer, not null, FK → `users.id`, onDelete: CASCADE) — пользователь
- `service_id` (integer, not null, FK → `services.id`, onDelete: CASCADE) — услуга
- `created_at`, `updated_at`, `created_by`
- **Уникальное ограничение:** `(user_id, service_id)`

**Связи:**
- `user_id` → `users.id`
- `service_id` → `services.id`

---

## 14. Избранные курсы (favorite_courses)

**Назначение:** Список избранных курсов для каждого пользователя.

**Поля:**
- `id` — уникальный идентификатор
- `user_id` (integer, not null, FK → `users.id`, onDelete: CASCADE) — пользователь
- `course_id` (integer, not null, FK → `courses.id`, onDelete: CASCADE) — курс
- `created_at`, `updated_at`, `created_by`
- **Уникальное ограничение:** `(user_id, course_id)`

**Связи:**
- `user_id` → `users.id`
- `course_id` → `courses.id`

---

## 15. Лояльность (loyalty_accounts)

**Назначение:** Система лояльности "Лапки" — накопление баллов клиентами.

**Поля:**
- `id` — уникальный идентификатор
- `user_id` (integer, not null, FK → `users.id`, onDelete: CASCADE, unique) — пользователь (один аккаунт на пользователя)
- `points` (integer, not null, default: 0) — текущее количество баллов
- `total_earned` (integer, not null, default: 0) — всего заработано баллов за всё время
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `user_id` → `users.id` (unique)

**Бизнес-логика:** 1 лапка = 100₽ потраченных. 100 лапок = 15% скидка.

---

## 16. Дневник настроения (pet_mood_entries)

**Назначение:** Записи о настроении питомца (дневник настроения в ЛК клиента).

**Поля:**
- `id` — уникальный идентификатор
- `pet_id` (integer, not null, FK → `pets.id`, onDelete: CASCADE) — питомец
- `user_id` (integer, not null, FK → `users.id`, onDelete: CASCADE) — владелец
- `mood` (string, 100, not null) — настроение (например, "радостный", "грустный", "спокойный")
- `note` (text, nullable) — заметка
- `entry_date` (date, not null) — дата записи
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `pet_id` → `pets.id`
- `user_id` → `users.id`

---

## 17. Наблюдения за питомцем (pet_observations)

**Назначение:** Заметки владельца о состоянии питомца (часть "Дневника питомца").

**Поля:**
- `id` — уникальный идентификатор
- `pet_id` (integer, not null, FK → `pets.id`, onDelete: CASCADE) — питомец
- `user_id` (integer, not null, FK → `users.id`, onDelete: CASCADE) — владелец
- `text` (text, not null) — текст наблюдения
- `type` (string, 50, not null) — тип: `concern` (беспокойство), `positive` (положительное)
- `observation_date` (date, not null) — дата наблюдения
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `pet_id` → `pets.id`
- `user_id` → `users.id`

---

## 18. Заявки приютов (shelter_applications)

**Назначение:** Заявки от приютов и питомников на услуги груминга (страница "Для приютов").

**Поля:**
- `id` — уникальный идентификатор
- `org_name` (string, 500, not null) — название организации
- `inn` (string, 50, nullable) — ИНН
- `kpp` (string, 50, nullable) — КПП
- `contact_name` (string, 255, not null) — контактное лицо
- `phone` (string, 50, not null) — телефон
- `email` (string, 255, not null) — электронная почта
- `message` (text, nullable) — сообщение
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `created_by` → `users.id` (nullable, если заявка от неавторизованного пользователя)

---

## 19. Заявки на аренду зоны (zone_rental_applications)

**Назначение:** Заявки на аренду профессиональной зоны (страница "Аренда профессиональной зоны").

**Поля:**
- `id` — уникальный идентификатор
- `user_id` (integer, nullable, FK → `users.id`, onDelete: SET NULL) — пользователь (если авторизован)
- `name` (string, 255, not null) — имя заявителя
- `phone` (string, 50, not null) — телефон
- `email` (string, 255, not null) — электронная почта
- `hours` (integer, not null) — количество часов аренды
- `message` (text, nullable) — сообщение
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `user_id` → `users.id` (nullable)

---

## 20. Заявки/лиды (leads)

**Назначение:** Лиды из форм обратной связи, записей и других источников.

**Поля:**
- `id` — уникальный идентификатор
- `name` (string, 255, not null) — имя
- `email` (string, 255, not null) — электронная почта
- `phone` (string, 50, nullable) — телефон
- `source` (string, 100, nullable) — источник: `contact_form`, `booking`, и др.
- `status` (string, 50, not null, default: 'new') — статус лида
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `created_by` → `users.id` (nullable)

---

## 21. Задачи «позвонить» (lead_call_tasks)

**Назначение:** Задачи администраторам позвонить по лидам (Kanban-доска в ЛК админа).

**Поля:**
- `id` — уникальный идентификатор
- `lead_id` (integer, not null, FK → `leads.id`, onDelete: CASCADE) — связанный лид
- `assignee_id` (integer, nullable, FK → `users.id`, onDelete: SET NULL) — назначенный администратор
- `status` (string, 50, not null, default: 'pending') — статус: `pending`, `done`
- `due_date` (date, nullable) — срок выполнения
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `lead_id` → `leads.id`
- `assignee_id` → `users.id`

---

## 22. Статьи блога (blog_posts)

**Назначение:** Статьи блога о груминге, уходе за питомцами и т.д.

**Поля:**
- `id` — уникальный идентификатор
- `title` (string, 500, not null) — заголовок статьи
- `excerpt` (text, nullable) — краткое описание
- `content` (text, nullable) — полный текст статьи
- `author_id` (integer, nullable, FK → `masters.id`, onDelete: SET NULL) — автор (мастер)
- `category` (string, 100, nullable) — категория статьи
- `read_time` (string, 50, nullable) — время чтения (например, "5 мин")
- `image` (string, 500, nullable) — путь к изображению
- `published_at` (timestamp, nullable) — дата публикации
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `author_id` → `masters.id`

---

## 23. FAQ (faq_items)

**Назначение:** Часто задаваемые вопросы и ответы.

**Поля:**
- `id` — уникальный идентификатор
- `question` (text, not null) — вопрос
- `answer` (text, not null) — ответ
- `category` (string, 100, nullable) — категория FAQ
- `sort_order` (integer, default: 0) — порядок сортировки
- `created_at`, `updated_at`, `created_by`

---

## 24. Библиотека знаний (library_articles)

**Назначение:** Статьи библиотеки знаний (раздел "Библиотека" в курсах).

**Поля:**
- `id` — уникальный идентификатор
- `title` (string, 500, not null) — заголовок статьи
- `slug` (string, 500, not null, unique) — URL-слаг статьи
- `excerpt` (text, nullable) — краткое описание
- `content` (text, nullable) — полный текст
- `category` (string, 100, nullable) — категория
- `image` (string, 500, nullable) — путь к изображению
- `created_at`, `updated_at`, `created_by`

---

## 25. Уведомления (notifications)

**Назначение:** Уведомления для пользователей (в ЛК клиента, грумера, админа).

**Поля:**
- `id` — уникальный идентификатор
- `user_id` (integer, not null, FK → `users.id`, onDelete: CASCADE) — получатель уведомления
- `type` (string, 100, not null) — тип уведомления
- `title` (string, 500, nullable) — заголовок
- `body` (text, nullable) — текст уведомления
- `read_at` (timestamp, nullable) — дата прочтения (null = не прочитано)
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `user_id` → `users.id`

---

## 26. Расписание грумеров (master_schedules)

**Назначение:** Рабочее расписание грумеров (дни недели, часы работы, особые даты).

**Поля:**
- `id` — уникальный идентификатор
- `master_id` (integer, not null, FK → `masters.id`, onDelete: CASCADE) — грумер
- `day_of_week` (integer, not null) — день недели: 0 (понедельник) — 6 (воскресенье)
- `start_time` (time, not null) — время начала работы
- `end_time` (time, not null) — время окончания работы
- `is_available` (boolean, default: true) — доступен ли в этот день
- `date_override` (date, nullable) — особая дата (праздник, отпуск, переработка)
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `master_id` → `masters.id`

---

## 27. Галерея (gallery_items)

**Назначение:** Фотографии работ, до/после, галерея услуг и курсов.

**Поля:**
- `id` — уникальный идентификатор
- `title` (string, 500, nullable) — заголовок
- `description` (text, nullable) — описание
- `image` (string, 500, not null) — путь к изображению
- `category` (string, 100, nullable) — категория: `services`, `courses`, `before_after`, и др.
- `master_id` (integer, nullable, FK → `masters.id`, onDelete: SET NULL) — мастер (если фото его работы)
- `service_id` (integer, nullable, FK → `services.id`, onDelete: SET NULL) — услуга
- `course_id` (integer, nullable, FK → `courses.id`, onDelete: SET NULL) — курс
- `sort_order` (integer, default: 0) — порядок сортировки
- `is_featured` (boolean, default: false) — избранное фото
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `master_id` → `masters.id`
- `service_id` → `services.id`
- `course_id` → `courses.id`

---

## 28. Документы (documents)

**Назначение:** Документы сайта (политика конфиденциальности, договоры, условия использования).

**Поля:**
- `id` — уникальный идентификатор
- `title` (string, 500, not null) — заголовок документа
- `slug` (string, 500, not null, unique) — URL-слаг
- `content` (text, nullable) — содержимое документа (HTML)
- `type` (string, 100, not null) — тип: `privacy_policy`, `terms`, `contract`, и др.
- `file_path` (string, 500, nullable) — путь к PDF файлу (если документ в виде файла)
- `is_active` (boolean, default: true) — активен ли документ
- `sort_order` (integer, default: 0) — порядок сортировки
- `created_at`, `updated_at`, `created_by`

---

## 29. Контакты (contacts)

**Назначение:** Контактная информация для футера и страниц (адреса, телефоны, email, соцсети).

**Поля:**
- `id` — уникальный идентификатор
- `type` (string, 100, not null) — тип: `address`, `phone`, `email`, `social`
- `label` (string, 255, nullable) — метка ("Главный офис", "WhatsApp", "Instagram")
- `value` (string, 500, not null) — значение контакта
- `icon` (string, 100, nullable) — название иконки (для отображения)
- `sort_order` (integer, default: 0) — порядок сортировки
- `is_active` (boolean, default: true) — активен ли контакт
- `created_at`, `updated_at`, `created_by`

---

## 30. Вопросы теста курсов (course_quiz_questions)

**Назначение:** Вопросы теста для подбора подходящего курса.

**Поля:**
- `id` — уникальный идентификатор
- `question` (text, not null) — текст вопроса
- `type` (string, 50, not null, default: 'single') — тип: `single` (один ответ), `multiple` (несколько)
- `sort_order` (integer, default: 0) — порядок вопроса
- `created_at`, `updated_at`, `created_by`

**Связи:**
- Связана с: `course_quiz_options.question_id`, `course_quiz_answers.question_id`

---

## 31. Варианты ответов теста (course_quiz_options)

**Назначение:** Варианты ответов для вопросов теста подбора курса.

**Поля:**
- `id` — уникальный идентификатор
- `question_id` (integer, not null, FK → `course_quiz_questions.id`, onDelete: CASCADE) — вопрос
- `option_text` (text, not null) — текст варианта ответа
- `points` (integer, default: 0) — баллы за этот вариант
- `sort_order` (integer, default: 0) — порядок варианта
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `question_id` → `course_quiz_questions.id`
- Связана с: `course_quiz_answers.option_id`

---

## 32. Ответы пользователей на тест (course_quiz_answers)

**Назначение:** Ответы пользователей на вопросы теста подбора курса.

**Поля:**
- `id` — уникальный идентификатор
- `user_id` (integer, nullable, FK → `users.id`, onDelete: SET NULL) — пользователь
- `question_id` (integer, not null, FK → `course_quiz_questions.id`, onDelete: CASCADE) — вопрос
- `option_id` (integer, not null, FK → `course_quiz_options.id`, onDelete: CASCADE) — выбранный вариант
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `user_id` → `users.id`
- `question_id` → `course_quiz_questions.id`
- `option_id` → `course_quiz_options.id`

---

## 33. Сведения об образовательной организации (education_org_info)

**Назначение:** Информация об образовательной организации (лицензия, реквизиты) для страницы "Сведения об образовательной организации".

**Поля:**
- `id` — уникальный идентификатор
- `org_name` (string, 500, not null) — название организации
- `license_number` (string, 255, nullable) — номер лицензии
- `inn` (string, 50, nullable) — ИНН
- `ogrn` (string, 50, nullable) — ОГРН
- `address` (text, nullable) — адрес
- `phone` (string, 50, nullable) — телефон
- `email` (string, 255, nullable) — электронная почта
- `description` (text, nullable) — описание
- `created_at`, `updated_at`, `created_by`

---

## 34. Модули курсов (course_modules)

**Назначение:** Модули (разделы) каждого курса.

**Поля:**
- `id` — уникальный идентификатор
- `course_id` (integer, not null, FK → `courses.id`, onDelete: CASCADE) — курс
- `title` (string, 500, not null) — название модуля
- `description` (text, nullable) — описание модуля
- `sort_order` (integer, default: 0) — порядок модуля в курсе
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `course_id` → `courses.id`
- Связана с: `course_content.module_id`, `user_course_progress.module_id`

---

## 35. Контент курсов (course_content)

**Назначение:** Материалы курсов (статьи, видео, файлы, тесты) — то, что отображается в библиотеке у пользователя после покупки курса.

**Поля:**
- `id` — уникальный идентификатор
- `module_id` (integer, not null, FK → `course_modules.id`, onDelete: CASCADE) — модуль
- `title` (string, 500, not null) — заголовок материала
- `type` (string, 50, not null) — тип: `article` (статья), `video` (видео), `file` (файл), `quiz` (тест)
- `content` (text, nullable) — содержимое (для статей)
- `file_path` (string, 500, nullable) — путь к файлу (видео, PDF и т.д.)
- `duration_minutes` (integer, nullable) — продолжительность (для видео)
- `sort_order` (integer, default: 0) — порядок в модуле
- `is_required` (boolean, default: true) — обязателен ли материал
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `module_id` → `course_modules.id`
- Связана с: `user_course_progress.content_id`

---

## 36. Прогресс пользователя по курсу (user_course_progress)

**Назначение:** Отслеживание прогресса пользователя по курсу (пройденные модули и материалы) — для раздела "Моё обучение" в ЛК клиента.

**Поля:**
- `id` — уникальный идентификатор
- `user_id` (integer, not null, FK → `users.id`, onDelete: CASCADE) — пользователь
- `course_id` (integer, not null, FK → `courses.id`, onDelete: CASCADE) — курс
- `course_booking_id` (integer, nullable, FK → `course_bookings.id`, onDelete: SET NULL) — связанная запись на курс
- `module_id` (integer, nullable, FK → `course_modules.id`, onDelete: SET NULL) — модуль
- `content_id` (integer, nullable, FK → `course_content.id`, onDelete: SET NULL) — материал
- `is_completed` (boolean, default: false) — пройден ли материал
- `progress_percent` (integer, default: 0) — процент прогресса (0-100)
- `completed_at` (timestamp, nullable) — дата завершения
- `created_at`, `updated_at`, `created_by`
- **Уникальное ограничение:** `(user_id, course_id, content_id)`

**Связи:**
- `user_id` → `users.id`
- `course_id` → `courses.id`
- `course_booking_id` → `course_bookings.id`
- `module_id` → `course_modules.id`
- `content_id` → `course_content.id`

---

## 37. Портфолио грумера (groomer_portfolio)

**Назначение:** Портфолио работ грумера (фотографии выполненных работ) — для страницы "Портфолио работ" в ЛК грумера.

**Поля:**
- `id` — уникальный идентификатор
- `master_id` (integer, not null, FK → `masters.id`, onDelete: CASCADE) — грумер
- `title` (string, 500, nullable) — заголовок работы
- `description` (text, nullable) — описание
- `image` (string, 500, not null) — путь к фотографии
- `service_id` (integer, nullable, FK → `services.id`, onDelete: SET NULL) — оказанная услуга
- `breed` (string, 255, nullable) — порода питомца
- `work_date` (date, nullable) — дата выполнения работы
- `is_featured` (boolean, default: false) — избранная работа
- `sort_order` (integer, default: 0) — порядок сортировки
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `master_id` → `masters.id`
- `service_id` → `services.id`

---

## 38. Сообщения/чат (messages)

**Назначение:** Сообщения между пользователями (чат грумера с администратором, клиента с администратором).

**Поля:**
- `id` — уникальный идентификатор
- `sender_id` (integer, not null, FK → `users.id`, onDelete: CASCADE) — отправитель
- `recipient_id` (integer, not null, FK → `users.id`, onDelete: CASCADE) — получатель
- `message` (text, not null) — текст сообщения
- `is_read` (boolean, default: false) — прочитано ли сообщение
- `read_at` (timestamp, nullable) — дата прочтения
- `type` (string, 50, default: 'chat') — тип: `chat` (чат), `system` (системное)
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `sender_id` → `users.id`
- `recipient_id` → `users.id`

---

## 39. SMS-рассылки (sms_campaigns)

**Назначение:** Кампании SMS-рассылок — для раздела "SMS-рассылки" в ЛК админа.

**Поля:**
- `id` — уникальный идентификатор
- `title` (string, 500, not null) — название кампании
- `message` (text, not null) — текст SMS
- `status` (string, 50, not null, default: 'draft') — статус: `draft`, `scheduled`, `sending`, `completed`, `cancelled`
- `scheduled_at` (timestamp, nullable) — запланированное время отправки
- `total_recipients` (integer, default: 0) — всего получателей
- `sent_count` (integer, default: 0) — отправлено
- `failed_count` (integer, default: 0) — не отправлено
- `created_at`, `updated_at`, `created_by`

**Связи:**
- Связана с: `sms_recipients.campaign_id`

---

## 40. Получатели SMS (sms_recipients)

**Назначение:** Список получателей SMS-рассылки с их статусами.

**Поля:**
- `id` — уникальный идентификатор
- `campaign_id` (integer, not null, FK → `sms_campaigns.id`, onDelete: CASCADE) — кампания
- `user_id` (integer, nullable, FK → `users.id`, onDelete: SET NULL) — пользователь (если есть в системе)
- `phone` (string, 50, not null) — номер телефона
- `status` (string, 50, default: 'pending') — статус: `pending`, `sent`, `failed`, `delivered`
- `sent_at` (timestamp, nullable) — дата отправки
- `error_message` (text, nullable) — сообщение об ошибке (если не отправлено)
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `campaign_id` → `sms_campaigns.id`
- `user_id` → `users.id`

---

## 41. Товары склада (warehouse_items)

**Назначение:** Товары и расходные материалы на складе — для раздела "Склад" в ЛК админа.

**Поля:**
- `id` — уникальный идентификатор
- `name` (string, 500, not null) — название товара
- `sku` (string, 100, unique, nullable) — артикул
- `category` (string, 100, nullable) — категория: `tools` (инструменты), `consumables` (расходники), `products` (товары)
- `description` (text, nullable) — описание
- `quantity` (integer, not null, default: 0) — количество на складе
- `unit` (string, 50, default: 'шт') — единица измерения: `шт`, `кг`, `л`
- `price` (decimal, 10, 2, nullable) — цена за единицу
- `min_stock` (decimal, 10, 2, default: 0) — минимальный остаток (для уведомлений)
- `supplier` (string, 255, nullable) — поставщик
- `created_at`, `updated_at`, `created_by`

**Связи:**
- Связана с: `warehouse_transactions.item_id`

---

## 42. Транзакции склада (warehouse_transactions)

**Назначение:** Движение товаров на складе (приход, расход, корректировка).

**Поля:**
- `id` — уникальный идентификатор
- `item_id` (integer, not null, FK → `warehouse_items.id`, onDelete: CASCADE) — товар
- `type` (string, 50, not null) — тип: `in` (приход), `out` (расход), `adjustment` (корректировка)
- `quantity` (decimal, 10, 2, not null) — количество
- `notes` (text, nullable) — примечания
- `related_booking_id` (integer, nullable, FK → `service_bookings.id`, onDelete: SET NULL) — связанная запись (если расход связан с услугой)
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `item_id` → `warehouse_items.id`
- `related_booking_id` → `service_bookings.id`

---

## 43. Финансовые транзакции (financial_transactions)

**Назначение:** Финансовые операции (доходы, расходы, возвраты) — для раздела "Финансы" в ЛК админа.

**Поля:**
- `id` — уникальный идентификатор
- `type` (string, 50, not null) — тип: `income` (доход), `expense` (расход), `refund` (возврат)
- `amount` (decimal, 10, 2, not null) — сумма
- `category` (string, 100, nullable) — категория: `service`, `course`, `salary`, `rent`, и др.
- `description` (text, nullable) — описание
- `service_booking_id` (integer, nullable, FK → `service_bookings.id`, onDelete: SET NULL) — связанная запись на услугу
- `course_booking_id` (integer, nullable, FK → `course_bookings.id`, onDelete: SET NULL) — связанная запись на курс
- `master_id` (integer, nullable, FK → `masters.id`, onDelete: SET NULL) — мастер (для зарплаты)
- `transaction_date` (date, not null) — дата транзакции
- `payment_method` (string, 100, nullable) — способ оплаты: `cash`, `card`, `online`
- `created_at`, `updated_at`, `created_by`

**Связи:**
- `service_booking_id` → `service_bookings.id`
- `course_booking_id` → `course_bookings.id`
- `master_id` → `masters.id`

---

## 44. Отчёты (reports)

**Назначение:** Сгенерированные отчёты (доходы, записи, клиенты и т.д.) — для раздела "Отчёты" в ЛК админа.

**Поля:**
- `id` — уникальный идентификатор
- `title` (string, 500, not null) — название отчёта
- `type` (string, 100, not null) — тип: `revenue`, `bookings`, `clients`, и др.
- `period_start` (date, not null) — начало периода
- `period_end` (date, not null) — конец периода
- `data` (json, nullable) — данные отчёта в формате JSON
- `file_path` (string, 500, nullable) — путь к сгенерированному файлу (PDF, Excel)
- `created_at`, `updated_at`, `created_by`

---

## Диаграмма основных связей

```
users (1) ──< (N) pets
users (1) ──< (N) service_bookings
users (1) ──< (N) course_bookings
users (1) ──< (N) reviews
users (1) ──< (N) favorite_services
users (1) ──< (N) favorite_courses
users (1) ──< (1) loyalty_accounts
users (1) ──< (N) notifications
users (1) ──< (N) course_quiz_answers
users (1) ──< (N) user_course_progress
users (1) ──< (N) messages (sender_id)
users (1) ──< (N) messages (recipient_id)
users (1) ──< (N) sms_recipients

masters (1) ──< (N) master_services ──> (N) services
masters (1) ──< (N) course_instructors ──> (N) courses
masters (1) ──< (N) service_bookings
masters (1) ──< (N) course_bookings
masters (1) ──< (N) visits
masters (1) ──< (N) reviews
masters (1) ──< (N) blog_posts
masters (1) ──< (N) master_schedules
masters (1) ──< (N) gallery_items
masters (1) ──< (N) groomer_portfolio
masters (1) ──< (N) financial_transactions

courses (1) ──< (N) course_schedules
courses (1) ──< (N) course_bookings
courses (1) ──< (N) reviews
courses (1) ──< (N) favorite_courses
courses (1) ──< (N) course_modules
courses (1) ──< (N) gallery_items
courses (1) ──< (N) user_course_progress

course_modules (1) ──< (N) course_content
course_modules (1) ──< (N) user_course_progress

course_content (1) ──< (N) user_course_progress

course_quiz_questions (1) ──< (N) course_quiz_options
course_quiz_questions (1) ──< (N) course_quiz_answers

course_quiz_options (1) ──< (N) course_quiz_answers

services (1) ──< (N) service_bookings
services (1) ──< (N) visits
services (1) ──< (N) reviews
services (1) ──< (N) favorite_services
services (1) ──< (N) gallery_items
services (1) ──< (N) groomer_portfolio

pets (1) ──< (N) service_bookings
pets (1) ──< (N) visits
pets (1) ──< (N) pet_mood_entries
pets (1) ──< (N) pet_observations

service_bookings (1) ──< (N) visits
service_bookings (1) ──< (N) warehouse_transactions
service_bookings (1) ──< (N) financial_transactions

course_bookings (1) ──< (N) user_course_progress
course_bookings (1) ──< (N) financial_transactions

sms_campaigns (1) ──< (N) sms_recipients

warehouse_items (1) ──< (N) warehouse_transactions

leads (1) ──< (N) lead_call_tasks
```

---

## Примечания по реализации

1. **Пароли:** В продакшене все пароли должны хешироваться через bcrypt (минимум 10 раундов).
2. **Роли пользователей:** `client` (клиент), `groomer` (грумер/преподаватель), `admin` (администратор).
3. **Статусы записей:** `pending` → `confirmed` → `in_progress` → `completed` / `cancelled` / `postponed`.
4. **Система лояльности:** 1 лапка = 100₽, 100 лапок = 15% скидка. Бонус в день рождения питомца.
5. **Cascade удаления:** При удалении пользователя удаляются его питомцы, записи, избранное, уведомления. При удалении мастера — связи с услугами/курсами, но записи остаются (master_id → NULL).
6. **RESTRICT удаления:** Услуги и курсы нельзя удалить, если на них есть активные записи.

---

## Индексы (рекомендуемые для оптимизации)

- `users.email` — уникальный индекс (уже есть)
- `users.role` — для фильтрации по ролям
- `service_bookings.scheduled_at` — для поиска записей по дате
- `service_bookings.status` — для фильтрации по статусу
- `service_bookings.master_id` — для записей конкретного грумера
- `reviews.service_id`, `reviews.course_id`, `reviews.master_id` — для быстрого поиска отзывов
- `notifications.user_id`, `notifications.read_at` — для списка непрочитанных уведомлений
- `visits.pet_id`, `visits.visit_date` — для истории визитов питомца
- `master_schedules.master_id`, `master_schedules.day_of_week` — для расписания грумеров
- `messages.sender_id`, `messages.recipient_id`, `messages.is_read` — для чата
- `user_course_progress.user_id`, `user_course_progress.course_id` — для прогресса по курсам
- `course_modules.course_id`, `course_modules.sort_order` — для модулей курса
- `course_content.module_id`, `course_content.sort_order` — для контента модуля
- `groomer_portfolio.master_id` — для портфолио грумера
- `financial_transactions.transaction_date`, `financial_transactions.type` — для финансовых отчётов
- `warehouse_items.sku` — уникальный индекс (уже есть)
- `warehouse_items.category` — для фильтрации по категориям
- `sms_campaigns.status`, `sms_campaigns.scheduled_at` — для SMS-рассылок
- `documents.slug` — уникальный индекс (уже есть)
- `documents.type`, `documents.is_active` — для документов

---

**Дата создания документа:** 26 января 2026  
**Версия схемы БД:** 2.0 (добавлено 19 новых сущностей)  
**Проект:** MARS GROOM — Груминг-салон (услуги + курсы)  
**Всего сущностей:** 44 таблицы
