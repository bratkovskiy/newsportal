import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

// Добавляем в ad_slots вспомогательное поле usage_hint для подсказки использования слота
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS ad_slots
    ADD COLUMN IF NOT EXISTS usage_hint text;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS ad_slots
    DROP COLUMN IF EXISTS usage_hint;
  `);
}
