import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Добавляем колонку view_count для articles
  await db.execute(sql`
    ALTER TABLE IF EXISTS articles
    ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0;
  `);

  // Добавляем индекс для быстрого поиска по просмотрам
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS articles_view_count_idx ON articles(view_count DESC);
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Удаляем индекс
  await db.execute(sql`
    DROP INDEX IF EXISTS articles_view_count_idx;
  `);

  // Удаляем колонку
  await db.execute(sql`
    ALTER TABLE IF EXISTS articles
    DROP COLUMN IF EXISTS view_count;
  `);
}
