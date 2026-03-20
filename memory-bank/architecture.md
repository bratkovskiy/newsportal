# Architecture: modareview.com

**Последнее обновление:** 20 марта 2026

---

## Общая архитектура

modareview.com — монорепозиторий новостного портала, состоящий из трёх основных сервисов:

1. **CMS** — Payload CMS (админка для управления контентом)
2. **Frontend** — Astro сайт (публичный сайт)
3. **Jobs** — фоновый сервис (автоматический импорт RSS-фидов)

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Astro Site    │ ← Frontend (port 4321)
│   (apps/web)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │ ← Database (articles, categories, feeds)
│    Database     │
└────────┬────────┘
         ▲
         │
    ┌────┴────┐
    │         │
┌───┴───┐ ┌──┴──────┐
│ CMS   │ │  Jobs   │
│(3000) │ │ Service │
└───────┘ └─────────┘
    ↑         ↑
    │         │
Payload    BullMQ
 Admin     + Redis
```

---

## Frontend: Astro Site (apps/web)

**Технологии:**
- Astro 4.0
- TypeScript
- TailwindCSS
- React (для интерактивных компонентов)
- Typesense (поиск)

**Порт:** 4321

**Основные страницы:**
- `/` — главная страница
- `/articles/[slug]` — страница статьи
- `/categories/[slug]` — страница категории
- `/author/[slug]` — страница автора

**Функции:**
- Рендеринг статей из Payload CMS API
- SEO-оптимизация (meta tags, structured data)
- Адаптивный дизайн
- Навигация по категориям (первые 10 по алфавиту)
- Счётчики просмотров статей
- Поиск через Typesense

---

## Backend: Payload CMS (apps/cms)

**Технологии:**
- Payload CMS 3.0
- Next.js 15 (Payload использует Next.js как основу)
- TypeScript
- PostgreSQL (через @payloadcms/db-postgres)
- Lexical Rich Text Editor

**Порт:** 3000

**Основные эндпоинты:**
- `/admin` — административная панель Payload
- `/api` — REST API для коллекций
- `/api/feeds/:id/import` — импорт RSS-фида
- `/api/articles/:id/increment-view` — инкремент счётчика просмотров

**Коллекции:**
- **Articles** — статьи (title, content, slug, category, author, feedImageUrl, status)
- **Categories** — категории (name, slug, metaTitle, metaDescription)
- **Authors** — авторы (name, slug, bio, avatar)
- **Feeds** — RSS-фиды (url, enabled, type, cron, lastImportedAt, lastImportStatus)
- **Tags** — теги (опционально)

**Функции:**
- Управление контентом через админку
- Импорт статей из RSS-фидов
- Автогенерация slug, meta title, meta description для категорий
- Маппинг полей RSS → Articles
- Счётчики просмотров

---

## Фоновый сервис: Jobs (apps/jobs)

**Технологии:**
- Node.js
- BullMQ (очереди задач)
- Redis (для BullMQ)
- Cron-parser

**Функции:**
- Автоматический импорт RSS-фидов по расписанию
- Опрос CMS каждую минуту (настраивается через `FEEDS_IMPORT_INTERVAL_MINUTES`)
- Проверка cron-расписания для каждого фида
- Вызов API импорта в CMS

**Авторизация:**
- Заголовок `x-jobs-key` с ключом из `JOBS_API_KEY`

---

## Откуда берётся контент

Контент импортируется из **внешних RSS-фидов**.

### Процесс импорта статьи

1. **Настройка фида в CMS**
   - Добавление URL фида
   - Настройка маппинга полей (title, content, author, category, image)
   - Выбор источника автора (из фида / существующий / новый)
   - Настройка cron-расписания (опционально)

2. **Импорт (ручной или автоматический)**
   - Парсинг RSS XML
   - Маппинг полей по настройкам
   - Проверка наличия `<custom:image>` тега

3. **Создание статьи**
   - **Если есть `<custom:image>`:**
     - Статус: `published`
     - URL изображения → `feedImageUrl`
     - Статья сразу видна на сайте
   - **Если нет `<custom:image>`:**
     - Статус: `draft`
     - Статья не видна на сайте
     - Требуется ручное добавление обложки

4. **Публикация на frontend**
   - Astro запрашивает статьи с `_status = published`
   - Рендеринг страницы статьи
   - Индексация в Typesense (если настроено)

---

## Как публикуется контент

### RSS Import → Payload CMS → Astro Frontend

**Схема публикации:**

```
RSS Feed (внешний источник)
         │
         ▼
   Jobs Service (автоматически)
   или
   Админ (кнопка Import в CMS)
         │
         ▼
   Payload CMS API
   POST /api/feeds/:id/import
         │
         ▼
   PostgreSQL DB
   ┌──────────────────┐
   │ articles         │
   │ - id             │
   │ - slug           │
   │ - title          │
   │ - content        │
   │ - feedImageUrl   │
   │ - category       │
   │ - author         │
   │ - status         │
   │ - _status        │
   │ - publishedDate  │
   └──────────────────┘
         │
         ▼
   Astro Frontend
   (запрашивает _status=published)
```

**Статус статьи:**
- `draft` — черновик (не виден на сайте, нет обложки)
- `published` — опубликована (видна на сайте, есть обложка)

---

## Структура URL

**Паттерны URL:**

- Главная: `https://modareview.com/`
- Статья: `https://modareview.com/articles/{slug}`
- Категория: `https://modareview.com/category/{category-slug}`
- Автор: `https://modareview.com/author/{author-slug}`

