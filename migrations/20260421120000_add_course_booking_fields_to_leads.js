/**
 * Добавляет в лиды поля для записи на курс (гостевые заявки).
 */
export const up = async function (knex) {
  await knex.schema.alterTable('leads', (t) => {
    t.integer('course_id').nullable().references('id').inTable('courses').onDelete('SET NULL');
    t.integer('master_id').nullable().references('id').inTable('masters').onDelete('SET NULL');
    t.string('contact_method', 100).nullable();
    t.text('notes').nullable();
  });
};

export const down = async function (knex) {
  await knex.schema.alterTable('leads', (t) => {
    t.dropColumn('course_id');
    t.dropColumn('master_id');
    t.dropColumn('contact_method');
    t.dropColumn('notes');
  });
};
