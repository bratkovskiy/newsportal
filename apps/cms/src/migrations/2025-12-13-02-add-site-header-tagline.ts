import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

// Добавляем в site_settings поле header_tagline для второй строки логотипа в шапке
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS site_settings
    ADD COLUMN IF NOT EXISTS header_tagline varchar(255);
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS site_settings
    DROP COLUMN IF EXISTS header_tagline;
  `);
}
