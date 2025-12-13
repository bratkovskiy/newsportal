# Техническое задание (ТЗ)

Проект: Информационный сайт о моде
Цель: Привлечение органического трафика и монетизация через рекламные сети (Google AdSense* / Yandex Advertising Network).
*Примечание: для монетизации контента на сайте используется Google AdSense (а не Google Ads/AdWords).

---

## 1. Бизнес‑цели и KPI
- Привлечение органического трафика на контентные страницы по темам моды.
- Монетизация через рекламные сети (AdSense/Yandex Advertising Network) с целевыми метриками eCPM/RPM (значения задаются отдельно в админских KPI, без привязки ко времени).
- Core Web Vitals (field, P75): LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
- Высокая доля индексации материалов в Google/Yandex.

## 2. Целевая аудитория
 Целевая аудитория
Женщины и девушки, интересующиеся модой, трендами, стилем, шопинг‑гайдами, обзорами.

## 3. Информационная архитектура и страницы
### 3.1 Обязательные страницы
- Главная
- Список всех категорий
- Страница категории (список статей)
- Страница автора (фото, био, список статей)
- Страница материала (статья)
- О проекте
- Дисклеймер / Политика (включая Политику конфиденциальности и Cookie‑баннер)

### 3.2 Вторичные/системные
- Страница поиска
- 404, 500
- Sitemap XML (многофайловая при >50k URL)
- RSS/Atom/JSON Feed выдачи (опционально)

### 3.3 Навигация и хлебные крошки
- Топ‑меню: Главная, Категории, Авторы, О проекте.
- Breadcrumbs: Главная → Категория → Статья.

## 4. Функциональные требования
### 4.1 Пользовательские функции
- Поиск по сайту (полнотекстовый, с подсветкой совпадений).
- Шаринг в соцсети (Open Graph / Twitter Cards / Telegram, WhatsApp, VK, OK, Pinterest).
- «Лайк» статьи (анонимный + антиспам).
- Блок «Похожие материалы» (по категории/тегам + ML‑реком. опционально).
- Комментарии (опционально, по флагу; через внешние виджеты либо собственные, с премодерацией).

### 4.2 Админ‑панель
- Управление пользователями и ролями (Admin, Editor, Author, Viewer).
- Управление статьями (черновик → на модерации → опубликовано; отложенная публикация; правки и история версий).
- Управление категориями/тегами.
- Управление авторами (био, фото, ссылки на соцсети).
- Управление фидами: источники RSS/JSON, расписание, лог импорта, сопоставление полей, правила очистки, антидубли, маппинг категорий/тегов.
- Настройка рекламных блоков (позиции, частота, отключение per‑page).
- Настройки SEO (мета, robots, редиректы, каноникал, схематик‑разметка).

### 4.3 Интеграции
- Реклама: **адаптерная схема провайдеров** (выбирается в админке per‑локаль/страница/слот):
  - Yandex Advertising Network (partner.yandex.ru)
  - Google AdSense / Google Ad Manager
  - Прямые кампании (вставка кода/изображений, UTM‑метки)
  - Header Bidding (опционально: Prebid.js с таймаутом ≤ 800ms, server‑first)
- Веб‑аналитика: GA4, Яндекс.Метрика, Search Console, Yandex Webmaster.
- Антиспам / Bot‑защита (reCAPTCHA/SmartCaptcha по событиям: лайки/комментарии/формы).

### 4.4 Импорт контента из RSS/JSON Импорт контента из RSS/JSON
- Импорт по расписанию (CRON/worker): каждые 10–30 минут.
- Парсинг и нормализация: заголовок, лид, основной контент, медиа, атрибуты (см. §8).
- Антидубли: GUID, canonical URL, hash(content_norm).
- Очистка HTML: белый список тегов, удаление inline‑стилей, опасных атрибутов, UTM.
- Извлечение изображений, конвертация в WEBP/AVIF, генерация превью (размеры: 320, 640, 1024, 1600 ширина).
- Автоматический слаг, автор, дата публикации; fallback‑автор — «Редакция».
- Статус после импорта: «Черновик» или «Автопубликация» по правилам (напр., доверенные фиды).
- Транслитерация и нормализация категорий/тегов, маппинг к внутреннему справочнику.

