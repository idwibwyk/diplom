/**
 * Добавляет поля даты рождения питомца:
 * - knows_birth_date: знает ли владелец точную дату (месяц+год)
 * - birth_month: 1..12
 * - birth_year: YYYY
 * - approx_age_years: примерный возраст в годах, если дата неизвестна
 */
export const up = async function (knex) {
  const hasKnows = await knex.schema.hasColumn('pets', 'knows_birth_date');
  const hasMonth = await knex.schema.hasColumn('pets', 'birth_month');
  const hasYear = await knex.schema.hasColumn('pets', 'birth_year');
  const hasApprox = await knex.schema.hasColumn('pets', 'approx_age_years');

  await knex.schema.alterTable('pets', (t) => {
    if (!hasKnows) t.boolean('knows_birth_date').nullable();
    if (!hasMonth) t.integer('birth_month').nullable();
    if (!hasYear) t.integer('birth_year').nullable();
    if (!hasApprox) t.integer('approx_age_years').nullable();
  });
};

export const down = async function (knex) {
  const hasKnows = await knex.schema.hasColumn('pets', 'knows_birth_date');
  const hasMonth = await knex.schema.hasColumn('pets', 'birth_month');
  const hasYear = await knex.schema.hasColumn('pets', 'birth_year');
  const hasApprox = await knex.schema.hasColumn('pets', 'approx_age_years');

  await knex.schema.alterTable('pets', (t) => {
    if (hasKnows) t.dropColumn('knows_birth_date');
    if (hasMonth) t.dropColumn('birth_month');
    if (hasYear) t.dropColumn('birth_year');
    if (hasApprox) t.dropColumn('approx_age_years');
  });
};

