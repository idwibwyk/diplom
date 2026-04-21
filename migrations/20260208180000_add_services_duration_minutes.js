/**
 * Добавляем duration_minutes в services для расчёта занятых слотов при записи.
 */
export const up = async function (knex) {
  await knex.schema.alterTable('services', (t) => {
    t.integer('duration_minutes').nullable();
  });
  // По умолчанию 90 мин для существующих записей
  await knex('services').whereNull('duration_minutes').update({ duration_minutes: 90 });
};

export const down = async function (knex) {
  await knex.schema.alterTable('services', (t) => {
    t.dropColumn('duration_minutes');
  });
};