## 5. Нефункциональные требования
- Производительность: SSR/SSG для статических страниц; CDN для медиа; HTTP/2+; кеширование на уровне CDN и приложения; ETags.
- Масштабируемость: горизонтальная для фронтенда, очередь для импорт‑воркеров.
- Безопасность: HTTPS, HSTS, защита от XSS/CSRF, ограничения размеров загрузок, заголовки безопасности (CSP, X‑Frame‑Options, X‑Content‑Type‑Options, Referrer‑Policy).
- Доступность: WCAG 2.1 AA (контраст, alt‑тексты, фокус‑индикаторы, клавиатурная навигация).
- Локализация: RU (в перспективе — multi‑lang, hreflang).

## 6. SEO‑требования
- URL‑структура:
  - Категория: `/category/<slug>/`
  - Статья: `/article/<yyyy>/<mm>/<slug>/`
  - Автор: `/author/<slug>/`
- Каноникал: на каждую страницу.
- Микроразметка Schema.org: `Article`, `BreadcrumbList`, `WebSite` (SearchAction), `Organization`.
- Заголовки H1–H3, мета‑теги, Open Graph / Twitter Cards.
- Sitemap.xml (раздельно для статей/авторов/категорий), robots.txt.
- Noindex для служебных страниц, пагинации при необходимости — rel=next/prev (или каноникал на первую).
- Пагинация категории: page size 20–30, статичная сортировка по дате.
- Лента: RSS/Atom/JSON Feed для внешних подписчиков (опционально).

## 7. Реклама и размещение (провайдер‑агностично)
**Цель:** единая кодовая база для RU (YAN) и EN (Google) без просадки Core Web Vitals.

### 7.1 Адаптеры провайдеров
- Единый компонент `AdSlot` (серверный), конфигурируемый через админку:
  - `provider`: `yan` | `adsense` | `gpt` | `direct` | `prebid` | `none`
  - `slotId`/`adUnitPath`/`blockId` (в зависимости от провайдера)
  - ограничения по частоте (frequency capping), видимость ≥ 1s
  - таргетинг: `lang`, `country`, `category`, `pageType`
- Провайдер выбирается по **правилу**: (локаль/домен/страна/тип страницы) → провайдер, с фоллбеком.

### 7.2 Схема конфигурации (пример)
```json
{
  "rules": [
    { "if": {"lang": "ru"}, "use": "yan" },
    { "if": {"lang": "en"}, "use": "adsense" }
  ],
  "slots": {
    "article_top": { "provider": "auto", "sizes": [[300,250],[336,280]], "sticky": false },
    "article_incontent": { "provider": "auto", "repeatEvery": 3 },
    "sidebar_sticky": { "provider": "auto", "sizes": [[300,600]], "sticky": true }
  }
}
```

### 7.3 Производительность и загрузка
- Плейсхолдеры фиксированной высоты рендерятся **на сервере** → нулевой CLS.
- Скрипты провайдера подключаются **лениво** (IntersectionObserver) и **после первого взаимодействия** либо при попадании слота в вьюпорт.
- Для Prebid.js — только при необходимости; таймаут аукциона ≤ 800ms, кэш/ключи на сервере, без тяжёлых адаптеров.

### 7.4 Политики и согласия
- CMP/согласие на cookies: режим по региону (EEA/UK → включаем), скрипты провайдеров уважают TCF v2.
- CSP‑записи: whitelist доменов провайдеров (YAN/Google/прямые), отчёты в Report‑URI.

### 7.5 Учёт и аналитика
- События: `ad_slot_viewable`, `ad_slot_click`, `ad_slot_filled` отправляются в GA4/Метрику.
- Тестирование конфигов: превью‑режим в админке, dry‑run загрузки без реальных запросов.

## 8. Модель данных (упрощённо) Модель данных (упрощённо)
- `users` (id, email, role, status)
- `authors` (id, slug, name, photo_url, bio, social_links)
- `categories` (id, slug, name, parent_id)
- `tags` (id, slug, name)
- `articles` (id, slug, title, excerpt, content_html, cover_media_id, author_id, published_at, status, canonical_url, reading_time)
- `article_category` (article_id, category_id)
- `article_tag` (article_id, tag_id)
- `media` (id, type, src, width, height, alt)
- `likes` (article_id, user_hash, created_at)
- `feeds` (id, name, type=RSS|JSON, url, trust_level, schedule, mapping_json, enabled)
- `feed_items` (id, feed_id, guid, source_url, hash_norm, raw_payload_json, imported_article_id, status, logs)
- `article_revisions` (id, article_id, editor_id, diff, created_at)

