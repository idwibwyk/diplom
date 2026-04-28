/**
 * Привязка отзывов к конкретной записи (1 отзыв на 1 запись).
 */

export async function up(knex) {
  const has = await knex.schema.hasTable('reviews');
  if (!has) return;

  const cols = await knex('information_schema.columns')
    .select('column_name')
    .where({ table_name: 'reviews' })
    .then((rows) => new Set(rows.map((r) => r.column_name)));

  await knex.schema.alterTable('reviews', (t) => {
    if (!cols.has('service_booking_id')) t.integer('service_booking_id').nullable().references('id').inTable('service_bookings').onDelete('SET NULL');
    if (!cols.has('course_booking_id')) t.integer('course_booking_id').nullable().references('id').inTable('course_bookings').onDelete('SET NULL');
  });

  // уникальность: 1 отзыв на запись
  const hasIndex1 = await knex.raw(
    "SELECT 1 FROM pg_indexes WHERE tablename = 'reviews' AND indexname = 'reviews_user_service_booking_unique'"
  ).then((r) => (r?.rows?.length ? true : false)).catch(() => false);
  if (!hasIndex1) {
    await knex.raw("CREATE UNIQUE INDEX reviews_user_service_booking_unique ON reviews(user_id, service_booking_id) WHERE service_booking_id IS NOT NULL");
  }

  const hasIndex2 = await knex.raw(
    "SELECT 1 FROM pg_indexes WHERE tablename = 'reviews' AND indexname = 'reviews_user_course_booking_unique'"
  ).then((r) => (r?.rows?.length ? true : false)).catch(() => false);
  if (!hasIndex2) {
    await knex.raw("CREATE UNIQUE INDEX reviews_user_course_booking_unique ON reviews(user_id, course_booking_id) WHERE course_booking_id IS NOT NULL");
  }
}

export async function down(knex) {
  const has = await knex.schema.hasTable('reviews');
  if (!has) return;
  await knex.raw('DROP INDEX IF EXISTS reviews_user_service_booking_unique');
  await knex.raw('DROP INDEX IF EXISTS reviews_user_course_booking_unique');
  await knex.schema.alterTable('reviews', (t) => {
    t.dropColumn('service_booking_id');
    t.dropColumn('course_booking_id');
  });
}

