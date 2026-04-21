# API MARS GROOM — документация для Postman

Базовый URL: **http://localhost:3001/api**

Все запросы к ресурсам (кроме auth) могут отправляться с заголовком **Authorization: Bearer &lt;token&gt;** для авторизованного пользователя. Без токена действует роль `guest`.

Ответы при ошибке содержат **success: false** и **error**: строка с сообщением.

---

## Настройка БД (миграции и сиды)

**Порядок обязателен:** сначала миграции создают таблицы, затем сиды заполняют их данными.

1. **Создайте базу PostgreSQL** (если ещё нет):
   ```bash
   # В psql или pgAdmin:
   CREATE DATABASE mars_groom;
   ```
   Параметры подключения задаются в `knexfile.js` или через переменные окружения: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (по умолчанию: localhost, 5432, postgres, 1234, mars_groom).

2. **Применить миграции** (создание всех таблиц):
   ```bash
   npm run migrate:latest
   ```

3. **Запустить сиды** (заполнение таблиц тестовыми данными):
   ```bash
   npm run seed:run
   ```
   Сиды выполняются по порядку: `01_users.js` (пользователи), затем `02_testData.js` (остальные таблицы). Пароль для всех пользователей: **123456**.

После этого можно запускать API: `npm run server`.

---

## Авторизация

### POST /api/auth/login

**Назначение:** Вход в систему, получение JWT-токена.

**Тело (JSON):**
```json
{
  "email": "admin@groom.ru",
  "password": "123456"
}
```

**Обязательные поля:** `email`, `password`

**Успех (200):** `{ "success": true, "token": "...", "user": { "id", "email", "name", "role", ... } }`  
**Ошибка (400):** не указаны email или пароль — `{ "success": false, "error": "Укажите email и пароль" }`  
**Ошибка (401):** неверный логин/пароль — `{ "success": false, "error": "Неверный email или пароль" }`

---

### POST /api/auth/register

**Назначение:** Регистрация нового пользователя (роль `client`).

**Тело (JSON):**
```json
{
  "email": "new@example.com",
  "password": "mypassword",
  "name": "Имя Фамилия",
  "phone": "+7 999 000-00-00"
}
```

**Обязательные поля:** `email`, `password`, `name`  
**Необязательные:** `phone`

**Успех (201):** `{ "success": true, "token": "...", "user": { ... } }`  
**Ошибка (400):** не указаны обязательные поля  
**Ошибка (409):** email уже занят — `{ "success": false, "error": "Пользователь с таким email уже существует" }`

---

## Общий формат CRUD по ресурсам

Для каждого ресурса ниже действуют одни и те же шаблоны:

| Метод | URL | Назначение |
|-------|-----|------------|
| GET | /api/{resource} | Список записей с пагинацией |
| GET | /api/{resource}/search?q=...&field=... | Поиск по полю (по умолчанию name/title) |
| GET | /api/{resource}/:id | Одна запись по id |
| POST | /api/{resource} | Создание записи |
| PUT | /api/{resource}/:id | Обновление записи |
| DELETE | /api/{resource}/:id | Удаление записи |

**Параметры списка (GET /api/{resource}):**
- `page` — страница (по умолчанию 1)
- `limit` — записей на страницу (по умолчанию 20, макс. 100)
- Любые поля таблицы как query — фильтр (например `?role=client` для users)

