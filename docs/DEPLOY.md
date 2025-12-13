# Развёртывание проекта Fashion News (Docker)

Этот файл описывает, как развернуть проект на новом сервере так, чтобы **CMS, база и сайт** сразу заработали.

## 1. Предварительные требования

- Операционная система: Linux (Ubuntu 22.04/24.04 или аналогичная)
- Установлены:
  - Docker
  - Docker Compose V2

Установка на Ubuntu:

```bash
sudo apt update
sudo apt install docker.io docker-compose-v2 -y

# (опционально) запуск Docker без sudo
sudo usermod -aG docker $USER
# затем перелогиниться или перезагрузить систему
```

Проверка:

```bash
docker --version
docker compose version
```

---

## 2. Копирование проекта на сервер

Предположим, на локальной машине проект в `~/news_project`.

### Вариант через архив

```bash
# Локально
cd ~
tar czf news_project.tar.gz news_project/
scp news_project.tar.gz user@server:/home/user/

# На сервере
ssh user@server
cd ~
tar xzf news_project.tar.gz
cd news_project
```

В итоге проект на сервере должен лежать по пути, например:

```bash
/home/user/news_project
```

---

## 3. Файл окружения `.env`

В корне проекта (`news_project/.env`) должен быть файл с переменными окружения, примерно такого вида:

```env
SITE=http://localhost:4321

# Payload CMS
DATABASE_URI=postgres://payload:password@postgres:5432/payload
PAYLOAD_SECRET=your-secret-key-here-make-it-long
PAYLOAD_DB_PUSH=true

# Revalidation secret (должен совпадать с CMS)
REVALIDATION_SECRET='another-strong-secret-for-revalidation'

# Typesense configuration
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=xyz

# AdSense Client ID
ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX

CMS_URL=http://localhost:3000
```

На боевом сервере можно изменить значения (домены, секреты и т.п.), но **ключи** должны остаться такими же.

---

## 4. Первый запуск контейнеров

Из папки проекта на сервере:

```bash
cd ~/news_project

# Первый запуск и сборка всех сервисов
docker compose up -d --build
```

Проверить статус контейнеров:

```bash
docker compose ps
```

Ожидаемые сервисы:

- postgres
- redis
- cms
- web
- jobs

---

## 5. Применение миграций Payload CMS

Чтобы создать все таблицы в Postgres (включая `users`), нужно прогнать миграции внутри контейнера `cms`:

```bash
cd ~/news_project

docker compose exec cms npx payload migrate --config src/payload.config.ts
```

Если миграций нет или они уже применены, команда выведет `No migrations to run`.

После успешной миграции можно перезапустить CMS (опционально, но удобно):

```bash
docker compose restart cms
```

---

## 6. Проверка работы сервисов

После запуска и миграций проверяем в браузере (или через `curl`):

### CMS (админка)

Адрес:

```text
http://<IP-сервера>:3000/admin
```

Здесь будет админка Payload CMS. Если таблицы созданы корректно, страница откроется без `Application error`.

### Сайт (фронтенд)

Адрес:

```text
http://<IP-сервера>:4321/
```

Также можно проверить другие страницы, например:

```text
http://<IP-сервера>:about
```

Если что-то выглядит странно, полезно посмотреть логи контейнеров:

```bash
cd ~/news_project

docker compose logs cms --tail=80
docker compose logs web --tail=80
```

---

## 7. Краткий чек-лист

На новом сервере нужно сделать:

1. **Установить Docker и Docker Compose V2**.
2. **Скопировать проект** в `/home/<user>/news_project` и убедиться, что рядом лежит `.env`.
3. В папке `news_project` выполнить:
   ```bash
   docker compose up -d --build
   ```
4. После первого запуска выполнить миграции CMS:
   ```bash
   docker compose exec cms npx payload migrate --config src/payload.config.ts
   ```
5. (Опционально) Перезапустить CMS:
   ```bash
   docker compose restart cms
   ```
6. Открыть в браузере:
   - `http://<IP-сервера>:3000/admin` — админка CMS
   - `http://<IP-сервера>:4321/` — фронтовый сайт

При обновлении проекта (новый код/миграции) достаточно:

```bash
cd ~/news_project
git pull        # если проект в git

# пересобрать и запустить
docker compose up -d --build

# прогнать новые миграции, если есть
docker compose exec cms npx payload migrate --config src/payload.config.ts
```
# Импортнуть руками

```bash
cd /home/ilia/news_project/apps/jobs

JOBS_API_KEY=k7Nw2KJ9xP4QnA1zR8vT0uHf3LqS5mYcD6bJrX2pF9gW8tE0sV7hM4kC1nU3 \
CMS_URL=http://localhost:3000 \
npm run import:feeds

----
Прогнать миграцию и пересобрать CMS

cd /home/ilia/news_project

docker compose up -d --build cms
docker compose exec cms npx payload migrate --config src/payload.config.ts

Пересобрать фронт (из‑за изменений в BaseLayout.astro):

cd /home/ilia/news_project
docker compose up -d --build web

docker compose up -d --build jobs