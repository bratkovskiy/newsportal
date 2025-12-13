import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS ad_slots (
      id serial PRIMARY KEY,
      key varchar(255) UNIQUE NOT NULL,
      label varchar(255),
      description text,
      enabled boolean DEFAULT false,
      provider varchar(50),
      yandex_block_id varchar(255),
      adsense_slot_id varchar(255),
      ad_format varchar(255),
      width integer,
      height integer,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS ad_slots;
  `);
}
