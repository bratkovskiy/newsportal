# Развёртывание проекта Fashion News

Документ описывает два сценария:

1. **Продакшн-деплой** через Terraform + Ansible + Vault (основной процесс).
2. **Локальный/legacy** запуск через Docker Compose (оставлен для совместимости).

## TL;DR (продакшн)

1. Подготовьте `.env.local`, `terraform.tfvars` и секреты в Vault.
2. Скопируйте `infra/scripts/deploy-local.sh.example` → `deploy-local.sh`, сделайте исполняемым.
3. Выполните `./infra/scripts/deploy-local.sh` — скрипт создаст ВМ в GCP и прогонит Ansible.
4. Для повторного деплоя без Terraform смените `infra/ansible/inventory/prod.ini` и выполните `ansible-playbook site.yml`.

Ниже описаны подробности по каждому шагу.

---

## 1. Архитектура и структура репозитория

Основные пути:

```
infra/
├── terraform/
│   ├── gcp/                  # main.tf, variables.tf, outputs.tf
│   └── terraform.tfvars      # значения переменных (локальный файл)
├── ansible/
│   ├── ansible.cfg
│   ├── inventory/prod.ini    # динамически перезаписывается
│   ├── group_vars/all.yml    # общие переменные ролей
│   ├── roles/                # common, postgres, nodejs, nginx, webapp_*
│   └── site.yml              # главный плейбук
└── scripts/
    └── deploy-local.sh       # автоматизация Terraform + Ansible
```

Компоненты:

- **Terraform (GCP)** — создаёт Ubuntu 22.04 VM, настраивает сеть и SSH.
- **Ansible** — ставит системные пакеты, Node.js, PostgreSQL, клонирует репозиторий, подтягивает секреты из Vault, собирает Astro/Payload, разворачивает systemd/Nginx.
- **Vault** — хранит два файла окружения (`web_env`, `cms_env`) для фронта и CMS.
- **Nginx + systemd** — проксирование портов (Nginx → Astro 4000 → Payload 3000).

---

## 2. Что должно быть установлено локально

| Инструмент | Зачем нужен | Проверка |
|------------|-------------|----------|
| Terraform ≥ 1.5 | создание ВМ | `terraform version` |
| Ansible ≥ 2.15   | конфигурация сервера | `ansible --version` |
| Vault CLI        | запись/чтение секретов | `vault version` |
| gcloud CLI (по желанию) | валидация GCP проекта | `gcloud auth list` |
| SSH + агент      | проброс ключей для git clone | `ssh -T git@github.com` |

---

## 3. Переменные и секреты

### 3.1 `.env.local` (не коммитим)

Файл лежит в корне репозитория и подхватывается `deploy-local.sh`. Минимум:

```env
ANSIBLE_SSH_KEY=/home/ilia/.ssh/id_ed25519
VAULT_ADDR=https://vault.example.com:8200
VAULT_TOKEN=<vault-token>
VAULT_SKIP_VERIFY=true
GOOGLE_APPLICATION_CREDENTIALS=/home/ilia/infra/keys/gcp.json
```

> `ANSIBLE_SSH_KEY` нужен, чтобы скрипт прописал корректный путь в `inventory/prod.ini`.

### 3.2 `terraform.tfvars`

Файл `infra/terraform/terraform.tfvars` (или `infra/terraform/gcp/terraform.tfvars`). Пример:

```hcl
project        = "gcp-project-id"
region         = "europe-west1"
zone           = "europe-west1-b"
instance_name  = "fashion-news-prod"
machine_type   = "e2-standard-2"
boot_disk_size = 50
ssh_user       = "deploy"
ssh_public_key = "ssh-ed25519 AAAA... deploy@laptop"
labels = {
  env = "prod"
}
```

> Публичный ключ должен совпадать с ключом, который будет использовать Ansible/SSH.

### 3.3 Vault: `webapp/env`

Роль `webapp_secrets` забирает два поля:

- `web_env` → файл `/etc/webapp/web.env` (Astro).
- `cms_env` → файл `/etc/webapp/cms.env` (Payload).

Пример содержимого:

```bash
cat >/tmp/web.env <<'EOF'
SITE=https://fashion.example
PUBLIC_SITE_URL=https://fashion.example
CMS_URL=http://127.0.0.1:3000
PUBLIC_CMS_URL=https://cms.fashion.example
PUBLIC_PLACEHOLDER_URL=https://fashion.example/placeholder.jpg
REVALIDATION_SECRET=change-me
EOF

cat >/tmp/cms.env <<'EOF'
DATABASE_URI=postgres://payload:password@localhost:5432/payload
PAYLOAD_SECRET=very-long-secret
PAYLOAD_DB_PUSH=true
REDIS_URL=redis://localhost:6379
JOBS_API_KEY=change-me
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=change-me
EOF

vault kv put webapp/env web_env=@/tmp/web.env cms_env=@/tmp/cms.env
```

### 3.4 Ansible inventory (только если бежим без Terraform)

`infra/ansible/inventory/prod.ini`:

```ini
[web]
webapp ansible_host=34.40.120.4 ansible_user=deploy ansible_ssh_private_key_file=/home/ilia/.ssh/id_ed25519
```

Скрипт перезаписывает файл автоматически. При ручном запуске Ansible обновляйте его сами.

---

