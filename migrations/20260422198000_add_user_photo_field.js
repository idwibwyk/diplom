export async function up(knex) {
  const exists = await knex.schema.hasColumn('users', 'photo');
  if (!exists) {
    await knex.schema.alterTable('users', (table) => {
      table.string('photo', 500).nullable();
    });
  }
}

export async function down(knex) {
  const exists = await knex.schema.hasColumn('users', 'photo');
  if (exists) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('photo');
    });
  }
}
