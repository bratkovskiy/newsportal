# Auto deploy (Terraform + Ansible)

Этот репозиторий поддерживает полностью автоматическое развертывание проекта на VM в GCP.

Важно:
- `.env` НЕ хранится в git.
- Terraform создаёт/обновляет инфраструктуру.
- Ansible разворачивает приложение на VM через Docker Compose, выполняет миграции и настраивает nginx.

---

## 1) Быстрый старт (один сайт, уже есть VM)

Если VM уже создана и у вас есть её IP (например `34.159.128.84`), можно сделать деплой **без Terraform**.

### 1.1 Подготовьте `.env`

Файл `.env` может лежать локально в корне репозитория (он игнорируется `.gitignore`).

### 1.2 Запишите IP в кэш

Создайте файл:

- `.deploy/default/vm_ip`

Содержимое:

```
34.159.128.84
```

### 1.3 Запустите деплой

Из корня репозитория:

```bash
SITE=default \
MODE=deploy \
ENV_FILE=./.env \
GIT_KEY=~/.config/newsportal/github_deploy_key \
./deploy.sh
```

### 1.4 Проверка

- `http://<IP>/` — сайт (web)
- `http://<IP>/admin/` — админка (cms)

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

## 2) Полный цикл (создать VM + развернуть проект)

### 2.1 Подготовьте tfvars для сайта

Создайте файл (он игнорируется git):

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

### 2.2 Подготовьте `.env`

Храните `.env` локально, например в корне репо (`./.env`) или в `~/.config/...`.

### 2.3 Запуск

```bash
SITE=site1 \
TFVARS=infra/terraform/gcp/envs/site1.tfvars \
ENV_FILE=./.env \
GIT_KEY=~/.config/newsportal/github_deploy_key \
./deploy.sh
```

После первого запуска IP будет сохранён в:

- `.deploy/site1/vm_ip`

---

## 3) Обновление кода (быстрый деплой без Terraform)

Если вы запушили изменения в GitHub и хотите обновить сайт на существующей VM:

```bash
SITE=site1 \
MODE=deploy \
ENV_FILE=./.env \
GIT_KEY=~/.config/newsportal/github_deploy_key \
./deploy.sh
```

---

## 4) Что делает Ansible

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

## 5) Переменные окружения для `deploy.sh`

- `ENV_FILE` (обязательно) — путь к локальному `.env`.
- `GIT_KEY` (обязательно для приватного репозитория) — путь к приватному SSH deploy key для GitHub.
- `SITE` — имя сайта (по умолчанию `default`). Используется для terraform workspace и кэша `.deploy/<SITE>/...`
- `TFVARS` — путь к tfvars (нужно для `MODE=provision`).
- `MODE` — `provision` (terraform+ansible) или `deploy` (только ansible, IP берётся из `.deploy/<SITE>/vm_ip`).
- `SSH_USER` / `SSH_KEY_PATH` — можно задать явно, если вы делаете `MODE=deploy` без tfvars.

---

## 6) Примечания по безопасности

- `.env` не хранится в git.
- сервис-аккаунт ключ `*.json` должен быть вне git (он игнорируется).
- `terraform.tfstate` не хранится в git (игнорируется).
