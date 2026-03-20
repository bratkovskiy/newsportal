# Astro Article Components — modareview.com
## Структура файлов

```
apps/web/src/
├── styles/
│   └── global.css                          ← Design tokens + reset
├── layouts/
│   └── ArticleLayout.astro                 ← Главный layout страницы статьи
├── components/
│   ├── Nav.astro                           ← Навигация (sticky, mobile)
│   └── article/
│       ├── ArticleMeta.astro               ← Автор, дата, время чтения
│       ├── ArticleCover.astro              ← Обложка (feedImageUrl)
│       ├── ArticleBody.astro               ← Стили для HTML из Lexical CMS
│       └── RelatedArticles.astro           ← Похожие статьи (2×2 сетка)
└── pages/
    └── articles/
        └── [slug].astro                    ← Страница статьи (SSG)
```

---

## Что делает каждый файл

### `global.css`
CSS-переменные (дизайн-токены) и базовый reset.
Подключить в `ArticleLayout.astro` — уже сделано через `import`.

### `ArticleLayout.astro`
- SEO: `<title>`, `<meta>`, Open Graph, JSON-LD (Article schema)
- Хлебные крошки
- Заголовок + категория-бейдж
- Рендеринг дочерних компонентов через `<slot />`

### `ArticleBody.astro`
**Самый важный файл.** Содержит все CSS-стили для HTML, который генерирует
Payload CMS Lexical editor:
- `p` — параграфы (первый параграф — лид, чуть крупнее)
- `h2`, `h3`, `h4` — иерархия заголовков с акцентной полосой у H2
- `ul`, `ol` — списки с кастомными маркерами
- `table`, `thead`, `tbody`, `caption` — полноценные стилизованные таблицы
- `figure`, `figcaption`, `img` — изображения (full-bleed на мобиле)
- `blockquote` — цитата с акцентной полосой
- `.faq`, `.faq-item`, `.faq-q`, `.faq-a` — FAQ секция
- `.conclusion-box` — тёмный блок итогов

### `[slug].astro`
- SSG через `getStaticPaths()`
- Fetches статью из `CMS_URL/api/articles`
- Считает `readingTime` (≈200 wpm)
- Подгружает 4 related articles из той же категории

---

## Интеграция

### 1. Скопировать файлы в проект
```bash
cp -r astro-components/src/styles/       apps/web/src/styles/
cp -r astro-components/src/layouts/      apps/web/src/layouts/
cp -r astro-components/src/components/   apps/web/src/components/
cp    astro-components/src/pages/articles/[slug].astro  apps/web/src/pages/articles/[slug].astro
```

### 2. Переменные окружения
В `apps/web/.env`:
```
CMS_URL=http://localhost:3000
# или на продакшене:
# CMS_URL=http://cms:3000
```

### 3. Payload CMS — HTML serializer для Lexical
Lexical хранит контент как JSON. Чтобы получить HTML, нужен serializer.
Payload 3.x предоставляет `@payloadcms/richtext-lexical/html`:

```typescript
// apps/cms/src/collections/Articles.ts — в afterRead hook
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html';

// или в Astro-странице перед рендером:
// article.content уже должен быть HTML строкой
```

Если CMS возвращает Lexical JSON вместо HTML — добавьте конвертацию
в `[slug].astro` перед передачей в `ArticleBody`.

### 4. Таблицы из CMS
Если Payload CMS генерирует таблицы без `<caption>` — стили всё равно
применятся корректно. `caption` — опциональный элемент.

### 5. Категории в Nav
В `Nav.astro` категории захардкожены для примера.
Замените на fetch из CMS (первые 10 по алфавиту, как в архитектуре):

```astro
const res = await fetch(`${CMS_URL}/api/categories?sort=name&limit=10`);
const { docs: categories } = await res.json();
```

---

## Дизайн-токены (переменные)

| Переменная       | Значение    | Использование              |
|-----------------|-------------|---------------------------|
| `--cream`        | `#FAF8F5`   | Фон страницы               |
| `--stone`        | `#E8E3DC`   | Фон карточек, аватаров     |
| `--accent`       | `#C4956A`   | Акцент (тёплое золото)     |
| `--accent-light` | `#F0E6D8`   | Бледный акцент             |
| `--ink`          | `#1A1612`   | Тёмные заголовки           |
| `--text`         | `#3D3530`   | Основной текст             |
| `--text-light`   | `#6B6059`   | Вторичный текст            |
| `--line`         | `#E0D9D0`   | Разделители                |
| `--font-display` | Playfair Display | Заголовки, цитаты    |
| `--font-body`    | DM Sans     | Основной текст             |

Все переменные в `global.css` — меняя их, вы меняете весь сайт.

---

## Что исправлено относительно текущего дизайна

| Проблема                    | Решение                                    |
|----------------------------|--------------------------------------------|
| Шрифты разных размеров      | Чёткая иерархия через CSS-переменные       |
| Таблицы не стилизованы      | `ArticleBody.astro` — полная стилизация    |
| Отсутствие визуальной иерархии | H2 с акцентной полосой, H3 курсивом    |
| Изображения без обрамления  | `figure` + `figcaption`, full-bleed        |
| Списки без маркеров         | Кастомные точки через псевдоэлементы       |
| Монотонный текст            | Первый параграф — лид, крупнее             |
| Нет мобильной адаптации     | Таблицы скроллятся, изображения full-bleed |
