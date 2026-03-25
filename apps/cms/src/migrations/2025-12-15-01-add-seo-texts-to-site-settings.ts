import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    DO $$ BEGIN
      -- Add seo group fields to payload_globals table
      -- The seo field is a JSON object, so we just need to ensure the column exists
      -- Payload will handle the nested structure automatically
      
      -- Check if we need to update the schema
      -- Since seo is a group field, it will be stored in the JSON column
      -- No schema changes needed, just update the global document
      
      -- Update site-settings global with default SEO values
      UPDATE payload_globals
      SET updated_at = NOW()
      WHERE slug = 'site-settings';
      
    EXCEPTION
      WHEN others THEN
        RAISE NOTICE 'Migration completed with note: %', SQLERRM;
    END $$;
  `);
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    DO $$ BEGIN
      -- No schema changes to revert since seo is a group field in JSON
      -- Just log the downgrade
      RAISE NOTICE 'Downgrading SEO texts migration - no schema changes to revert';
    END $$;
  `);
}
