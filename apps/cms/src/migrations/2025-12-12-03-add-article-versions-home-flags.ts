import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "_articles_v"
    ADD COLUMN IF NOT EXISTS version_home_main_block boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS version_home_top boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS version_home_must_read boolean NOT NULL DEFAULT false;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "_articles_v"
    DROP COLUMN IF EXISTS version_home_main_block,
    DROP COLUMN IF EXISTS version_home_top,
    DROP COLUMN IF EXISTS version_home_must_read;
  `);
}
