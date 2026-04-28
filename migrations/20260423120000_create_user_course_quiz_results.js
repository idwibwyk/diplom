/**
 * Результаты прохождения тематических тестов по курсу (для статистики в ЛК).
 */
export async function up(knex) {
  const exists = await knex.schema.hasTable('user_course_quiz_results');
  if (exists) return;

  await knex.schema.createTable('user_course_quiz_results', (t) => {
    t.increments('id').primary();
    t.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.integer('course_id').notNullable().references('id').inTable('courses').onDelete('CASCADE');
    t.integer('test_index').notNullable();
    t.integer('score_percent').notNullable();
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
    t.unique(['user_id', 'course_id', 'test_index']);
  });
}

export async function down(knex) {
  if (await knex.schema.hasTable('user_course_quiz_results')) {
    await knex.schema.dropTable('user_course_quiz_results');
  }
}
