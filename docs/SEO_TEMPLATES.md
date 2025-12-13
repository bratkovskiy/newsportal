# SEO Templates

## Обзор

Добавлены централизованные SEO-шаблоны для формирования тегов `title` и `description` на всех типах страниц проекта.

## Конфигурация

Файл: `/apps/web/src/config/seo.ts`

### Основные параметры

- **brandName**: Название бренда (по умолчанию: "FashionSite")
- **baseUrl**: Базовый URL сайта

### Функции генерации SEO-тегов

#### 1. Главная страница

```typescript
generateHomeTitle(articleCount: number): string
generateHomeDescription(articleCount: number): string
```

**Шаблоны:**
- **Title**: `Последние новости сегодня — {кол-во} материалов | {Бренд}`
- **Description**: `Актуальные события, аналитика и топ-материалы: {кол-во} свежих новостей в России и мире на {Бренд}.`

**Пример использования:**
```typescript
const articleCount = articles.length;
const metaTitle = generateHomeTitle(articleCount);
const metaDescription = generateHomeDescription(articleCount);
```

#### 2. Страницы разделов/категорий

```typescript
generateCategoryTitle(categoryName: string, articleCount: number): string
generateCategoryDescription(categoryName: string, articleCount: number): string
```

**Шаблоны:**
- **Title**: `{Раздел} — {кол-во} новостей и статей | {Бренд}`
- **Description**: `{кол-во} свежих материалов по теме «{Раздел}»: события, мнения, хроника на {Бренд}.`

**Пример использования:**
```typescript
const articleCount = articles.length;
const metaTitle = category.metaTitle || generateCategoryTitle(category.name, articleCount);
const metaDescription = category.metaDescription || generateCategoryDescription(category.name, articleCount);
```

#### 3. Страницы тегов

```typescript
generateTagTitle(tagName: string, articleCount: number): string
generateTagDescription(tagName: string, articleCount: number): string
```

**Шаблоны:**
- **Title**: `{Тег} — {кол-во} материалов, новости и обзор | {Бренд}`
- **Description**: `Подборка материалов по тегу «{Тег}»: {кол-во} новостей, аналитика, фото и видео на {Бренд}.`

**Пример использования:**
```typescript
const articleCount = articles.length;
const metaTitle = tag.metaTitle || generateTagTitle(tag.name, articleCount);
const metaDescription = tag.metaDescription || generateTagDescription(tag.name, articleCount);
```

#### 4. Страница поиска

```typescript
generateSearchTitle(query: string, resultCount: number): string
generateSearchDescription(query: string, resultCount: number): string
```

**Шаблоны:**
- **Title**: `Поиск «{запрос}» — {кол-во} результатов | {Бренд}`
- **Description**: `Найдено {кол-во} материалов по запросу «{запрос}»: новости, статьи, мнения на {Бренд}.`

**Пример использования:**
```typescript
const resultCount = searchResults.length;
const metaTitle = query ? generateSearchTitle(query, resultCount) : `Поиск | ${SITE_CONFIG.brandName}`;
const metaDescription = query ? generateSearchDescription(query, resultCount) : `Поиск материалов на ${SITE_CONFIG.brandName}.`;
```

#### 5. Страница статьи/материала

```typescript
generateArticleTitle(articleTitle: string): string
generateArticleDescription(excerpt: string): string
```

**Шаблоны:**
- **Title**: `{Заголовок новости} | {Бренд}`
- **Description**: `{Excerpt до точки или до 150-160 символов с мягким обрезанием}. Подробности — на {Бренд}.`

**Логика обработки description:**
1. Если найдена точка в пределах 160 символов — обрезаем по первую точку
2. Если excerpt короче 160 символов — используем полностью
3. Если длиннее — обрезаем до 160 символов по последнему пробелу (мягкое обрезание)
4. Добавляем фразу "Подробности — на {Бренд}."

**Пример использования:**
```typescript
const metaTitle = generateArticleTitle(title);
const metaDescription = generateArticleDescription(excerpt);
```

## Обновленные файлы

### Страницы

1. **Главная страница**: `/apps/web/src/pages/index.astro`
2. **Страницы категорий**: `/apps/web/src/pages/categories/[slug].astro`
3. **Страницы тегов**: `/apps/web/src/pages/tags/[slug].astro`
4. **Страница поиска**: `/apps/web/src/pages/search.astro`
5. **Страница статьи**: `/apps/web/src/pages/article/[...slug].astro`

### Layouts

1. **Article Layout**: `/apps/web/src/layouts/Article.astro` - использует SEO-шаблоны для статей

### Компоненты

1. **MetaTags**: `/apps/web/src/components/seo/MetaTags.astro` - обновлен для использования централизованного бренда

## Приоритет SEO-тегов

Для страниц категорий и тегов используется следующий приоритет:

1. **Кастомные значения** из CMS (`category.metaTitle` / `category.metaDescription`)
2. **Автоматически сгенерированные** шаблоны (если кастомные значения отсутствуют)

Это позволяет SEO-специалистам переопределять автоматические шаблоны через CMS для конкретных страниц.

## Изменение названия бренда

Чтобы изменить название бренда на всех страницах, отредактируйте файл `/apps/web/src/config/seo.ts`:

```typescript
export const SITE_CONFIG = {
  brandName: 'Ваше название бренда',
  baseUrl: process.env.PUBLIC_SITE_URL || 'https://yoursite.com',
};
```

## Рекомендации

1. **Динамическое количество материалов**: Все шаблоны используют реальное количество материалов на странице
2. **Локализация**: При необходимости локализации создайте отдельные функции для каждого языка
3. **A/B тестирование**: Можно добавить варианты шаблонов для A/B тестирования через конфиг
4. **Мониторинг**: Следите за длиной title (оптимально до 60 символов) и description (оптимально до 160 символов)
