/**
 * Добавляет loyalty_points (лапки) в services и courses для отображения наград за запись.
 */
export const up = async function (knex) {
  const hasServicesLoyalty = await knex.schema.hasColumn('services', 'loyalty_points');
  if (!hasServicesLoyalty) {
    await knex.schema.alterTable('services', (t) => {
      t.integer('loyalty_points').defaultTo(5).comment('Лапки за запись на услугу');
    });
  }
  const hasCoursesLoyalty = await knex.schema.hasColumn('courses', 'loyalty_points');
  if (!hasCoursesLoyalty) {
    await knex.schema.alterTable('courses', (t) => {
      t.integer('loyalty_points').defaultTo(50).comment('Лапки за запись на курс');
    });
  }
};

export const down = async function (knex) {
  if (await knex.schema.hasColumn('services', 'loyalty_points')) {
    await knex.schema.alterTable('services', (t) => t.dropColumn('loyalty_points'));
  }
  if (await knex.schema.hasColumn('courses', 'loyalty_points')) {
    await knex.schema.alterTable('courses', (t) => t.dropColumn('loyalty_points'));
  }
};