## 9. API (если headless)
- `GET /api/articles?filters&sort&page` — список
- `GET /api/articles/{slug}` — статья
- `GET /api/categories` — категории, дерево
- `GET /api/authors/{slug}` — автор
- `POST /api/articles/{id}/like` — лайк (rate‑limit + bot‑защита)
- `POST /api/feeds/import/{feed_id}` — ручной запуск импорта (admin)

## 10. Импортный формат фида
### 10.1 Рекомендуемый JSON Feed (унифицированный)
```json
{
  "version": "https://jsonfeed.org/version/1",
  "title": "Fashion Generator",
  "home_page_url": "https://example.com",
  "items": [
    {
      "id": "guid-or-hash",
      "url": "https://source.example.com/articles/123",
      "external_url": "https://source.example.com/articles/123",
      "title": "10 трендов сезона",
      "summary": "Короткий лид…",
      "content_html": "<p>Полный HTML…</p>",
      "image": "https://source.example.com/img/cover.jpg",
      "banner_image": "https://source.example.com/img/cover_large.jpg",
      "date_published": "2025-12-01T10:00:00Z",
      "date_modified": "2025-12-01T10:30:00Z",
      "authors": [{"name": "Ирина Стайл", "url": "https://source.example.com/authors/irina", "avatar": "https://.../irina.jpg"}],
      "tags": ["тренды", "зима"],
      "categories": ["Тренды"],
      "attachments": [{"url": "https://.../look1.jpg", "mime_type": "image/jpeg", "title": "look 1"}],
      "language": "ru",
      "canonical_url": "https://source.example.com/articles/123",
      "reading_time": 5,
      "sponsored": false
    }
  ]
}
```

### 10.2 Поддерживаемый RSS 2.0 (с расширениями)
- Базовые поля: `<item><guid>`, `<title>`, `<link>`, `<pubDate>`, `<description>`
- Расширения: `content:encoded`, `dc:creator`, `media:content`, `category`, `atom:link rel="self"`, `source`, `image`.

**Пример `<item>`:**
```xml
<item>
  <guid isPermaLink="false">guid-or-hash</guid>
  <title>10 трендов сезона</title>
  <link>https://source.example.com/articles/123</link>
  <pubDate>Mon, 01 Dec 2025 10:00:00 +0000</pubDate>
  <dc:creator>Ирина Стайл</dc:creator>
  <category>Тренды</category>
  <content:encoded><![CDATA[
    <p>Полный HTML…</p>
    <img src="https://.../cover.jpg" alt="Обложка" />
  ]]></content:encoded>
  <media:content url="https://.../cover.jpg" medium="image" />
</item>
```

### 10.3 Требования к фидам
- Уникальный `guid` на материал, стабильный во времени.
- Полный HTML в `content_html` или `content:encoded`.
- Отдельное поле для крупного изображения (cover) + вложения галереи.
- Автор(ы) с именем и, по возможности, ссылкой/аватаром.
- Категории/теги из ограниченного справочника (или маппинг в админке).
- Временные метки публикации/обновления в `UTC`.

## 11. Выбранная архитектура: **Astro (islands) + Payload CMS + PostgreSQL + Redis**
**Цель:** максимальные Core Web Vitals, полный контроль SEO, удобная админка, импорт из RSS/JSON, минимум JS на клиенте.

### 11.1 Компоненты и роли
- **Фронтенд:** Astro + Tailwind — SSG для всех публичных страниц; JS только на «островках» (Like, Share, SearchBox) с `client:idle|visible`.
- **CMS:** Payload CMS (Node) + PostgreSQL — админка, роли (Admin/Editor/Author/Viewer), ревизии, вебхуки публикации.
- **Очереди и импорт:** BullMQ + Redis — джобы импорта RSS/JSON, санитайз HTML, дедупликация (GUID/URL/hash_norm), обработка изображений (AVIF/WEBP, пресеты 320/640/1024/1600).
- **Поиск:** Typesense/Meilisearch — серверная выдача; страница `/search` рендерится на сервере.
- **Медиа:** S3‑совместимое хранилище (Cloudflare R2/Backblaze B2) + CDN.
- **Развёртывание:** Astro — Cloudflare Pages/Netlify; Payload+workers — VPS/Render/Fly.io; CDN для медиа. Вебхуки: публикация/обновление → пересборка нужных страниц (Astro ISR/partial rebuild, если используется).