**Примеры:**
- `https://modareview.com/articles/best-outfit-ideas-for-apple-body-shape-in-summer`
- `https://modareview.com/category/body-shape-guide`
- `https://modareview.com/author/rachel-sloan`

**Требования к slug:**
- Только lowercase
- Слова разделены дефисами
- Без спецсимволов
- SEO-friendly (содержит ключевые слова)

---

## Изображения

**Источник изображений:** RSS-фиды (тег `<custom:image>`)

**Хранение:**
- URL изображения из RSS сохраняется в поле `feedImageUrl`
- Изображения **не загружаются** на сервер, используются по прямой ссылке
- Payload CMS может хранить загруженные медиа в `cms_media` volume (для ручных загрузок)

**Использование на frontend:**
- Cover image: `feedImageUrl` из статьи
- Отображается в карточках на главной
- Отображается в шапке страницы статьи

**Планы (из памяти):**
- В будущем планируется использовать Bunny CDN для оптимизации изображений

---

## Структура статьи

### Типичная статья включает:

**1. Метаданные**
- `meta_title` (50-60 символов)
- `meta_description` (150-160 символов)
- `cover_image` (URL на CDN)
- `published_at` (дата публикации)
- `author` (Rachel Sloan)
- `category` (Body Shape Guide / Colors & Patterns / etc.)

**2. Заголовок (H1)**
- Один H1 на страницу
- Содержит основной ключевой запрос
- Привлекательный и информативный

**3. Cover Image**
- Высокое качество
- Релевантное теме
- Alt text для SEO

**4. Введение**
- 2-3 параграфа
- Описание проблемы
- Что читатель узнает из статьи

**5. Основные секции (H2)**
- 5-8 секций
- Каждая секция = отдельный подтопик
- Логическая структура

**6. Подсекции (H3)**
- Детализация внутри H2
- Списки и bullet points
- Конкретные примеры

**7. Изображения в секциях**
- Минимум 1 изображение на секцию
- Alt text описывает содержимое
- Caption (опционально)

**8. Таблицы**
- Для сравнений (Do's vs Don'ts)
- Для списков рекомендаций
- Для характеристик

**9. FAQ секция**
- 5-7 вопросов
- Короткие ответы
- Schema.org markup для Google

**10. Заключение**
- Краткое резюме
- Call to action
- Internal links на related статьи

---

## База данных

**СУБД:** PostgreSQL 15

**Управление схемой:** Payload CMS (автоматические миграции)

**Основные коллекции (таблицы):**

### articles
- id (PK)
- slug (unique, автогенерация из title)
- title
- content (Lexical JSON)
- feedImageUrl (URL обложки из RSS)
- category (relation)
- author (relation)
- status (draft/published)
- _status (draft/published)
- publishedDate
- viewCount (счётчик просмотров)
- createdAt
- updatedAt

### categories
- id (PK)
- name
- slug (unique, автогенерация из name)
- metaTitle (автогенерация: "{name} - LADY.NEWS")
- metaDescription (автогенерация: "Все материалы из категории {name}")
- createdAt
- updatedAt

### authors
- id (PK)
- name
- slug (автогенерация из name)
- bio
- avatar
- createdAt
- updatedAt

### feeds
- id (PK)
- url (RSS feed URL)
- enabled (boolean)
- type (rss/json)
- cron (cron-расписание, опционально)
- lastImportedAt (timestamp)
- lastImportStatus (текст)
- fieldMapping (JSON, маппинг полей)
- authorSource (from_feed/existing/new)
- defaultCategory (relation)
- createdAt
- updatedAt

### tags (опционально)
- id (PK)
- name
- slug
- createdAt
- updatedAt

---

## Деплой

**Сервер:** GCP VM  
**IP:** 34.159.128.84  
**Домен:** modareview.com  
**DNS:** Cloudflare (DNS-only, без прокси)

**Nginx конфигурация:**
- `/` → Next.js frontend (port 4321)
- `/admin`, `/api` → FastAPI backend (port 3000)

**Протокол:** HTTP (планируется HTTPS с Let's Encrypt)

---

## Автообновление RSS-фидов

**Механизм:**

1. В CMS для каждого фида можно задать поле `cron` (формат Unix-cron из 5 полей)
2. Фиды с **пустым `cron`** не импортируются автоматически (только ручной импорт)
3. Фиды с **заполненным `cron`** импортируются автоматически через сервис `jobs`
4. Сервис `jobs` опрашивает CMS каждую минуту (настраивается)
5. Для каждого фида проверяется: пора ли по cron запускать импорт
6. Если пора — вызывается `POST /api/feeds/:id/import`

**Примеры cron:**
- `* * * * *` — каждую минуту
- `*/5 * * * *` — каждые 5 минут
- `0 * * * *` — каждый час
- `0 3 * * *` — каждый день в 03:00
- `0 9 * * 1-5` — по будням в 09:00

---

## Будущие улучшения

**Технические:**
- [ ] HTTPS с SSL сертификатом (Let's Encrypt)
- [ ] Bunny CDN для изображений
- [ ] Full-text search через Typesense (частично реализовано)
- [ ] Sitemap автогенерация
- [ ] RSS feed для статей

**Контентные:**
- [ ] Related articles рекомендации
- [ ] Breadcrumbs навигация
- [ ] Table of contents для длинных статей
- [ ] Social sharing buttons
- [ ] Comments система (опционально)
