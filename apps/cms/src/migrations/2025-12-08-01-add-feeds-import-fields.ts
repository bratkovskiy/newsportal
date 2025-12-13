import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from '@payloadcms/db-postgres';

// Adds auxiliary fields for RSS import management on the `feeds` collection:
// - cron (text note about schedule)
// - lastImportedAt (timestamp)
// - lastImportStatus (short text status)
//
// Safe to run on existing databases: uses IF NOT EXISTS / IF EXISTS.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    ADD COLUMN IF NOT EXISTS cron varchar;
  `);

  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    ADD COLUMN IF NOT EXISTS last_imported_at timestamp(3) with time zone;
  `);

  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    ADD COLUMN IF NOT EXISTS last_import_status varchar;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    DROP COLUMN IF EXISTS cron;
  `);

  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    DROP COLUMN IF EXISTS last_imported_at;
  `);

  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    DROP COLUMN IF EXISTS last_import_status;
  `);
}
