# Доступ по ролям: Гость / Клиент / Грумер / Админ (44 сущности)

Защита роутов — на бэкенде (universalController + optionalAuth). Хук useEntity не знает про авторизацию; при 401/403 ошибка возвращается в `loadingListError` / `createError`.

---

## Только для гостя и клиента (публичное)

| Сущность | Гость | Клиент | Описание |
|----------|-------|--------|----------|
| **masters** | read | read | Просмотр мастеров |
| **services** | read | read | Просмотр услуг |
| **courses** | read | read | Просмотр курсов |
| **course_schedules** | read | read | Расписание курсов |
| **master_services** | read | read | Связь мастер–услуга |
| **course_instructors** | read | read | Преподаватели курсов |
| **reviews** | read | read, create, updateOwn, deleteOwn | Просмотр и оставление отзывов |
| **faq_items** | read | read | FAQ |
| **gallery_items** | read | read | Галерея |
| **contacts** | read | read | Контакты |
| **blog_posts** | read | read | Блог |
| **library_articles** | read | read | Библиотека статей |
| **documents** | read | read | Документы (политика и т.д.) |
| **education_org_info** | read | read | Сведения об образовательной организации |
| **course_quiz_questions** | read | read | Вопросы теста курсов |
| **course_quiz_options** | read | read | Варианты ответов теста |
| **master_schedules** | read | read | Расписание грумеров |
| **groomer_portfolio** | read | read | Портфолио грумеров |

---

## Гость: только создание (формы без входа)

| Сущность | Гость | Описание |
|----------|-------|----------|
| **leads** | create | Заявки/лиды (форма обратной связи, запись на курс) |
| **shelter_applications** | create | Заявки приютов |
| **zone_rental_applications** | create | Заявки на аренду зоны |
| **course_quiz_answers** | create | Ответы на тест подбора курса |

---

## Клиент: свои данные и действия

| Сущность | Клиент | Описание |
|----------|--------|----------|
| **pets** | readOwn, create, updateOwn, deleteOwn | Свои питомцы |
| **service_bookings** | readOwn, create, updateOwn | Запись на услугу, свои записи |
| **course_bookings** | readOwn, create, updateOwn | Запись на курс, свои записи |
| **favorite_services** | readOwn, create, deleteOwn | Избранные услуги |
| **favorite_courses** | readOwn, create, deleteOwn | Избранные курсы |
| **loyalty_accounts** | readOwn | Свой счёт лояльности |
| **pet_mood_entries** | readOwn, create, updateOwn, deleteOwn | Дневник настроения питомца |
| **pet_observations** | readOwn, create, updateOwn, deleteOwn | Наблюдения за питомцем |
| **notifications** | readOwn, updateOwn, deleteOwn | Свои уведомления |
| **user_course_progress** | readOwn, create, updateOwn | Прогресс по курсам |
| **messages** | readOwn, create, updateOwn | Чат (свои сообщения) |
| **visits** | readOwn | История визитов (своих питомцев) |

---

## Грумер

| Сущность | Грумер | Описание |
|----------|--------|----------|
| **masters** | read, create, update, updateOwn | Профиль мастера |
| **services** | read, create, update | Услуги (каталог) |
| **courses** | read, create, update | Курсы |
| **course_schedules** | read, create, update | Расписание курсов |
| **master_services** | read, create, update | Свои услуги |
| **course_instructors** | read, create, update | Преподавание |
| **service_bookings** | read, create, update | Записи на услуги |
| **visits** | read, create, update | Визиты |
| **faq_items** | read, create, update | FAQ |
| **gallery_items** | read, create, update | Галерея |
| **blog_posts** | read, create, update | Блог |
| **library_articles** | read, create, update | Библиотека |
| **master_schedules** | read, readOwn, create, updateOwn, deleteOwn | Своё расписание |
| **groomer_portfolio** | read, readOwn, create, updateOwn, deleteOwn | Своё портфолио |
| **pets** | read | Просмотр питомцев |
| **notifications** | readOwn, updateOwn | Свои уведомления |
| **messages** | readOwn, create, updateOwn | Чат |
| **user_course_progress** | read, update | Прогресс учеников |
| **warehouse_items** | read | Склад (просмотр) |
| **warehouse_transactions** | read, create | Транзакции склада |

---

## Только админ (админ-панель)

| Сущность | Описание |
|----------|----------|
| **users** | Пользователи (read — админ/грумер, create — регистрация для гостя) |
| **leads** | Просмотр/управление лидами |
| **lead_call_tasks** | Задачи «позвонить» |
| **service_bookings** | Все записи на услуги |
| **course_bookings** | Все записи на курсы |
| **contacts** | CRUD контактов (для грумера только read) |
| **documents** | Управление документами |
| **education_org_info** | Сведения об организации |
| **course_quiz_questions** | Вопросы теста |
| **course_quiz_options** | Варианты ответов |
| **course_quiz_answers** | Ответы пользователей |
| **course_modules** | Модули курсов |
| **course_content** | Контент курсов |
| **sms_campaigns** | SMS-рассылки |
| **sms_recipients** | Получатели SMS |
| **warehouse_items** | Товары склада |
| **warehouse_transactions** | Транзакции склада |
| **financial_transactions** | Финансовые транзакции |
| **reports** | Отчёты |
| **shelter_applications** | Заявки приютов (чтение/управление) |
| **zone_rental_applications** | Заявки на аренду (чтение/управление) |
| **loyalty_accounts** | Счета лояльности |
| **notifications** | Все уведомления (админ — полный CRUD) |

Админ по умолчанию имеет **read, create, update, delete** для всех 44 сущностей (manageAll в universalController).
