# Настройка хранилища медиафайлов

## Проблема

При перезапуске Docker контейнера CMS все загруженные медиафайлы удаляются, потому что они хранятся внутри контейнера.

## Решение

В `docker-compose.yml` добавлен Docker volume `cms_media`, который сохраняет медиафайлы между перезапусками.

```yaml
cms:
  volumes:
    - cms_media:/app/src/media
```

## Первоначальная настройка

### 1. Убедитесь, что volume создан

```bash
docker volume ls | grep cms_media
```

Если volume не создан:

```bash
docker compose up -d cms
```

### 2. Добавьте файл-заглушку (placeholder)

Файл `placeholder-1.jpg` должен быть в volume для работы заглушек изображений.

**Вариант А: Автоматически через API (рекомендуется)**

Загрузите placeholder через админку CMS:
1. Откройте http://localhost:3000/admin
2. Перейдите в раздел **Media**
3. Нажмите **Create New**
4. Загрузите файл `placeholder-1.jpg` из корня проекта
5. Укажите Alt: "Изображение недоступно"
6. Сохраните

**Вариант Б: Через Docker копирование**

```bash
# Скопировать файл в volume
docker cp placeholder-1.jpg news_project-cms-1:/app/src/media/placeholder-1.jpg

# Добавить запись в базу данных (через скрипт)
docker exec news_project-cms-1 npm run seed:placeholder
```

**Вариант В: Запустить seed скрипт (если установлен tsx)**

```bash
cd apps/cms
npm install
npm run seed:placeholder
```

## Проверка

1. **Проверить, что файл есть в volume:**

```bash
docker exec news_project-cms-1 ls -la /app/src/media/
```

2. **Проверить, что файл доступен через API:**

```bash
curl -I http://localhost:3000/api/media/file/placeholder-1.jpg
```

Должен вернуть `200 OK`.

3. **Проверить в админке:**

Откройте http://localhost:3000/admin/collections/media - должен быть файл `placeholder-1.jpg`.

## Бэкап медиафайлов

### Создать бэкап

```bash
# Сохранить все медиафайлы в архив
docker run --rm -v news_project_cms_media:/data -v $(pwd):/backup alpine tar czf /backup/cms-media-backup.tar.gz -C /data .
```

### Восстановить из бэкапа

```bash
# Восстановить медиафайлы из архива
docker run --rm -v news_project_cms_media:/data -v $(pwd):/backup alpine tar xzf /backup/cms-media-backup.tar.gz -C /data
```

## Очистка volume (если нужно начать заново)

⚠️ **ВНИМАНИЕ:** Это удалит все медиафайлы!

```bash
# Остановить CMS
docker compose down cms

# Удалить volume
docker volume rm news_project_cms_media

# Запустить заново
docker compose up -d cms

# Загрузить placeholder снова
docker cp placeholder-1.jpg news_project-cms-1:/app/src/media/placeholder-1.jpg
```

## Миграция существующих медиафайлов

Если у вас уже были загружены медиафайлы до добавления volume:

1. **Экспортировать из старого контейнера:**

```bash
# Создать временный контейнер со старым образом
docker run --name cms-temp -d <old-image-id>

# Скопировать файлы
docker cp cms-temp:/app/src/media ./media-backup/

# Удалить временный контейнер
docker rm -f cms-temp
```

2. **Импортировать в новый volume:**

```bash
# Скопировать все файлы в новый контейнер
docker cp ./media-backup/. news_project-cms-1:/app/src/media/
```

3. **Проверить, что все файлы на месте:**

```bash
docker exec news_project-cms-1 ls -la /app/src/media/
```

## Автоматизация при деплое

Добавьте в CI/CD pipeline или в скрипт деплоя:

```bash
# После запуска контейнеров
docker compose up -d

# Дождаться готовности CMS
sleep 10

# Проверить наличие placeholder
if ! docker exec news_project-cms-1 ls /app/src/media/placeholder-1.jpg > /dev/null 2>&1; then
  echo "Copying placeholder..."
  docker cp placeholder-1.jpg news_project-cms-1:/app/src/media/placeholder-1.jpg
fi
```

## Troubleshooting

### Медиафайлы не отображаются после перезапуска

1. Проверьте, что volume подключен:
```bash
docker inspect news_project-cms-1 | grep -A 10 Mounts
```

2. Проверьте содержимое volume:
```bash
docker exec news_project-cms-1 ls -la /app/src/media/
```

3. Перезапустите CMS:
```bash
docker compose restart cms
```

### Файл есть в volume, но не отображается в админке

Возможно, запись отсутствует в базе данных. Загрузите файл заново через админку или запустите seed скрипт.

### Volume занимает много места

Проверьте размер:
```bash
docker system df -v | grep cms_media
```

Очистите неиспользуемые файлы через админку CMS.
