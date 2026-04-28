/**
 * Домашние задания по курсам:
 * - ученик загружает файл и комментарий;
 * - грумер выставляет оценку и комментарий.
 */
export async function up(knex) {
  const exists = await knex.schema.hasTable('course_homework_submissions');
  if (exists) return;

  await knex.schema.createTable('course_homework_submissions', (t) => {
    t.increments('id').primary();
    t.integer('course_booking_id').notNullable().references('id').inTable('course_bookings').onDelete('CASCADE');
    t.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.integer('course_id').notNullable().references('id').inTable('courses').onDelete('CASCADE');
    t.integer('master_id').nullable().references('id').inTable('masters').onDelete('SET NULL');
    t.string('file_path', 2048).notNullable();
    t.text('student_comment');
    t.integer('score_percent').nullable();
    t.text('groomer_comment');
    t.string('status', 50).notNullable().defaultTo('submitted');
    t.timestamp('reviewed_at');
    t.timestamps(true, true);
    t.integer('created_by').nullable().references('id').inTable('users');
    t.unique(['course_booking_id', 'user_id']);
  });
}

export async function down(knex) {
  const exists = await knex.schema.hasTable('course_homework_submissions');
  if (exists) {
    await knex.schema.dropTable('course_homework_submissions');
  }
}
