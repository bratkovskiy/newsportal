import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from '@payloadcms/db-postgres';

// Добавляет поле feed_image_url в таблицу articles для хранения URL обложки из RSS.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS articles
    ADD COLUMN IF NOT EXISTS feed_image_url varchar;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS articles
    DROP COLUMN IF EXISTS feed_image_url;
  `);
}
