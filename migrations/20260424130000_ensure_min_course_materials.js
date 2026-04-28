/**
 * Гарантирует минимум 3 учебных материала для каждого курса.
 */
export async function up(knex) {
  const courses = await knex('courses').select('id', 'name').orderBy('id');
  for (const course of courses) {
    let modules = await knex('course_modules').where({ course_id: course.id }).orderBy('sort_order');
    if (modules.length === 0) {
      await knex('course_modules').insert([
        { course_id: course.id, title: 'Введение и безопасность', description: 'Базовые принципы', sort_order: 1 },
        { course_id: course.id, title: 'Инструменты и техники', description: 'Практический блок', sort_order: 2 },
        { course_id: course.id, title: 'Практика и разбор ошибок', description: 'Подготовка к тестам', sort_order: 3 },
      ]);
      modules = await knex('course_modules').where({ course_id: course.id }).orderBy('sort_order');
    }
    const contentCountRow = await knex('course_content')
      .join('course_modules', 'course_content.module_id', 'course_modules.id')
      .where('course_modules.course_id', course.id)
      .count({ count: '*' })
      .first();
    const currentCount = Number(contentCountRow?.count ?? 0);
    const needed = Math.max(0, 3 - currentCount);
    if (needed === 0) continue;

    const template = [
      {
        title: `${course.name}: теория и база`,
        type: 'article',
        content:
          '## Цель темы\nИзучить ключевые принципы и подготовиться к тесту.\n\n## Ключевые мысли\n- Безопасность и этика.\n- Алгоритм действий.\n- Разбор ошибок.\n\n## Самопроверка\nСделайте чек-лист и сверяйтесь с ним перед тестом.',
        file_path: null,
        duration_minutes: null,
      },
      {
        title: `${course.name}: видео-разбор`,
        type: 'video',
        content: 'Видео с разбором темы курса и контрольными вопросами для самопроверки.',
        file_path: '/videos/tools.mp4',
        duration_minutes: 15,
      },
      {
        title: `${course.name}: практические кейсы`,
        type: 'article',
        content:
          '## Кейсы\nРазберите практические ситуации.\n\n## Подготовка к тесту\nСформулируйте решения и причины выбора каждого действия.',
        file_path: null,
        duration_minutes: 10,
      },
    ];

    for (let i = 0; i < needed; i++) {
      const t = template[(currentCount + i) % template.length];
      const module = modules[(currentCount + i) % modules.length];
      await knex('course_content').insert({
        module_id: module.id,
        title: t.title,
        type: t.type,
        content: t.content,
        file_path: t.file_path,
        duration_minutes: t.duration_minutes,
        sort_order: currentCount + i + 1,
        is_required: true,
        gallery_images: JSON.stringify([
          '/pictures/The basics of dog grooming.jpg',
          '/pictures/Professional grooming.jpg',
          '/pictures/Creative grooming.jpg',
        ]),
      });
    }
  }
}

export async function down() {
  // необратимая миграция контента
}
