/**
 * Добавляет поля профиля клиента для персональных скидок и настроек.
 */
export async function up(knex) {
  const hasBirthDate = await knex.schema.hasColumn('users', 'birth_date');
  const hasCity = await knex.schema.hasColumn('users', 'city');

  await knex.schema.alterTable('users', (t) => {
    if (!hasBirthDate) t.date('birth_date').nullable();
    if (!hasCity) t.string('city', 255).nullable();
  });
}

export async function down(knex) {
  const hasBirthDate = await knex.schema.hasColumn('users', 'birth_date');
  const hasCity = await knex.schema.hasColumn('users', 'city');

  await knex.schema.alterTable('users', (t) => {
    if (hasBirthDate) t.dropColumn('birth_date');
    if (hasCity) t.dropColumn('city');
  });
}

