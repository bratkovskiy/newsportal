import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Создаём таблицу для глобала robots
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS robots (
      id serial PRIMARY KEY,
      content text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Удаляем таблицу глобала robots
  await db.execute(sql`
    DROP TABLE IF EXISTS robots;
  `);
}
