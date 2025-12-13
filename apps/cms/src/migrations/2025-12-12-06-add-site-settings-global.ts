import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      id serial PRIMARY KEY,
      current_language varchar(10) DEFAULT 'ru',
      labels_home_main_ru varchar(255),
      labels_home_main_en varchar(255),
      labels_home_latest_ru varchar(255),
      labels_home_latest_en varchar(255),
      labels_home_must_read_ru varchar(255),
      labels_home_must_read_en varchar(255),
      labels_home_popular_ru varchar(255),
      labels_home_popular_en varchar(255),
      labels_home_tags_ru varchar(255),
      labels_home_tags_en varchar(255),
      labels_article_read_more_ru varchar(255),
      labels_article_read_more_en varchar(255),
      labels_article_also_on_topic_ru varchar(255),
      labels_article_also_on_topic_en varchar(255),
      footer_text_ru varchar(255),
      footer_text_en varchar(255),
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS site_settings;
  `);
}
