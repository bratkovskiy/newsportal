import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Создаём таблицу для глобала analytics-settings
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS analytics_settings (
      id serial PRIMARY KEY,
      yandex_metrica_enabled boolean DEFAULT false,
      yandex_metrica_counter_id varchar(255),
      google_analytics_enabled boolean DEFAULT false,
      google_analytics_measurement_id varchar(255),
      webmaster_google_verification varchar(255),
      webmaster_yandex_verification varchar(255),
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Удаляем таблицу глобала analytics-settings
  await db.execute(sql`
    DROP TABLE IF EXISTS analytics_settings;
  `);
}
