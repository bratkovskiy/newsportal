# Руководство по переменным окружения в Astro

## Почему после правок пропадают данные?

### Проблема

В Astro **нельзя использовать `process.env`** для доступа к переменным окружения. Вместо этого нужно использовать `import.meta.env`.

### Причина

Astro компилирует код по-разному для клиента и сервера:
- **Серверный код** (SSR) выполняется при сборке страницы
- **Клиентский код** выполняется в браузере

`process.env` - это Node.js API, который недоступен в браузере и не работает корректно в Astro даже на сервере.

### Решение

#### 1. Всегда используйте `import.meta.env`

❌ **Неправильно:**
```typescript
const CMS_URL = process.env.CMS_URL || 'http://cms:3000';
```

✅ **Правильно:**
```typescript
const CMS_URL = import.meta.env.CMS_URL || 'http://cms:3000';
```

#### 2. Добавьте переменные в `.env`

Файл: `/apps/web/.env`

```env
# Для серверного кода (SSR)
CMS_URL=http://localhost:3000

# Для клиентского кода (должны начинаться с PUBLIC_)
PUBLIC_CMS_URL=http://localhost:3000
PUBLIC_PLACEHOLDER_URL=http://localhost:3000/api/media/file/placeholder-1.jpg

# Базовый URL сайта
SITE=http://localhost:4321
```

**Важно:** Переменные с префиксом `PUBLIC_` доступны в клиентском коде JavaScript.

#### 3. Добавьте типы TypeScript

Файл: `/apps/web/src/env.d.ts`

```typescript
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly CMS_URL: string;
  readonly PUBLIC_CMS_URL: string;
  readonly PUBLIC_PLACEHOLDER_URL: string;
  readonly PUBLIC_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

Это добавит автодополнение и проверку типов для ваших переменных.

## Где используются переменные окружения

### Файлы, которые должны использовать `import.meta.env`:

- ✅ `/apps/web/src/pages/**/*.astro` - все страницы
- ✅ `/apps/web/src/layouts/**/*.astro` - все layout'ы
- ✅ `/apps/web/src/components/**/*.astro` - все компоненты
- ✅ `/apps/web/src/config/**/*.ts` - конфигурационные файлы
- ✅ `/apps/web/src/pages/api/**/*.ts` - API routes

### Текущие файлы с переменными окружения:

1. `/apps/web/src/pages/index.astro` - главная страница
2. `/apps/web/src/pages/categories/[slug].astro` - страницы категорий
3. `/apps/web/src/pages/tags/[slug].astro` - страницы тегов
4. `/apps/web/src/pages/tags/index.astro` - список тегов
5. `/apps/web/src/pages/article/[...slug].astro` - страницы статей
6. `/apps/web/src/pages/api/frontend/articles.ts` - API автоподгрузки
7. `/apps/web/src/layouts/BaseLayout.astro` - базовый layout (меню категорий)
8. `/apps/web/src/config/seo.ts` - SEO конфигурация

## Что делать при добавлении нового кода

### Чеклист перед коммитом:

1. ✅ Проверьте, что нет `process.env` в коде:
   ```bash
   grep -r "process\.env" apps/web/src/
   ```

2. ✅ Используйте только `import.meta.env`

3. ✅ Добавьте новые переменные в `.env` и `env.d.ts`

4. ✅ Перезапустите dev-сервер после изменения `.env`:
   ```bash
   # Остановить: Ctrl+C
   npm run dev
   ```

## Перезапуск dev-сервера

После изменения файла `.env` **обязательно** перезапустите dev-сервер:

```bash
cd /home/ilia/news_project/apps/web
# Остановить текущий процесс: Ctrl+C
npm run dev
```

Astro не перезагружает переменные окружения автоматически при изменении `.env` файла.

## Симптомы проблемы

Если вы видите эти симптомы, вероятно где-то используется `process.env`:

- ❌ Пустая главная страница (нет статей)
- ❌ Пропали ссылки на категории в меню
- ❌ Не работает автоподгрузка статей
- ❌ 404 ошибки на страницах категорий/тегов
- ❌ Не отображаются изображения

### Быстрая диагностика:

```bash
# Проверить, есть ли process.env в коде
grep -r "process\.env" apps/web/src/

# Проверить, работает ли API
curl http://localhost:3000/api/articles?limit=1

# Проверить переменные в .env
cat apps/web/.env
```

## Docker vs Локальная разработка

### Локальная разработка (dev-сервер)
```env
CMS_URL=http://localhost:3000
PUBLIC_CMS_URL=http://localhost:3000
```

### Docker (production)
```env
CMS_URL=http://cms:3000
PUBLIC_CMS_URL=http://localhost:3000
```

В Docker контейнеры общаются через внутреннюю сеть по именам сервисов (`cms`), но браузер использует `localhost`.

## Полезные команды

```bash
# Проверить, что dev-сервер работает
curl http://localhost:4322/

# Проверить, загружаются ли статьи
curl http://localhost:4322/ | grep "data-index" | wc -l

# Проверить, есть ли категории в меню
curl http://localhost:4322/ | grep "categories/" | wc -l

# Найти все использования process.env
grep -rn "process\.env" apps/web/src/

# Проверить текущий порт Astro
lsof -i :4321
lsof -i :4322
```

## Важно помнить

1. **Никогда не используйте `process.env` в Astro коде**
2. **Всегда используйте `import.meta.env`**
3. **Перезапускайте dev-сервер после изменения `.env`**
4. **Добавляйте типы в `env.d.ts` для новых переменных**
5. **Используйте `PUBLIC_` префикс для клиентских переменных**

При соблюдении этих правил проблемы с "пропаданием данных" не будут возникать.
