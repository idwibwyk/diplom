/**
 * Ежедневная отметка общего состояния питомца (заполняет клиент).
 */

export async function up(knex) {
  const has = await knex.schema.hasTable('pet_health_entries');
  if (has) return;

  await knex.schema.createTable('pet_health_entries', (t) => {
    t.increments('id').primary();
    t.integer('pet_id').notNullable().references('id').inTable('pets').onDelete('CASCADE');
    t.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.date('entry_date').notNullable();
    t.string('health_status', 100).notNullable(); // Отлично/Хорошо/Требует внимания
    t.text('note');
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
    t.unique(['user_id', 'pet_id', 'entry_date']);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('pet_health_entries');
}

