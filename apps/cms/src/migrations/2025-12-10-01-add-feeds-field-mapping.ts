import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from '@payloadcms/db-postgres';

// Adds fieldMapping columns to the `feeds` collection for storing
// field mapping configuration between feed fields and article fields.
//
// Safe to run on existing databases: uses IF NOT EXISTS / IF EXISTS.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    ADD COLUMN IF NOT EXISTS field_mapping_title_field varchar DEFAULT 'title';
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    ADD COLUMN IF NOT EXISTS field_mapping_content_field varchar DEFAULT 'content:encoded';
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    ADD COLUMN IF NOT EXISTS field_mapping_excerpt_field varchar DEFAULT 'custom:secondTitle';
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    ADD COLUMN IF NOT EXISTS field_mapping_author_field varchar DEFAULT 'dc:creator';
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    ADD COLUMN IF NOT EXISTS field_mapping_category_field varchar DEFAULT 'custom:category';
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    ADD COLUMN IF NOT EXISTS field_mapping_tags_field varchar DEFAULT 'category';
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    ADD COLUMN IF NOT EXISTS field_mapping_image_field varchar DEFAULT 'custom:image';
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    ADD COLUMN IF NOT EXISTS field_mapping_date_field varchar DEFAULT 'pubDate';
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    ADD COLUMN IF NOT EXISTS field_mapping_default_category_id integer DEFAULT 64;
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    ADD COLUMN IF NOT EXISTS field_mapping_author_source varchar DEFAULT 'from_feed';
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    ADD COLUMN IF NOT EXISTS field_mapping_existing_author_id integer;
  `);
  
  // Drop old column if it was created with double _id
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    DROP COLUMN IF EXISTS field_mapping_existing_author_id_id;
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    ADD COLUMN IF NOT EXISTS field_mapping_new_author_name varchar;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    DROP COLUMN IF EXISTS field_mapping_title_field;
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    DROP COLUMN IF EXISTS field_mapping_content_field;
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    DROP COLUMN IF EXISTS field_mapping_excerpt_field;
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    DROP COLUMN IF EXISTS field_mapping_author_field;
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    DROP COLUMN IF EXISTS field_mapping_category_field;
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    DROP COLUMN IF EXISTS field_mapping_tags_field;
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    DROP COLUMN IF EXISTS field_mapping_image_field;
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    DROP COLUMN IF EXISTS field_mapping_date_field;
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    DROP COLUMN IF EXISTS field_mapping_default_category_id;
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    DROP COLUMN IF EXISTS field_mapping_author_source;
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    DROP COLUMN IF EXISTS field_mapping_existing_author_id;
  `);
  
  await db.execute(sql`
    ALTER TABLE IF EXISTS feeds
    DROP COLUMN IF EXISTS field_mapping_new_author_name;
  `);
}
