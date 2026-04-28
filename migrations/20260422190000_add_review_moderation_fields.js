export async function up(knex) {
  const hasStatus = await knex.schema.hasColumn('reviews', 'moderation_status');
  const hasModeratedAt = await knex.schema.hasColumn('reviews', 'moderated_at');
  const hasModeratedBy = await knex.schema.hasColumn('reviews', 'moderated_by');
  const hasModerationComment = await knex.schema.hasColumn('reviews', 'moderation_comment');

  await knex.schema.alterTable('reviews', (t) => {
    if (!hasStatus) t.string('moderation_status', 30).notNullable().defaultTo('pending');
    if (!hasModeratedAt) t.timestamp('moderated_at').nullable();
    if (!hasModeratedBy) t.integer('moderated_by').nullable().references('id').inTable('users').onDelete('SET NULL');
    if (!hasModerationComment) t.text('moderation_comment').nullable();
  });
  await knex('reviews').whereNull('moderation_status').update({ moderation_status: 'approved' });
}

export async function down(knex) {
  const hasStatus = await knex.schema.hasColumn('reviews', 'moderation_status');
  const hasModeratedAt = await knex.schema.hasColumn('reviews', 'moderated_at');
  const hasModeratedBy = await knex.schema.hasColumn('reviews', 'moderated_by');
  const hasModerationComment = await knex.schema.hasColumn('reviews', 'moderation_comment');

  await knex.schema.alterTable('reviews', (t) => {
    if (hasModerationComment) t.dropColumn('moderation_comment');
    if (hasModeratedBy) t.dropColumn('moderated_by');
    if (hasModeratedAt) t.dropColumn('moderated_at');
    if (hasStatus) t.dropColumn('moderation_status');
  });
}