### 11.2 CWV Guardrails (обязательные критерии)
**Target (P75):** LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
1) **JS‑диета:** ноль глобального SPA; островки ≤3 KB каждый; никаких тяжёлых SDK (соц‑виджеты — нативные share-ссылки).
2) **Изображения:** предзагрузка LCP‑картинки, `srcset/sizes`, AVIF/WEBP; фиксированные `width/height|aspect-ratio`.
3) **CSS:** критический CSS инлайн; Tailwind purge; без внешних CSS‑фреймворков.
4) **Шрифты:** системный стек или локально‑хостинговые (`font-display: swap|optional`), preload ≤2 начертаний.
5) **Реклама:** серверные контейнеры фикс. высоты; ленивое встраивание после первого взаимодействия, frequency capping; без layout shift.
6) **Аналитика:** GA4/Метрика — `defer`, загрузка после TTI; события — по возможности на сервере.
7) **Кэш/доставка:** страницы — SSG; CDN-кэш `s-maxage=31536000, stale-while-revalidate=60`; медиа через CDN.
8) **Мониторинг:** еженедельный отчёт CrUX/Field Data + Lighthouse CI; алерты при деградации.

### 11.3 Дизайн‑система (универсальная, оригинальная — friendly к вайбкодингу)
**Цель:** быстро кодить руками, но сохранить уникальный визуальный язык, без риска «шаблонности».

**Токены (JSON/Tailwind config):**
- Цвета: `--c-bg`, `--c-fg`, `--c-accent`, `--c-muted`, `--c-border`, `--c-success`, `--c-danger`.
- Типографика: масштаб 1.200 (Minor Third), `--font-sans` (system-ui), `--font-serif` (optional for headings).
- Радиусы: `--r-card: 14px`, `--r-button: 999px` (пилюля), `--r-image: 12px`.
- Тени: `--shadow-card: 0 4px 20px rgba(0,0,0,.06)`.
- Отступы: 8‑pt grid.

**Сетка и паттерны:**
- Контейнер: fluid mobile → 768px (tablet) → 1200px (desktop).
- Карточки статей: три варианта (A hero, B image‑left, C compact) с микс‑вставкой.
- Лэйаут статьи: узкая колонка 720px (desktop), адаптивная ширина на мобиле (инсет 16–20px), TOC по флагу, рекламные якоря предопределены.

**Компоненты (минимальный набор для SEO‑ленты):**
- Header/Nav (mobile-first: бургер/скрытое меню), Footer, Breadcrumbs.
- CardArticle (A/B/C), AuthorBadge, CategoryChip, Tag.
- ShareInline (ссылки), LikeButton (островок), Pagination (SSR), RelatedPosts.
- AdSlot (server), AnnouncementBar (optional).

**Темы (легкая оригинальность без тяжёлого дизайна):**
- Theme «Editorial Minimal»: серые тона, акцент‑линия под заголовками, чёрно‑белые превью с цветным hover.
- Theme «Soft Fashion»: светлый фон с легким теплом (`#fff8f5`), акцент‑розовый умеренный, закругления + мягкие тени.
Переключение тем — через CSS‑переменные; уникальность достигается комбинацией токенов, карточек и микро‑деталей (подчеркивание ссылок, формы кнопок, анимации на 120–160ms).

**Примечание про SEO и «дубликатность дизайна»:**
Поисковики не считают одинаковые шаблоны «дубликатом» — важен **контент**, внутренняя перелинковка, каноникал и микроразметка. Уникальный UI усиливает бренд и поведенческие сигналы, но за дубли наказывают за одно и то же содержимое/URL‑структуру, а не за схожие макеты.

### 11.3.1 Responsive & Mobile‑first (обязательно)
- **Главный трафик — мобайл**: дизайн и разработка ведутся в mobile‑first парадигме.
- **Брейкпоинты (минимум):**
  - `sm` 360–480 (мобайл),
  - `md` 768 (таблет),
  - `lg` 1024 (small desktop),
  - `xl` 1280+ (desktop wide).