**Ответ списка (200):**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": { "page", "limit", "total", "pages" }
}
```

**Ответ одной записи (200):** `{ "success": true, "data": { ... } }`  
**Ответ создания (201):** `{ "success": true, "data": { ... }, "message": "Запись успешно создана" }`  
**Ответ обновления (200):** `{ "success": true, "data": { ... }, "message": "Запись успешно обновлена" }`  
**Ответ удаления (200):** `{ "success": true, "message": "Запись успешно удалена" }`  
**Ошибки:** 400 (валидация), 403 (нет прав), 404 (не найдено), 500 — везде `{ "success": false, "error": "..." }`

**Валидация:** для маршрутов с `:id` передавайте числовой id (иначе 400 «Некорректный идентификатор»).

Права зависят от роли: `guest`, `client`, `groomer`, `admin`. Универсальный контроллер подставляет `created_by` (или указанное поле владельца) из текущего пользователя при создании.

---

## Ресурсы и примеры тел запросов

### users

- **GET /api/users** — список пользователей (доступ ограничен по ролям).
- **GET /api/users/:id** — профиль (клиент видит только себя по id).
- **POST /api/users** — создание пользователя (для регистрации предпочтителен POST /api/auth/register).
- **PUT /api/users/:id** — обновление профиля.
- **DELETE /api/users/:id** — удаление (админ).

Пример тела **POST/PUT** (минимально для создания через API):  
`{ "email": "u@mail.ru", "name": "Имя", "role": "client" }` — пароль при необходимости отдельно.

---

### masters

- **GET /api/masters** — список мастеров.
- **GET /api/masters/:id** — один мастер.
- **POST /api/masters** — создание (админ/грумер).
- **PUT /api/masters/:id** — обновление.
- **DELETE /api/masters/:id** — удаление (админ).

Пример тела **POST:**  
`{ "full_name": "Иван Петров", "phone": "+7 999 000-00-00", "experience": 5, "specialization": "Стрижка собак", "rating": 4.8 }`

---

### services

- **GET /api/services** — список услуг (гости могут читать).
- **GET /api/services/:id** — одна услуга.
- **POST /api/services** — создание (грумер/админ).
- **PUT /api/services/:id** — обновление.
- **DELETE /api/services/:id** — удаление (админ).

Пример тела **POST:**  
`{ "name": "Стрижка йорка", "category": "dogs", "type": "grooming", "price": 1500, "duration": "2 часа", "description": "..." }`  
Обязательные: `name`, `category`, `type`, `price`.

---

### courses

- **GET /api/courses** — список курсов.
- **GET /api/courses/:id** — один курс.
- **POST /api/courses** — создание (грумер/админ).
- **PUT /api/courses/:id** — обновление.
- **DELETE /api/courses/:id** — удаление (админ).

Пример тела **POST:**  
`{ "name": "Основы груминга", "level": "beginner", "format": "offline", "duration": "3 месяца", "price": 35000, "description": "..." }`  
Обязательные: `name`, `level`, `format`, `price`.

---

### reviews

- **GET /api/reviews** — список отзывов (гости могут читать).
- **GET /api/reviews/:id** — один отзыв.
- **POST /api/reviews** — создание (клиент и др. по правам).
- **PUT /api/reviews/:id** — обновление своей записи.
- **DELETE /api/reviews/:id** — удаление своей записи (если разрешено).

Пример тела **POST:**  
`{ "rating": 5, "text": "Отличный сервис!", "type": "service", "service_id": 1 }`  
Можно указать `course_id`, `master_id`, `pet_name`.

---

### pets

- **GET /api/pets** — список питомцев (клиент — только свои по user_id).
- **GET /api/pets/:id** — один питомец.
- **POST /api/pets** — добавление питомца (клиент; в теле задаётся user_id или подставляется из токена).
- **PUT /api/pets/:id** — обновление.
- **DELETE /api/pets/:id** — удаление.

Пример тела **POST:**  
`{ "user_id": 3, "name": "Барсик", "breed": "Шпиц", "age": 3 }`  
Обязательные: `user_id`, `name`.

---

### faq_items

- **GET /api/faq_items** — список вопросов/ответов.
- **GET /api/faq_items/:id** — один пункт.
- **POST /api/faq_items** — создание (грумер/админ).
- **PUT /api/faq_items/:id** — обновление.
- **DELETE /api/faq_items/:id** — удаление (админ).

Пример тела **POST:**  
`{ "question": "С какого возраста стричь?", "answer": "С 3–4 месяцев.", "category": "general", "sort_order": 1 }`

---

### gallery_items

- **GET /api/gallery_items** — список элементов галереи.
- **GET /api/gallery_items/:id** — один элемент.
- **POST /api/gallery_items** — создание (грумер/админ).
- **PUT /api/gallery_items/:id** — обновление.
- **DELETE /api/gallery_items/:id** — удаление (админ).

Пример тела **POST:**  
`{ "title": "Стрижка шпица", "description": "...", "image": "/path/to/image.jpg", "category": "services", "master_id": 1 }`  
Обязательные: `image`.

---

### contacts

- **GET /api/contacts** — список контактов (телефон, email, адрес и т.д.).
- **GET /api/contacts/:id** — один контакт.
- **POST /api/contacts** — создание (админ).
- **PUT /api/contacts/:id** — обновление.
- **DELETE /api/contacts/:id** — удаление.

Пример тела **POST:**  
`{ "type": "phone", "label": "Телефон", "value": "+7 999 000-00-00", "sort_order": 1, "is_active": true }`

---

### course_schedules

- **GET /api/course_schedules** — расписание курсов.
- **GET /api/course_schedules/:id** — одна запись расписания.
- **POST /api/course_schedules** — создание (грумер/админ).
- **PUT /api/course_schedules/:id** — обновление.
- **DELETE /api/course_schedules/:id** — удаление.

Пример тела **POST:**  
`{ "course_id": 1, "start_date": "2026-02-01", "start_time": "10:00", "spots": 12 }`  
Обязательные: `course_id`, `start_date`.

---

### service_bookings

- **GET /api/service_bookings** — список записей на услуги (клиент — свои).
- **GET /api/service_bookings/:id** — одна запись.
- **POST /api/service_bookings** — создание записи (клиент/грумер/админ).
- **PUT /api/service_bookings/:id** — обновление (статус и т.д.).
- **DELETE /api/service_bookings/:id** — удаление (по правам).

Пример тела **POST:**  
`{ "user_id": 3, "service_id": 1, "master_id": 1, "pet_id": 1, "scheduled_at": "2026-02-01T10:00:00", "status": "pending" }`  
Обязательные: `user_id`, `service_id`, `scheduled_at`.

---

### leads

- **GET /api/leads** — список лидов (админ/по правам).
- **GET /api/leads/:id** — один лид.
- **POST /api/leads** — создание лида (гость может оставить заявку).
- **PUT /api/leads/:id** — обновление.
- **DELETE /api/leads/:id** — удаление.

Пример тела **POST:**  
`{ "name": "Алексей", "email": "a@mail.ru", "phone": "+7 999 111-22-33", "source": "contact_form", "status": "new" }`  
Обязательные: `name`, `email`, `status`.

---

## Остальные ресурсы (CRUD по тому же шаблону)

Для следующих ресурсов URL и методы те же: **GET /api/{resource}**, **GET /api/{resource}/search**, **GET /api/{resource}/:id**, **POST**, **PUT**, **DELETE**. Тела POST — объекты с полями таблицы; при создании от имени пользователя поле **created_by** (или владельца) подставляется автоматически, если не передано.

| Ресурс | Краткое описание |
|--------|-------------------|
| **course_bookings** | Записи на курсы. Владелец: user_id. Тело: user_id, course_id, course_schedule_id, status и т.д. |
| **visits** | Визиты питомцев. Тело: pet_id, service_id, master_id, visit_date, notes и т.д. |
| **favorite_services** | Избранные услуги пользователя. user_id, service_id. |
| **favorite_courses** | Избранные курсы. user_id, course_id. |
| **loyalty_accounts** | Лояльность (баллы). user_id, points, total_earned. |
| **pet_mood_entries** | Дневник настроения питомца. pet_id, user_id, mood, entry_date. |
| **pet_observations** | Наблюдения за питомцем. pet_id, user_id, text, type, observation_date. |
| **shelter_applications** | Заявки приютов. org_name, contact_name, phone, email, message. |
| **zone_rental_applications** | Заявки на аренду зоны. name, phone, email, hours, message. |
| **lead_call_tasks** | Задачи «позвонить» по лидам. lead_id, assignee_id, status, due_date. |
| **blog_posts** | Статьи блога. title, excerpt, content, author_id, category, read_time, image, published_at. Поиск по title. |
| **library_articles** | Библиотека знаний. title, slug, excerpt, content, category, image. Поиск по title. |
| **notifications** | Уведомления пользователей. user_id, type, title, body. |
| **master_schedules** | Расписание грумеров. master_id, day_of_week, start_time, end_time, is_available. |
| **documents** | Документы (политика, договоры). title, slug, content, type, file_path, is_active. Поиск по title. |
| **course_quiz_questions** | Вопросы теста курсов. question, type, sort_order. |
| **course_quiz_options** | Варианты ответов. question_id, option_text, points, sort_order. |
| **course_quiz_answers** | Ответы пользователей. user_id, question_id, option_id. |
| **education_org_info** | Сведения об образовательной организации. org_name, license_number, inn, ogrn, address и т.д. |
| **course_modules** | Модули курсов. course_id, title, description, sort_order. |
| **course_content** | Контент модулей. module_id, title, type, content, file_path, duration_minutes, sort_order. |
| **user_course_progress** | Прогресс по курсу. user_id, course_id, module_id, content_id, is_completed, progress_percent. |
| **groomer_portfolio** | Портфолио грумера. master_id, title, description, image, service_id, breed, work_date. |
| **messages** | Сообщения между пользователями. sender_id, recipient_id, message, type. |
| **sms_campaigns** | SMS-рассылки. title, message, status, scheduled_at. |
| **sms_recipients** | Получатели SMS. campaign_id, user_id, phone, status. |
| **warehouse_items** | Товары склада. name, sku, category, quantity, unit, price, min_stock, supplier. |
| **warehouse_transactions** | Движение товаров. item_id, type, quantity, notes. |
| **financial_transactions** | Финансовые операции. type, amount, category, transaction_date, description и т.д. |
| **reports** | Отчёты. title, type, period_start, period_end, data (JSON), file_path. |
| **master_services** | Связь мастер–услуга. master_id, service_id. |
| **course_instructors** | Связь курс–преподаватель. course_id, master_id. |

---

## Тестовые пользователи (после npm run seed:run)

| Email | Пароль | Роль |
|-------|--------|------|
| admin@groom.ru | 123456 | admin |
| anna@groom.ru | 123456 | groomer |
| maria@groom.ru | 123456 | groomer |
| ivan@groom.ru | 123456 | groomer |
| maria@example.com | 123456 | client |

---

## Запуск

```bash
npm run server
```

API доступен по адресу: **http://localhost:3001/api**.  
Проверка здоровья: **GET http://localhost:3001/api/health** — ответ `{ "ok": true, "message": "MARS GROOM API" }`.
