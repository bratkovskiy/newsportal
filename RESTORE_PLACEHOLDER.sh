#!/bin/bash

# Скрипт для быстрого восстановления placeholder изображения

echo "🔍 Проверка наличия placeholder в volume..."

if docker exec news_project-cms-1 ls /app/src/media/placeholder-1.jpg > /dev/null 2>&1; then
    echo "✓ Файл placeholder-1.jpg уже существует в volume"
else
    echo "⚠ Файл placeholder-1.jpg не найден, копирую..."
    
    if [ -f "placeholder-1.jpg" ]; then
        docker cp placeholder-1.jpg news_project-cms-1:/app/src/media/placeholder-1.jpg
        echo "✓ Файл placeholder-1.jpg скопирован в volume"
    else
        echo "✗ Файл placeholder-1.jpg не найден в текущей директории"
        echo "  Пожалуйста, убедитесь, что файл существует в корне проекта"
        exit 1
    fi
fi

echo ""
echo "📋 Содержимое media директории:"
docker exec news_project-cms-1 ls -lh /app/src/media/

echo ""
echo "✓ Готово! Теперь загрузите placeholder через админку CMS:"
echo "  1. Откройте http://localhost:3000/admin"
echo "  2. Перейдите в Media → Create New"
echo "  3. Загрузите placeholder-1.jpg из корня проекта"
echo "  4. Alt: 'Изображение недоступно'"
