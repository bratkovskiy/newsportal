#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCAL_CFG="$ROOT_DIR/deploy.local.env"

if [ -f "$LOCAL_CFG" ]; then
  set -a
  . "$LOCAL_CFG"
  set +a
fi

SITE="${SITE:-default}"
ENV_FILE="${ENV_FILE:-}"
GIT_KEY="${GIT_KEY:-}"
DB_SEED_FILE="${DB_SEED_FILE:-}"
TFVARS="${TFVARS:-}"

if [ -z "$ENV_FILE" ]; then
  echo "❌ ENV_FILE is not set"
  echo "   Create $LOCAL_CFG with ENV_FILE=... and GIT_KEY=... (and optionally SITE/TFVARS/DB_SEED_FILE)"
  exit 1
fi
if [ -z "$GIT_KEY" ]; then
  echo "❌ GIT_KEY is not set"
  echo "   Create $LOCAL_CFG with ENV_FILE=... and GIT_KEY=... (and optionally SITE/TFVARS/DB_SEED_FILE)"
  exit 1
fi

if [ -n "$TFVARS" ]; then
  SITE="$SITE" TFVARS="$TFVARS" ENV_FILE="$ENV_FILE" GIT_KEY="$GIT_KEY" ${DB_SEED_FILE:+DB_SEED_FILE="$DB_SEED_FILE"} "$ROOT_DIR/deploy.sh"
else
  SITE="$SITE" ENV_FILE="$ENV_FILE" GIT_KEY="$GIT_KEY" ${DB_SEED_FILE:+DB_SEED_FILE="$DB_SEED_FILE"} "$ROOT_DIR/deploy.sh"
fi
