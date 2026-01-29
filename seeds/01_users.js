/**
 * Первичные пользователи (мок-аккаунты для разработки).
 * В продакшене пароли должны хешироваться через bcrypt.
 */

export const seed = async function (knex) {
  await knex('users').del();

  await knex('users').insert([
    {
      email: 'admin@groom.ru',
      password_hash: '$2a$10$placeholder', // заменить на bcrypt.hash('123456', 10)
      name: 'Админ',
      phone: null,
      role: 'admin',
      created_by: null,
    },
    {
      email: 'groomer@groom.ru',
      password_hash: '$2a$10$placeholder',
      name: 'Грумер',
      phone: null,
      role: 'groomer',
      created_by: null,
    },
    {
      email: 'maria@example.com',
      password_hash: null,
      name: 'Мария',
      phone: null,
      role: 'client',
      created_by: null,
    },
  ]);
};
