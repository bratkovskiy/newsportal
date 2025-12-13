import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

/**
 * Add missing "ad_slots_id" column to the internal "payload_locked_documents_rels" table.
 *
 * Payload expects this column to exist for the new "ad-slots" collection when
 * querying locked documents (optimistic locking). Our custom migrations only
 * created the "ad_slots" table itself, so this relation column was never added,
 * which leads to runtime errors like:
 *   column payload_locked_documents__rels.ad_slots_id does not exist
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "payload_locked_documents_rels"
    ADD COLUMN IF NOT EXISTS "ad_slots_id" integer
    REFERENCES "ad_slots"("id") ON DELETE SET NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "payload_locked_documents_rels"
    DROP COLUMN IF EXISTS "ad_slots_id";
  `);
}
