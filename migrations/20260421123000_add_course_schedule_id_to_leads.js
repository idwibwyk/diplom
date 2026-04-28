/**
 * Добавляет в лиды привязку к расписанию курса.
 */
export const up = async function (knex) {
  await knex.schema.alterTable('leads', (t) => {
    t.integer('course_schedule_id').nullable().references('id').inTable('course_schedules').onDelete('SET NULL');
  });
};

export const down = async function (knex) {
  await knex.schema.alterTable('leads', (t) => {
    t.dropColumn('course_schedule_id');
  });
};
