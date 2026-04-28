/**
 * Поля для обучения: галерея в материале курса; текст ДЗ / расписания / новостей в записи на курс.
 */
export async function up(knex) {
  const addContentGallery = !(await knex.schema.hasColumn('course_content', 'gallery_images'));
  if (addContentGallery) {
    await knex.schema.alterTable('course_content', (t) => {
      t.text('gallery_images');
    });
  }

  const bookingCols = [
    ['homework_text', (t) => t.text('homework_text')],
    ['schedule_notes', (t) => t.text('schedule_notes')],
    ['bulletin_text', (t) => t.text('bulletin_text')],
  ];
  for (const [name, col] of bookingCols) {
    if (!(await knex.schema.hasColumn('course_bookings', name))) {
      await knex.schema.alterTable('course_bookings', col);
    }
  }
}

export async function down(knex) {
  if (await knex.schema.hasColumn('course_content', 'gallery_images')) {
    await knex.schema.alterTable('course_content', (t) => t.dropColumn('gallery_images'));
  }
  for (const name of ['homework_text', 'schedule_notes', 'bulletin_text']) {
    if (await knex.schema.hasColumn('course_bookings', name)) {
      await knex.schema.alterTable('course_bookings', (t) => t.dropColumn(name));
    }
  }
}
