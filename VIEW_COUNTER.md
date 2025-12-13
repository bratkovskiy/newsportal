# Счетчики просмотров статей

## Описание

Реализована система подсчета просмотров для каждой статьи. Счетчик автоматически увеличивается при каждом просмотре страницы статьи. При удалении статьи счетчик автоматически удаляется вместе с ней.

## Архитектура

### Backend (CMS)

#### 1. База данных
- **Колонка:** `view_count` (integer, NOT NULL, DEFAULT 0)
- **Индекс:** `articles_view_count_idx` для быстрого сортирования по популярности
- **Миграция:** `2025-12-10-03-add-article-view-count.ts`

#### 2. Payload CMS
- **Поле:** `viewCount` в коллекции `Articles`
  - Тип: `number`
  - Значение по умолчанию: `0`
  - Только для чтения в админке
  - Отображается в сайдбаре карточки статьи

#### 3. API Endpoint
**URL:** `POST /api/articles/:id/increment-view`

**Функционал:**
- Атомарный инкремент счетчика через SQL (`view_count = view_count + 1`)
- Проверка существования статьи
- Возврат обновленного значения счетчика

**Пример запроса:**
```bash
curl -X POST http://localhost:3000/api/articles/725/increment-view
```

**Пример ответа:**
```json
{
  "success": true,
  "viewCount": 42
}
```

**Коды ответа:**
- `200` - успешно
- `400` - не указан ID статьи
- `404` - статья не найдена
- `500` - ошибка сервера

### Frontend (Web)

#### Автоматический подсчет
На каждой странице статьи (`/article/[...slug].astro`) выполняется JavaScript:
```javascript
fetch(cmsUrl + '/api/articles/' + articleId + '/increment-view', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
```

**Особенности:**
- Вызов происходит при загрузке страницы
- Асинхронный (не блокирует отображение страницы)
- Ошибки логируются в консоль, но не мешают работе
- Работает с SSR

## Удаление статей

При удалении статьи через админку Payload CMS:
1. Статья удаляется из таблицы `articles`
2. Счетчик `view_count` автоматически удаляется вместе со строкой (каскадное удаление)
3. Никаких дополнительных действий не требуется

## Использование

### Просмотр в админке
1. Откройте статью в CMS админке: `http://localhost:3000/admin/collections/articles/{id}`
2. В правом сайдбаре отображается поле **"Просмотры"**
3. Значение обновляется при каждом просмотре статьи на фронтенде

### Получение статистики через API
```javascript
// Получить статью с счетчиком
const response = await fetch('http://localhost:3000/api/articles/725?depth=0');
const article = await response.json();
console.log('Просмотры:', article.viewCount);
```

### Сортировка по популярности
```javascript
// Получить самые популярные статьи
const response = await fetch('http://localhost:3000/api/articles?sort=-viewCount&limit=10');
const data = await response.json();
const popularArticles = data.docs;
```

## Технические детали

### Атомарность
Используется SQL с атомарным инкрементом:
```sql
UPDATE articles SET view_count = view_count + 1 WHERE id = ?
```

Это гарантирует корректную работу при одновременных запросах.

### Производительность
- Индекс `articles_view_count_idx` обеспечивает быструю сортировку
- SQL-инкремент выполняется за одну операцию
- Нет race conditions при параллельных просмотрах

### Безопасность
- API endpoint не требует авторизации (публичный)
- Доступен только метод POST
- Проверяется существование статьи
- SQL injection защищен через параметризованные запросы (drizzle-orm)

## Расширение функционала

### Добавление просмотров на других страницах
Если нужно считать просмотры не только на странице статьи, добавьте аналогичный скрипт:

```html
<script>
  fetch('http://localhost:3000/api/articles/' + articleId + '/increment-view', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
</script>
```

### Защита от накрутки
Для защиты от накрутки можно добавить:
1. Rate limiting (ограничение по IP)
2. Cookie для предотвращения повторных подсчетов за сессию
3. Google Analytics для более точной статистики

Пример с cookie (добавить в скрипт):
```javascript
const viewedKey = 'viewed_' + articleId;
if (!sessionStorage.getItem(viewedKey)) {
  fetch(...);
  sessionStorage.setItem(viewedKey, 'true');
}
```

## Troubleshooting

### Счетчик не увеличивается
1. Проверьте консоль браузера на ошибки
2. Убедитесь, что CMS доступен: `curl http://localhost:3000/api/articles/725`
3. Проверьте логи CMS: `docker logs news_project-cms-1 | grep "increment-view"`

### Счетчик обнулился
1. Проверьте, не была ли запущена миграция `down`
2. Проверьте значение в БД: `SELECT id, view_count FROM articles WHERE id = 725;`

### Ошибка 404 при вызове API
- Убедитесь, что применена миграция: `docker exec news_project-cms-1 npm run payload migrate`
- Проверьте, что статья с указанным ID существует

## Миграция

### Применить миграцию
```bash
docker exec news_project-cms-1 npm run payload migrate
```

### Откатить миграцию
```bash
docker exec news_project-cms-1 npm run payload migrate:down
```

Это удалит колонку `view_count` и индекс из базы данных.
