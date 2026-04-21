/**
 * Добавление полей для записи на услугу в лиды: слот времени и услуга.
 */
export const up = async function (knex) {
  await knex.schema.alterTable('leads', (t) => {
    t.timestamp('scheduled_at').nullable();
    t.integer('service_id').nullable().references('id').inTable('services').onDelete('SET NULL');
  });
};

export const down = async function (knex) {
  await knex.schema.alterTable('leads', (t) => {
    t.dropColumn('scheduled_at');
    t.dropColumn('service_id');
  });
};
