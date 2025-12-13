import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

// Добавляем в site_settings поля для названия сайта и CSS логотипа в шапке
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS site_settings
    ADD COLUMN IF NOT EXISTS site_name varchar(255),
    ADD COLUMN IF NOT EXISTS header_logo_css text;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS site_settings
    DROP COLUMN IF EXISTS site_name,
    DROP COLUMN IF EXISTS header_logo_css;
  `);
}
