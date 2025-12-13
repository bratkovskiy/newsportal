import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS articles
    ADD COLUMN IF NOT EXISTS home_main_block boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS home_top boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS home_must_read boolean NOT NULL DEFAULT false;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS articles
    DROP COLUMN IF EXISTS home_main_block,
    DROP COLUMN IF EXISTS home_top,
    DROP COLUMN IF EXISTS home_must_read;
  `);
}
