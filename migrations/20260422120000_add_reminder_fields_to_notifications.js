/**
 * Расширяет notifications для напоминаний по email и привязки к записи.
 */

export async function up(knex) {
  const has = await knex.schema.hasTable('notifications');
  if (!has) return;

  const cols = await knex('information_schema.columns')
    .select('column_name')
    .where({ table_name: 'notifications' })
    .then((rows) => new Set(rows.map((r) => r.column_name)));

  await knex.schema.alterTable('notifications', (t) => {
    if (!cols.has('reminder_at')) t.timestamp('reminder_at').nullable();
    if (!cols.has('email')) t.string('email', 255).nullable();
    if (!cols.has('booking_type')) t.string('booking_type', 50).nullable(); // service|course
    if (!cols.has('booking_id')) t.integer('booking_id').nullable();
    if (!cols.has('sent_at')) t.timestamp('sent_at').nullable();
    if (!cols.has('meta')) t.jsonb('meta').nullable();
  });
}

export async function down(knex) {
  const has = await knex.schema.hasTable('notifications');
  if (!has) return;
  await knex.schema.alterTable('notifications', (t) => {
    if (t.dropColumn) {
      // knex pg supports dropColumn
      t.dropColumn('reminder_at');
      t.dropColumn('email');
      t.dropColumn('booking_type');
      t.dropColumn('booking_id');
      t.dropColumn('sent_at');
      t.dropColumn('meta');
    }
  });
}

