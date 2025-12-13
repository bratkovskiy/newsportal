import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from '@payloadcms/db-postgres';

// Добавляет поле version_feed_image_url в таблицу версий статей `_articles_v`,
// чтобы версии поддерживали новое поле feedImageUrl.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS _articles_v
    ADD COLUMN IF NOT EXISTS version_feed_image_url varchar;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS _articles_v
    DROP COLUMN IF EXISTS version_feed_image_url;
  `);
}
