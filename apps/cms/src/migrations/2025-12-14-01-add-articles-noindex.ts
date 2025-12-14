import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

// Добавляем флаг noindex для статей, чтобы исключать их из sitemap и поисковой индексации
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS articles
    ADD COLUMN IF NOT EXISTS noindex boolean NOT NULL DEFAULT false;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS articles
    DROP COLUMN IF EXISTS noindex;
  `);
}
