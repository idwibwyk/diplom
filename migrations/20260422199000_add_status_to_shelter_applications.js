export async function up(knex) {
  const hasStatus = await knex.schema.hasColumn('shelter_applications', 'status');
  const hasAdminReply = await knex.schema.hasColumn('shelter_applications', 'admin_reply');
  const hasAnsweredAt = await knex.schema.hasColumn('shelter_applications', 'answered_at');

  await knex.schema.alterTable('shelter_applications', (table) => {
    if (!hasStatus) table.string('status', 50).notNullable().defaultTo('new');
    if (!hasAdminReply) table.text('admin_reply');
    if (!hasAnsweredAt) table.timestamp('answered_at');
  });
}

export async function down(knex) {
  const hasStatus = await knex.schema.hasColumn('shelter_applications', 'status');
  const hasAdminReply = await knex.schema.hasColumn('shelter_applications', 'admin_reply');
  const hasAnsweredAt = await knex.schema.hasColumn('shelter_applications', 'answered_at');

  await knex.schema.alterTable('shelter_applications', (table) => {
    if (hasAnsweredAt) table.dropColumn('answered_at');
    if (hasAdminReply) table.dropColumn('admin_reply');
    if (hasStatus) table.dropColumn('status');
  });
}
