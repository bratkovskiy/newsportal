import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "seo_home_title_en" varchar,
      ADD COLUMN IF NOT EXISTS "seo_home_title_ru" varchar,
      ADD COLUMN IF NOT EXISTS "seo_home_description_en" varchar,
      ADD COLUMN IF NOT EXISTS "seo_home_description_ru" varchar,
      ADD COLUMN IF NOT EXISTS "seo_category_title_suffix_en" varchar,
      ADD COLUMN IF NOT EXISTS "seo_category_title_suffix_ru" varchar,
      ADD COLUMN IF NOT EXISTS "seo_category_description_template_en" varchar,
      ADD COLUMN IF NOT EXISTS "seo_category_description_template_ru" varchar,
      ADD COLUMN IF NOT EXISTS "seo_tag_title_suffix_en" varchar,
      ADD COLUMN IF NOT EXISTS "seo_tag_title_suffix_ru" varchar,
      ADD COLUMN IF NOT EXISTS "seo_tag_description_template_en" varchar,
      ADD COLUMN IF NOT EXISTS "seo_tag_description_template_ru" varchar,
      ADD COLUMN IF NOT EXISTS "seo_search_title_template_en" varchar,
      ADD COLUMN IF NOT EXISTS "seo_search_title_template_ru" varchar,
      ADD COLUMN IF NOT EXISTS "seo_search_description_template_en" varchar,
      ADD COLUMN IF NOT EXISTS "seo_search_description_template_ru" varchar,
      ADD COLUMN IF NOT EXISTS "seo_article_read_more_en" varchar,
      ADD COLUMN IF NOT EXISTS "seo_article_read_more_ru" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings"
      DROP COLUMN IF EXISTS "seo_home_title_en",
      DROP COLUMN IF EXISTS "seo_home_title_ru",
      DROP COLUMN IF EXISTS "seo_home_description_en",
      DROP COLUMN IF EXISTS "seo_home_description_ru",
      DROP COLUMN IF EXISTS "seo_category_title_suffix_en",
      DROP COLUMN IF EXISTS "seo_category_title_suffix_ru",
      DROP COLUMN IF EXISTS "seo_category_description_template_en",
      DROP COLUMN IF EXISTS "seo_category_description_template_ru",
      DROP COLUMN IF EXISTS "seo_tag_title_suffix_en",
      DROP COLUMN IF EXISTS "seo_tag_title_suffix_ru",
      DROP COLUMN IF EXISTS "seo_tag_description_template_en",
      DROP COLUMN IF EXISTS "seo_tag_description_template_ru",
      DROP COLUMN IF EXISTS "seo_search_title_template_en",
      DROP COLUMN IF EXISTS "seo_search_title_template_ru",
      DROP COLUMN IF EXISTS "seo_search_description_template_en",
      DROP COLUMN IF EXISTS "seo_search_description_template_ru",
      DROP COLUMN IF EXISTS "seo_article_read_more_en",
      DROP COLUMN IF EXISTS "seo_article_read_more_ru";
  `)
}
