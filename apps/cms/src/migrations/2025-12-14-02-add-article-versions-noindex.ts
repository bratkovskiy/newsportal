import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "_articles_v"
    ADD COLUMN IF NOT EXISTS version_noindex boolean NOT NULL DEFAULT false;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "_articles_v"
    DROP COLUMN IF EXISTS version_noindex;
  `);
}