## 4. Полный цикл: Terraform → Ansible

1. Скопируйте скрипт:
   ```bash
   cp infra/scripts/deploy-local.sh.example infra/scripts/deploy-local.sh
   chmod +x infra/scripts/deploy-local.sh
   ```
2. Проверьте, что `.env.local`, `terraform.tfvars` и Vault секции готовы.
3. Запустите:
   ```bash
   ./infra/scripts/deploy-local.sh
   ```
   Скрипт выполнит:
   - `terraform init && terraform apply` в `infra/terraform/gcp`.
   - Считает `instance_ip` и `ssh_user`, запишет их в `infra/ansible/inventory/prod.ini`.
   - Установит коллекцию `community.hashi_vault`.
   - Выполнит `ansible-playbook site.yml`.

### Ручной вариант (если нужен контроль)

```bash
cd infra/terraform/gcp
terraform init
terraform apply -auto-approve -var-file=../terraform.tfvars

APP_IP="$(terraform output -raw instance_ip)"
SSH_USER="$(terraform output -raw ssh_user)"

cat > ../ansible/inventory/prod.ini <<EOF
[web]
webapp ansible_host=${APP_IP} ansible_user=${SSH_USER} ansible_ssh_private_key_file=${ANSIBLE_SSH_KEY:-$HOME/.ssh/id_ed25519}
EOF

cd ../../ansible
ansible-galaxy collection install community.hashi_vault
ansible-playbook site.yml
```

---

## 5. Быстрый деплой без Terraform (только приложение)

Используйте, когда ВМ уже создана и нужно только обновить код/перезапустить сервисы.

1. Убедитесь, что в `infra/ansible/inventory/prod.ini` прописаны актуальный IP и SSH ключ.
2. Проверьте, что `VAULT_TOKEN`, `VAULT_ADDR`, `ANSIBLE_SSH_KEY` присутствуют в окружении (можно через `.env.local` + `set -a; source .env.local`).
3. Выполните из корня репозитория (команда сама поднимет `ssh-agent`, добавит ключ и запустит плейбук):
   ```bash
   cd /home/ilia/news_project
   ssh-agent bash -c 'ssh-add "${ANSIBLE_SSH_KEY:-$HOME/.ssh/id_ed25519}" && cd infra/ansible && ansible-galaxy collection install community.hashi_vault >/dev/null && ansible-playbook site.yml'
   ```
4. Ansible:
   - Проверит наличие системных пакетов и Node.js.
   - Клонирует/обновит репозиторий (`git pull` через SSH-ключ, прокинутый агентом).
   - Скачает environment файлы из Vault.
   - Пересоберёт Astro и Payload, прогонит `npm run migrate`.
   - Перезапустит systemd службы и Nginx.

> Если надо деплоить только фронт, можно запустить systemd: `sudo systemctl restart astro-frontend`.

---

## 6. Проверки и частые операции

| Что сделать | Команда |
|-------------|---------|
| Проверка сервисов | `sudo systemctl status astro-frontend payload-backend` |
| Перезапуск Nginx | `sudo systemctl reload nginx` |
| Логи Astro | `journalctl -u astro-frontend -f` |
| Логи Payload | `journalctl -u payload-backend -f` |
| Ручной старт миграций | `cd /opt/webapp/app/apps/cms && sudo -u cms npm run migrate` |
| Проверить, что порт 80 слушает Nginx | `sudo ss -tulpn | grep :80` |

---

## 7. Экспорт/импорт секретов из Vault

```bash
vault kv get webapp/env
vault kv get -field=web_env webapp/env > web.env
vault kv get -field=cms_env webapp/env > cms.env
```

---

## 8. Legacy: развёртывание через Docker Compose

> Этот сценарий оставлен для локального теста. На бою используйте Terraform + Ansible.

### 8.1 Предварительные требования

- Ubuntu 22.04/24.04 (или другой Linux)
- Docker + Docker Compose V2

```bash
sudo apt update
sudo apt install docker.io docker-compose-v2 -y
sudo usermod -aG docker $USER  # чтобы запускать без sudo
```

### 8.2 Копирование проекта на сервер

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

### 8.3 `.env`

Пример содержимого (переиспользуйте значения из Vault):

```env
SITE=http://localhost:4321
DATABASE_URI=postgres://payload:password@postgres:5432/payload
PAYLOAD_SECRET=super-secret
PAYLOAD_DB_PUSH=true
REVALIDATION_SECRET=another-secret
CMS_URL=http://localhost:3000
```

### 8.4 Запуск

```bash
docker compose up -d --build
docker compose exec cms npx payload migrate --config src/payload.config.ts
```

Проверка: `http://<IP>:3000/admin` и `http://<IP>:4321/`.

### 8.5 Обновление

```bash
git pull
docker compose up -d --build
docker compose exec cms npx payload migrate --config src/payload.config.ts
```

---

## 9. Импорт фидов вручную (пример)

```bash
cd /home/ilia/news_project/apps/jobs
JOBS_API_KEY=... CMS_URL=http://localhost:3000 npm run import:feeds
```

---

## 10. Команды для работы с Vault

```bash
ssh -i ~/.ssh/id_ed25519 archiebaldstartup@34.55.119.158
```

```bash
vault kv put webapp/env web_env=@web.env cms_env=@cms.env
vault kv get webapp/env
```
