/**
 * 1) services.duration_slots — длительность услуги в слотах по 30 минут
 * 2) pets: animal_type + sex (+ делаем breed опциональной)
 *
 * Слот = 30 минут. duration_slots используется для бизнес-логики записи.
 */

export const up = async function (knex) {
  // services.duration_slots
  const hasDurationSlots = await knex.schema.hasColumn('services', 'duration_slots');
  if (!hasDurationSlots) {
    await knex.schema.alterTable('services', (t) => {
      t.integer('duration_slots').nullable();
    });
  }
  // Заполняем из duration_minutes (округление вверх), минимум 1 слот
  await knex('services')
    .whereNull('duration_slots')
    .update({
      duration_slots: knex.raw('GREATEST(1, CEIL(COALESCE(duration_minutes, 60) / 30.0))'),
    });

  // pets fields
  const hasAnimalType = await knex.schema.hasColumn('pets', 'animal_type');
  const hasSex = await knex.schema.hasColumn('pets', 'sex');
  if (!hasAnimalType || !hasSex) {
    await knex.schema.alterTable('pets', (t) => {
      if (!hasAnimalType) t.string('animal_type', 20).nullable(); // dog | cat | rabbit
      if (!hasSex) t.string('sex', 2).nullable(); // м | ж
    });
  }

  // Проставим дефолты для существующих записей (мягко, без сложной эвристики)
  await knex('pets').whereNull('animal_type').update({ animal_type: 'dog' });
};

export const down = async function (knex) {
  const hasDurationSlots = await knex.schema.hasColumn('services', 'duration_slots');
  if (hasDurationSlots) {
    await knex.schema.alterTable('services', (t) => t.dropColumn('duration_slots'));
  }

  const hasAnimalType = await knex.schema.hasColumn('pets', 'animal_type');
  const hasSex = await knex.schema.hasColumn('pets', 'sex');
  if (hasAnimalType || hasSex) {
    await knex.schema.alterTable('pets', (t) => {
      if (hasAnimalType) t.dropColumn('animal_type');
      if (hasSex) t.dropColumn('sex');
    });
  }
};

