/**
 * Пользователи: 1 админ, 6 грумеров (под мастеров из mockData), 4 клиента.
 * Пароль для всех: 123456
 */
import bcrypt from 'bcrypt';

export const seed = async function (knex) {
  const passwordHash = await bcrypt.hash('123456', 10);

  const baseUsers = [
    { email: 'admin@groom.ru', password_hash: passwordHash, name: 'Администратор', phone: '+7 (995) 020-50-13', role: 'admin', created_by: null },
    { email: 'anna@groom.ru', password_hash: passwordHash, name: 'Анна Петрова', phone: '+7 (999) 111-11-01', role: 'groomer', created_by: null },
    { email: 'maria@groom.ru', password_hash: passwordHash, name: 'Мария Иванова', phone: '+7 (999) 111-11-02', role: 'groomer', created_by: null },
    { email: 'ivan@groom.ru', password_hash: passwordHash, name: 'Иван Соколов', phone: '+7 (999) 111-11-03', role: 'groomer', created_by: null },
    { email: 'elena@groom.ru', password_hash: passwordHash, name: 'Елена Смирнова', phone: '+7 (999) 111-11-04', role: 'groomer', created_by: null },
    { email: 'dmitry@groom.ru', password_hash: passwordHash, name: 'Дмитрий Волков', phone: '+7 (999) 111-11-05', role: 'groomer', created_by: null },
    { email: 'olga@groom.ru', password_hash: passwordHash, name: 'Ольга Козлова', phone: '+7 (999) 111-11-06', role: 'groomer', created_by: null },
    { email: 'maria@example.com', password_hash: passwordHash, name: 'Мария Клиентова', phone: '+7 (999) 222-22-01', role: 'client', created_by: null },
    { email: 'elena.s@example.com', password_hash: passwordHash, name: 'Елена Соколова', phone: '+7 (999) 222-22-02', role: 'client', created_by: null },
    { email: 'alexey@example.com', password_hash: passwordHash, name: 'Алексей Петров', phone: '+7 (999) 222-22-03', role: 'client', created_by: null },
    { email: 'irina@example.com', password_hash: passwordHash, name: 'Ирина Новикова', phone: '+7 (999) 222-22-04', role: 'client', created_by: null },
  ];

  for (const u of baseUsers) {
    const existing = await knex('users').where({ email: u.email }).first();
    if (!existing) {
      await knex('users').insert(u);
      continue;
    }
    // Не трогаем чужие аккаунты, просто гарантируем наличие «базовых» пользователей проекта.
    await knex('users')
      .where({ id: existing.id })
      .update({
        name: u.name,
        phone: u.phone,
        role: u.role,
        password_hash: existing.password_hash || u.password_hash,
        updated_at: knex.raw('now()'),
      });
  }
};
