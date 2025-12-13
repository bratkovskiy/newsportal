-- Очистка старых SEO-значений для применения новых шаблонов
-- После выполнения этого скрипта будут применяться динамические SEO-шаблоны

-- Очистка SEO-полей для категорий
UPDATE categories
SET meta_title = NULL, meta_description = NULL
WHERE meta_title LIKE '% - LADY.NEWS' 
   OR meta_description LIKE 'Все материалы из категории %';

-- Очистка SEO-полей для тегов  
UPDATE tags
SET meta_title = NULL, meta_description = NULL
WHERE meta_title LIKE '% - LADY.NEWS'
   OR meta_description LIKE 'Все материалы по тегу %';

-- Проверка результатов
SELECT 'Categories with custom SEO' as info, COUNT(*) as count 
FROM categories 
WHERE meta_title IS NOT NULL OR meta_description IS NOT NULL;

SELECT 'Tags with custom SEO' as info, COUNT(*) as count 
FROM tags 
WHERE meta_title IS NOT NULL OR meta_description IS NOT NULL;
