import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Добавляем поле slug
  await db.execute(sql`
    ALTER TABLE IF EXISTS categories
    ADD COLUMN IF NOT EXISTS slug varchar UNIQUE;
  `);

  // Добавляем поле metaTitle
  await db.execute(sql`
    ALTER TABLE IF EXISTS categories
    ADD COLUMN IF NOT EXISTS meta_title varchar;
  `);

  // Добавляем поле metaDescription
  await db.execute(sql`
    ALTER TABLE IF EXISTS categories
    ADD COLUMN IF NOT EXISTS meta_description text;
  `);

  await db.execute(sql`
    DO $$
    BEGIN
      IF to_regclass('public.categories') IS NOT NULL THEN
        UPDATE categories
        SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Zа-яА-ЯёЁ0-9\\s-]', '', 'g'))
        WHERE slug IS NULL;

        UPDATE categories
        SET slug = REGEXP_REPLACE(slug, '\\s+', '-', 'g')
        WHERE slug IS NOT NULL;

        UPDATE categories
        SET slug = REGEXP_REPLACE(slug, '-+', '-', 'g')
        WHERE slug IS NOT NULL;

        UPDATE categories
        SET meta_title = CONCAT(name, ' - LADY.NEWS')
        WHERE meta_title IS NULL;

        UPDATE categories
        SET meta_description = CONCAT('Все материалы из категории ', name)
        WHERE meta_description IS NULL;
      END IF;
    END $$;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS categories
    DROP COLUMN IF EXISTS slug;
  `);

  await db.execute(sql`
    ALTER TABLE IF EXISTS categories
    DROP COLUMN IF EXISTS meta_title;
  `);

  await db.execute(sql`
    ALTER TABLE IF EXISTS categories
    DROP COLUMN IF EXISTS meta_description;
  `);
}
