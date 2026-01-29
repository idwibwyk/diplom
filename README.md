
  # Groom Room Web Application

  This is a code bundle for Groom Room Web Application. The original project is available at https://www.figma.com/design/luJi3b1X02ElxNt49jQ6BX/Groom-Room-Web-Application.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Мок-аккаунты (только фронтенд)

  - **Грумер:** `groomer@groom.ru` / `123456` → ЛК грумера `/dashboard-groomer` (доска, записи, преподавательство)
  - **Админ:** `admin@groom.ru` / `123456` → ЛК админа `/dashboard-admin` (заявки, добавление услуг/курсов)
  - Любой другой email/пароль → вход как клиент (ЛК). Профиль — выпадающее меню (перейти в профиль, выйти).

  ## База данных (миграции Knex + PostgreSQL)

  Схема БД спроектирована под бэкенд: пользователи, мастера, услуги, курсы, записи, питомцы, отзывы, избранное, лояльность, заявки приютов/аренды, лиды, блог, FAQ, библиотека, уведомления, расписание грумеров, галерея, документы, контакты, тест подбора курсов, модули и контент курсов, портфолио, чат, SMS-рассылки, склад, финансы, отчёты и др. (всего 44 сущности).

  **Требования:** PostgreSQL. Параметры в `knexfile.js` или через переменные: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (по умолчанию `mars_groom`).

  1. Создайте БД: `createdb mars_groom`
  2. Установите зависимости: `npm i`
  3. Запустите миграции: `npm run migrate:latest`
  4. Откат: `npm run migrate:rollback`
  5. Сиды (опционально): `npm run seed:run` — добавляет мок-пользователей (admin@groom.ru, groomer@groom.ru, maria@example.com).

  Файлы: `knexfile.js`, `migrations/20260126120000_create_mars_groom_schema.js`, `seeds/01_users.js`.

  **Документация:** Подробное описание всех 44 сущностей БД с полями, связями и назначением — см. `DATABASE_ENTITIES.md`.
