import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

// Добавляем в analytics_settings поле для произвольного HTML-кода в <head>
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS analytics_settings
    ADD COLUMN IF NOT EXISTS custom_head_html text;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS analytics_settings
    DROP COLUMN IF EXISTS custom_head_html;
  `);
}