- **Типографика:** базовый размер 16–18px на мобиле; line‑height 1.55–1.7; длина строки ~ 60–75 символов.
- **Тач‑цели:** минимум **48×48dp** (Google/Material), интервалы не менее 8dp.
- **Навигация:** sticky‑header с компактной высотой; доступ к поиску с первого экрана; бургер‑меню с крупными целями.
- **Изображения:** `sizes` под мобайл, приоритет LCP‑изображения, пресеты AVIF/WEBP; обязательный `aspect-ratio` для нулевого CLS.
- **Сетки списков:** 1‑колоночные на мобайле; 2–3 колонки начиная с `md`/`lg`.
- **Анимации:** ≤160ms, без тяжёлых переходов; отключаем параллаксы.
- **Проверка устройств:** iOS Safari (iPhone 12/SE), Android Chrome (Pixel 6/low‑end), iPadOS, desktop Chrome/Firefox/Safari.
- **Полевые метрики:** фокус на **Mobile** профиле в CrUX; Lighthouse — симуляция Moto G/Slow 4G.
 SEO‑требования (усиления для контент‑сайта)
- Schema.org: `Article`, `BreadcrumbList`, `Organization`, `WebSite/SearchAction`.
- Каноникал, даты `datePublished/dateModified`, автор с `sameAs`.
- Внутренняя перелинковка: RelatedPosts на основе категории/тегов.
- Чистая пагинация категорий (page size 30), каноникал на первую или rel=prev/next (по стратегии).

### 11.5 Импорт: маппинг под предоставленный RSS‑пример
**Пример XML (с неймспейсами `content:` и `custom:`) принят.** Реализуем следующий приоритет и соответствие полей:

**Извлечение полей:**
- `guid` → `feed_items.guid` (обязат.)
- `link` → `articles.canonical_url` (если есть)
- `title` → `articles.title`
- `custom:secondTitle` (если присутствует) → `articles.subtitle` (опциональное поле)
- `description` → `articles.excerpt` (очищенный до 300–400 символов)
- `content:encoded` **или** `custom:content` (приоритет: `content:encoded` → `custom:content`) → `articles.content_html`
- `author` → маппинг/создание `authors.name` (аватар/URL — если появятся в фиде, поддержим)
- Множественные `<category>` и `custom:category` (CSV) → нормализация → маппинг в внутренние `categories/tags`
- `pubDate` → `articles.published_at` (нормализация TZ, хранение в UTC)
- `language` на уровне канала → `articles.language` (если нет — `ru`)

**Антидубли:**
- Ключ: `guid` → если отсутствует, берём `link`; дополнительно считаем `hash_norm(content_html)`.

**Санитайз HTML:**
- Allowlist тегов: `p, h2–h4, strong, em, ul, ol, li, a[href], blockquote, img[src|alt|width|height], figure, figcaption, table, thead, tbody, tr, th, td`.
- Удаляем inline‑стили, скрипты, iframes (кроме разрешённых источников при необходимости), UTM‑параметры из ссылок.

**Изображения:**
- Извлекаем из HTML первый `<img>` как cover, скачиваем и конвертируем в AVIF/WEBP, сохраняем пресеты (320/640/1024/1600) с alt.

**Категории/теги:**
- `custom:category` разбираем как CSV, тримминг и нормализация регистра; сопоставляем со справочником, иначе — создаём тег.

**Логи и статус:**
- Логируем `feed_id`, `guid`, действия парсера, результат (draft/published), ошибки; статус публикации — по trust‑уровню фида.

**Псевдокод XPath/парсинг:**
- `//item/title/text()`
- `//item/custom:secondTitle/text()`
- `//item/description/text()`
- `//item/content:encoded/text()` или `//item/custom:content/text()`
- `//item/author/text()`
- `//item/category/text()` и `//item/custom:category/text()`
- `//item/guid/text()`; `//item/link/text()`
- `//item/pubDate/text()`

**Особенности:**
- Если есть и `content:encoded`, и `custom:content`, берём `content:encoded` как первичный.
- `lastBuildDate` канала — используем для диагностики, но не для дат статей.

---

## 12. Порядок реализации и вехи
1) **Дизайн‑система & токены** → выбор темы (Editorial Minimal или Soft Fashion), сборка UI‑кита.
2) **CMS (Payload)** → коллекции и роли, вебхуки публикации.
3) **Импортный воркер** → парсинг `content:`/`custom:`, дедуп, санитайз, медиа‑пайплайн, логи.
4) **Фронтенд (Astro)** → Главная, Категория, Статья, Автор, Поиск, 404, О проекте, Дисклеймер.
5) **Реклама** → серверные слоты, lazy‑insert, capping.
6) **SEO** → schema.org, sitemap/robots/rss, мета/OG/каноникал.
7) **CWV‑аудит** → Lighthouse/WebPageTest + полевые метрики.
8) **Запуск** → домен, SSL, CDN, подключение AdSense/YAN, индексация.
 Порядок реализации и вехи
