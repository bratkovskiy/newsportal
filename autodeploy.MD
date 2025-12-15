# Auto deploy (Terraform + Ansible)

Этот репозиторий поддерживает полностью автоматическое развертывание проекта на VM в GCP.

Важно:
- `.env` НЕ хранится в git.
- Terraform создаёт/обновляет инфраструктуру.
- Ansible разворачивает приложение на VM через Docker Compose, выполняет миграции и настраивает nginx.


## 1) Полный деплой (Terraform + Ansible) — создание VM + развертывание

Этот режим:

- Создаёт/обновляет VM через Terraform
- Сразу же запускает Ansible и разворачивает приложение на этой VM

### 1.1 Подготовьте tfvars для сайта

Вариант A (самый простой): используйте уже существующий файл:

- `infra/terraform/gcp/terraform.tfvars`

Тогда переменную `TFVARS` можно НЕ указывать вообще.

Примечание: путь в `TFVARS=...` можно указывать относительно корня репозитория.

Вариант B (разные настройки на разные сайты): создайте отдельный файл tfvars (он игнорируется git), например:

- `infra/terraform/gcp/envs/site1.tfvars`

Пример:

```hcl
project_id = "quiet-vertex-477109-t8"
region     = "europe-west3"
zone       = "europe-west3-c"

credentials_file = "quiet-vertex-477109-t8-bcfa905814f7.json"

name          = "newsportal-site1-vm"
machine_type  = "e2-medium"
disk_gb       = 30
image         = "ubuntu-os-cloud/ubuntu-2204-lts"

ssh_user             = "deploy"
ssh_public_key       = "ssh-ed25519 AAAA... ilia@pc"
ssh_private_key_path = "/home/ilia/.ssh/id_ed25519"

ssh_source_ranges = ["0.0.0.0/0"]
```

### 1.2 Подготовьте `.env`

Храните `.env` локально, например:

- `./.env`
- или `~/.config/newsportal/prod.env`

### 1.3 (Опционально) подготовьте seed базы (seed.sql)

Если у вас есть локальная база в Docker Compose этого репозитория, дамп можно сделать так:

```bash
docker compose exec -T postgres pg_dump -U payload --no-owner --no-privileges -d payload > seed.sql
```

Дамп используется только при первом деплое на полностью пустую БД (на новой VM / новом volume).

### 1.4 Запуск полного деплоя

Из корня репозитория:

Базовый сайт `default` (как вы делали `MODE=deploy`, но теперь с Terraform):

```bash
SITE=default \
TFVARS=infra/terraform/gcp/terraform.tfvars \
ENV_FILE=./.env \
GIT_KEY=~/.config/newsportal/github_deploy_key \
./deploy.sh
```

```bash
SITE=site1 \
TFVARS=infra/terraform/gcp/terraform.tfvars \
ENV_FILE=./.env \
GIT_KEY=~/.config/newsportal/github_deploy_key \
./deploy.sh
```

С сидом БД:

Базовый сайт `default` + сид БД:

```bash
SITE=default \
TFVARS=infra/terraform/gcp/terraform.tfvars \
ENV_FILE=./.env \
GIT_KEY=~/.config/newsportal/github_deploy_key \
DB_SEED_FILE=./seed.sql \
./deploy.sh
```

```bash
SITE=site1 \
TFVARS=infra/terraform/gcp/terraform.tfvars \
ENV_FILE=./.env \
GIT_KEY=~/.config/newsportal/github_deploy_key \
DB_SEED_FILE=./seed.sql \
./deploy.sh
```

После первого запуска IP будет сохранён в:

- `.deploy/site1/vm_ip`

Важно: папку `.deploy/<SITE>` руками создавать НЕ нужно — `deploy.sh` создаёт её автоматически.

### 1.5 Проверка

- `http://<IP>/` — сайт (web)
- `http://<IP>/admin/` — админка (cms)

### 1.6 Как гарантированно получить новую VM (для «первого деплоя»)

Если нужно проверить сид на чистой машине, проще всего использовать новый `SITE` (новый terraform workspace):

