import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  // Добавляем поле slug
  await db.execute(sql`
    ALTER TABLE IF EXISTS tags
    ADD COLUMN IF NOT EXISTS slug varchar UNIQUE;
  `);

  // Добавляем поле metaTitle
  await db.execute(sql`
    ALTER TABLE IF EXISTS tags
    ADD COLUMN IF NOT EXISTS meta_title varchar;
  `);

  // Добавляем поле metaDescription
  await db.execute(sql`
    ALTER TABLE IF EXISTS tags
    ADD COLUMN IF NOT EXISTS meta_description text;
  `);

  // Получаем все теги для генерации slug через TypeScript функцию transliterate
  const tagsResult = await db.execute(sql`
    SELECT id, name FROM tags WHERE slug IS NULL;
  `);

  // Функция транслитерации (копия из payload.config.ts)
  const cyrillicToLatinMap: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
    к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
    х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  };

  function transliterate(input: string): string {
    return input
      .toLowerCase()
      .split('')
      .map((char) => cyrillicToLatinMap[char] ?? char)
      .join('');
  }

  function slugify(input: string): string {
    const base = transliterate(input)
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return base || 'tag';
  }

  // Обновляем slug для каждого тега
  const tags = tagsResult.rows as Array<{ id: number; name: string }>;
  for (const tag of tags) {
    const slug = slugify(tag.name);
    await db.execute(sql`
      UPDATE tags
      SET slug = ${slug}
      WHERE id = ${tag.id};
    `);
  }

  // Генерируем metaTitle для существующих тегов
  await db.execute(sql`
    UPDATE tags
    SET meta_title = CONCAT(name, ' - LADY.NEWS')
    WHERE meta_title IS NULL;
  `);

  // Генерируем metaDescription для существующих тегов
  await db.execute(sql`
    UPDATE tags
    SET meta_description = CONCAT('Все материалы по тегу ', name)
    WHERE meta_description IS NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS tags
    DROP COLUMN IF EXISTS slug;
  `);

  await db.execute(sql`
    ALTER TABLE IF EXISTS tags
    DROP COLUMN IF EXISTS meta_title;
  `);

  await db.execute(sql`
    ALTER TABLE IF EXISTS tags
    DROP COLUMN IF EXISTS meta_description;
  `);
}