1) **Дизайн‑система & токены** → подбор темы (Editorial Minimal или Soft Fashion), сборка UI‑кита (карточки A/B/C, шапка/подвал, типографика).
2) **CMS (Payload)** → коллекции (Articles, Authors, Categories, Tags, Feeds, Media), роли, вебхуки.
3) **Импортный воркер** → RSS/JSON, санитайз, дедуп, конвертация изображений, логи+алерты.
4) **Фронтенд (Astro)** → Главная, Категория, Статья, Автор, Поиск, 404, О проекте, Дисклеймер; SSR‑поиск.
5) **Реклама** → серверные слоты, lazy‑insert, capping, места на шаблонах.
6) **SEO** → разметка, sitemap/robots/rss, мета, OG/Twitter, каноникал.
7) **CWV‑аудит** → Lighthouse/WebPageTest + фиксы; настройка полевых метрик (CrUX/Метрика).
8) **Запуск** → домен, SSL, CDN, подключение AdSense/YAN, индексирование.

1) **Discovery & ТЗ (1–2 нед):** финализация требований, IA, схема URL, рекламные зоны.
2) **Дизайн (1–2 нед):** UI‑кит, макеты ключевых страниц (desktop/mobile).
3) **Разработка (3–6 нед):** фронтенд, бэкенд/админка, импорт, SEO, реклама.
4) **Тестирование (1–2 нед):** функционал, SEO, производительность, безопасность.
5) **Запуск:** домен, SSL, CDN, начальная индексация, подключение монетизации.
6) **Поддержка:** исправления, оптимизация RPM, контент‑план.

## 13. Критерии приёмки
- Пул из N импортированных статей отображается корректно на всех целевых устройствах.
- Валидация Schema.org (Rich Results Test) проходит без ошибок‑критиков.
- Core Web Vitals в пределах целей (P75 prod‑данные либо WebPageTest + Lighthouse ≥ 90).
- Реклама отображается согласно правилам: позиции, частота, viewability.
- Поиск отдаёт релевантные результаты ≤ 300ms p95.

## 14. Риски и меры
- Дубликаты/тонкий контент → антидубли + редакторский чек‑лист + расширение генератора.
- Политики рекламных сетей → соблюдение правил (нет запрещённых тем, кликбейта, навязчивых UX‑паттернов).
- Пиковые нагрузки → CDN + ISR/кеш; читатели из СНГ/Европы — гео‑CDN.

## 15. Бэклог (начальный, укрупнённо)
- IA/Схема URL, прототипы страниц.
- UI‑кит + макеты: Главная, Категория, Статья, Автор, Поиск, 404, О проекте, Дисклеймер.
- Импорт‑модуль: парсер RSS/JSON, маппинг, антидубли, конвертация изображений.
- Админка: CRUD авторов/категорий/тегов/статей/фидов, ревизии.
- SEO: разметка, sitemap, robots, каноникал, OpenGraph.
- Реклама: слот‑менеджер, конфиги, A/B частоты, lazy‑load.
- Поиск: индекс, API, UI.
- Лайки: API + UI + защита.
- Аналитика: GA4, Метрика, события (scroll, share, like, ad view).
- Доставка: Docker, CI/CD, CDN, логирование, алерты.

---

### Ответ на вопрос про фид: «нужно ли как-то расширить или унифицировать?»
Да. Рекомендуется **единый унифицированный формат** (JSON Feed или RSS 2.0 с расширениями) с обязательными полями: `guid`, `title`, `content_html`, `image/attachments`, `authors`, `categories/tags`, `date_published`, `canonical_url`. Для разных источников настраивается маппинг в админке. Это снизит ошибки на импорте и ускорит публикацию.

Опционально добавить поля: `reading_time`, `sponsored`/`brand_safety`, `language`, `canonical_url`, `source_name`.

---

### Примечание по терминологии
- Для размещения рекламы на сайте используется **Google AdSense** (историческое название AdSense). «Google AdWords/Ads» — это рекламодательская платформа, а не сеть для монетизации сайтов.

