Проект: Контентный сайт о моде (RU/EN), mobile-first, приоритет Core Web Vitals.
Стек: Astro (islands, SSG) + Tailwind; Payload CMS (Node) + PostgreSQL; Redis + BullMQ для фоновых воркеров импорта; Typesense/Meilisearch для серверного поиска; S3-совместимое хранилище (R2/B2); адаптеры рекламных провайдеров (YAN/AdSense/Direct/Prebid) без привязки к одному провайдеру.

Ключевые нефункциональные требования (полевые метрики, P75):
- LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1
- Рекламные плейсхолдеры рендерятся на сервере с фиксированной высотой; ленивое подключение скриптов; frequency capping
- Строгая очистка HTML импортируемого контента; конвертация изображений в AVIF/WEBP; везде задано aspect-ratio
- SEO: schema.org Article/Breadcrumb/WebSite, canonical, чистые URL, sitemaps
