import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Добавляем колонку version_view_count в таблицу версий articles
  await db.execute(sql`
    ALTER TABLE IF EXISTS "_articles_v"
    ADD COLUMN IF NOT EXISTS version_view_count integer NOT NULL DEFAULT 0;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Удаляем колонку
  await db.execute(sql`
    ALTER TABLE IF EXISTS "_articles_v"
    DROP COLUMN IF EXISTS version_view_count;
  `);
}
