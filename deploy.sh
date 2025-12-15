#!/bin/bash
set -euo pipefail

echo "🚀 Starting deployment process..."

TF_DIR="infra/terraform/gcp"
TFVARS_FILE_DEFAULT="$TF_DIR/terraform.tfvars"
ANSIBLE_DIR="infra/ansible"
INVENTORY_FILE="$ANSIBLE_DIR/inventory.ini"

ENV_FILE_PATH="${ENV_FILE:-}"
GIT_KEY_PATH="${GIT_KEY:-}"
DB_SEED_FILE_PATH="${DB_SEED_FILE:-}"

ROOT_DIR="$(pwd)"
if [ -n "$ENV_FILE_PATH" ] && [[ "$ENV_FILE_PATH" != /* ]]; then
  ENV_FILE_PATH="$ROOT_DIR/$ENV_FILE_PATH"
fi
if [ -n "$GIT_KEY_PATH" ] && [[ "$GIT_KEY_PATH" != /* ]]; then
  GIT_KEY_PATH="$ROOT_DIR/$GIT_KEY_PATH"
fi
if [ -n "$DB_SEED_FILE_PATH" ] && [[ "$DB_SEED_FILE_PATH" != /* ]]; then
  DB_SEED_FILE_PATH="$ROOT_DIR/$DB_SEED_FILE_PATH"
fi

SITE="${SITE:-default}"
TFVARS_FILE="${TFVARS:-$TFVARS_FILE_DEFAULT}"
MODE="${MODE:-provision}"

if [ -n "$TFVARS_FILE" ] && [[ "$TFVARS_FILE" != /* ]]; then
  TFVARS_FILE="$ROOT_DIR/$TFVARS_FILE"
fi

SSH_USER_OVERRIDE="${SSH_USER:-}"
SSH_KEY_PATH_OVERRIDE="${SSH_KEY_PATH:-}"

if [ -n "$SSH_KEY_PATH_OVERRIDE" ] && [[ "$SSH_KEY_PATH_OVERRIDE" != /* ]]; then
  SSH_KEY_PATH_OVERRIDE="$ROOT_DIR/$SSH_KEY_PATH_OVERRIDE"
fi

DEPLOY_DIR=".deploy"
SITE_DIR="$DEPLOY_DIR/$SITE"
SITE_IP_FILE="$SITE_DIR/vm_ip"
SITE_INVENTORY_FILE="$SITE_DIR/inventory.ini"

mkdir -p "$SITE_DIR"

if [ "$MODE" = "deploy" ]; then
  if [ ! -f "$SITE_IP_FILE" ]; then
    echo "❌ No cached IP found for SITE=$SITE at $SITE_IP_FILE"
    echo "   Run MODE=provision first (terraform+ansible) to create VM and cache IP."
    exit 1
  fi
  SERVER_IP=$(cat "$SITE_IP_FILE")
  echo "🌐 Server IP (cached): $SERVER_IP"
else
  echo "🔧 Initializing Terraform..."
  terraform -chdir="$TF_DIR" init -reconfigure -input=false

  echo "🗂️  Selecting Terraform workspace: $SITE"
  if ! terraform -chdir="$TF_DIR" workspace select "$SITE" >/dev/null 2>&1; then
    terraform -chdir="$TF_DIR" workspace new "$SITE" >/dev/null
  fi

  if [ ! -f "$TFVARS_FILE" ]; then
    echo "❌ TFVARS file not found: $TFVARS_FILE"
    echo "   Provide TFVARS=infra/terraform/gcp/envs/site1.tfvars (file is ignored by git)"
    exit 1
  fi

  echo "🚀 Applying Terraform configuration..."
  terraform -chdir="$TF_DIR" apply -auto-approve -input=false -var-file="$TFVARS_FILE"

  SERVER_IP=$(terraform -chdir="$TF_DIR" output -raw vm_ip)
  echo "$SERVER_IP" > "$SITE_IP_FILE"
  echo "🌐 Server IP: $SERVER_IP (cached at $SITE_IP_FILE)"
fi

SSH_USER="deploy"
SSH_KEY_PATH=""

if [ -n "$SSH_USER_OVERRIDE" ]; then
  SSH_USER="$SSH_USER_OVERRIDE"
fi
if [ -n "$SSH_KEY_PATH_OVERRIDE" ]; then
  SSH_KEY_PATH="$SSH_KEY_PATH_OVERRIDE"
fi

if [ -z "$SSH_USER_OVERRIDE" ] || [ -z "$SSH_KEY_PATH_OVERRIDE" ]; then
  if [ -f "$TFVARS_FILE" ]; then
    TF_SSH_USER=$(awk -F= '/^ssh_user[[:space:]]*=/{gsub(/["[:space:]]/,"",$2);print $2}' "$TFVARS_FILE" | tail -n 1)
    TF_SSH_KEY_PATH=$(awk -F= '/^ssh_private_key_path[[:space:]]*=/{gsub(/["[:space:]]/,"",$2);print $2}' "$TFVARS_FILE" | tail -n 1)
    if [ -n "$TF_SSH_USER" ] && [ -z "$SSH_USER_OVERRIDE" ]; then
      SSH_USER="$TF_SSH_USER"
    fi
    if [ -n "$TF_SSH_KEY_PATH" ] && [ -z "$SSH_KEY_PATH_OVERRIDE" ]; then
      SSH_KEY_PATH="$TF_SSH_KEY_PATH"
    fi
  fi
fi

echo "🔑 SSH user: $SSH_USER"
SSH_ARGS=(
  -o StrictHostKeyChecking=no
  -o UserKnownHostsFile=/dev/null
  -o ConnectTimeout=5
)
if [ -n "$SSH_KEY_PATH" ]; then
  echo "🔑 SSH key: $SSH_KEY_PATH"
  SSH_ARGS+=( -i "$SSH_KEY_PATH" )
fi

echo "⏳ Waiting for SSH to become available..."
SSH_OK=0
for i in $(seq 1 60); do
  if ssh "${SSH_ARGS[@]}" "$SSH_USER@$SERVER_IP" "echo ok" >/dev/null 2>&1; then
    SSH_OK=1
    break
  fi
  sleep 5
done

if [ "$SSH_OK" -ne 1 ]; then
  echo "❌ SSH is not reachable for $SSH_USER@$SERVER_IP after waiting. Aborting."
  exit 1
fi

if [ -f "$ANSIBLE_DIR/site.yml" ]; then
  echo "📝 Updating Ansible inventory..."
  mkdir -p "$ANSIBLE_DIR"
  cat > "$INVENTORY_FILE" <<EOL
[web]
newsportal ansible_host=$SERVER_IP ansible_user=$SSH_USER${SSH_KEY_PATH:+ ansible_ssh_private_key_file=$SSH_KEY_PATH} ansible_python_interpreter=/usr/bin/python3
EOL

  cp "$INVENTORY_FILE" "$SITE_INVENTORY_FILE"

  echo "⚙️  Running Ansible playbook..."
  if [ -z "$ENV_FILE_PATH" ]; then
    echo "❌ ENV_FILE is not set. Provide path to your .env outside the repo, e.g.:"
    echo "   ENV_FILE=~/.config/newsportal/prod.env ./deploy.sh"
    exit 1
  fi

  ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook \
    -i "$INVENTORY_FILE" \
    -e "local_env_file=$ENV_FILE_PATH" \
    ${DB_SEED_FILE_PATH:+-e "local_db_seed_file=$DB_SEED_FILE_PATH"} \
    ${GIT_KEY_PATH:+-e "local_git_ssh_key_file=$GIT_KEY_PATH"} \
    "$ANSIBLE_DIR/site.yml"
else
  echo "⚠️  $ANSIBLE_DIR/site.yml not found. Terraform finished, skipping Ansible."
fi

echo "✅ Deployment completed successfully!"
echo "🌍 Your application should be available at: http://$SERVER_IP"