```bash
SITE=seedtest1 \
TFVARS=infra/terraform/gcp/terraform.tfvars \
ENV_FILE=./.env \
GIT_KEY=~/.config/newsportal/github_deploy_key \
DB_SEED_FILE=./seed.sql \
./deploy.sh
```

---

## 2) Деплой без Terraform (только Ansible) — обновление существующей VM

Этот режим:

- НЕ трогает Terraform
- Берёт IP из кэша `.deploy/<SITE>/vm_ip`
- Запускает только Ansible (обновление кода/контейнеров/миграций)

### 2.1 Если VM уже создана — убедитесь, что есть кэш IP

Файл:

- `.deploy/default/vm_ip`

Содержимое (пример):

```
34.159.128.84
```

### 2.2 Запуск деплоя без Terraform

```bash
SITE=default \
MODE=deploy \
ENV_FILE=./.env \
GIT_KEY=~/.config/newsportal/github_deploy_key \
./deploy.sh
```

С сидом БД (СРАБОТАЕТ ТОЛЬКО если удалённая БД полностью пустая):

```bash
SITE=default \
MODE=deploy \
ENV_FILE=./.env \
GIT_KEY=~/.config/newsportal/github_deploy_key \
DB_SEED_FILE=./seed.sql \
./deploy.sh
```

---

## GitHub deploy key (обязательно для приватного репозитория)

Репозиторий приватный, поэтому серверу нужен SSH-ключ, чтобы делать `git clone/pull` **без логина и пароля**.

### Где лежат файлы

Рекомендуемая папка на вашей локальной машине:

- `~/.config/newsportal/github_deploy_key` — приватный ключ (секрет). Никому не отправлять.
- `~/.config/newsportal/github_deploy_key.pub` — публичный ключ. Его нужно добавить в GitHub.

### Зачем это нужно

- Ansible копирует приватный ключ на VM в `/home/deploy/.ssh/github_deploy_key` (права `0600`).
- Потом `git` на VM использует этот ключ для доступа к `git@github.com:...`.

### Как сгенерировать

```bash
mkdir -p ~/.config/newsportal
ssh-keygen -t ed25519 -f ~/.config/newsportal/github_deploy_key -N ""
```

### Как добавить в GitHub

В GitHub открой:

- Repo → `Settings` → `Deploy keys` → `Add deploy key`

И вставь содержимое `~/.config/newsportal/github_deploy_key.pub`.

Примечание: `Allow write access` обычно не нужен (достаточно read-only).

---


## 3) Что делает Ansible

Ansible выполняет:

1. Установка пакетов (git/curl/ca-certificates)
2. Установка Docker Engine + Docker Compose plugin
3. Клонирование репозитория в `/opt/newsportal`
4. Копирование `.env` на сервер: `/opt/newsportal/.env` (права `0600`)
5. `docker compose up -d --build`
6. Миграции: `docker compose run --rm cms npm run migrate`
7. nginx reverse proxy:
   - `/` -> `http://127.0.0.1:4321`
   - `/admin/` -> `http://127.0.0.1:3000/admin/`

---

## 4) Переменные окружения для `deploy.sh`

- `ENV_FILE` (обязательно) — путь к локальному `.env`.
- `GIT_KEY` (обязательно для приватного репозитория) — путь к приватному SSH deploy key для GitHub.
- `DB_SEED_FILE` (опционально) — путь к локальному `seed.sql` дампу Postgres.
- `SITE` — имя сайта (по умолчанию `default`). Используется для terraform workspace и кэша `.deploy/<SITE>/...`
- `TFVARS` — путь к tfvars (нужно для `MODE=provision`).
- `MODE` — `provision` (terraform+ansible) или `deploy` (только ansible, IP берётся из `.deploy/<SITE>/vm_ip`).
- `SSH_USER` / `SSH_KEY_PATH` — можно задать явно, если вы делаете `MODE=deploy` без tfvars.

---

## 5) Примечания по безопасности

- `.env` не хранится в git.
- сервис-аккаунт ключ `*.json` должен быть вне git (он игнорируется).
- `terraform.tfstate` не хранится в git (игнорируется).
