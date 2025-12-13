#!/usr/bin/env bash
set -euo pipefail

RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
NC="\033[0m" # No Color

section() { echo -e "\n${YELLOW}==> $1${NC}"; }
ok() { echo -e "${GREEN}OK:${NC} $1"; }
fail() { echo -e "${RED}FAIL:${NC} $1"; exit 1; }

# 1. Проверка отсутствия process.env в Astro-коде
section "Проверка process.env в apps/web/src"
if grep -R "process\\.env" apps/web/src >/dev/null 2>&1; then
  grep -R "process\\.env" apps/web/src || true
  fail "Найдено использование process.env в apps/web/src (должен быть только import.meta.env)"
else
  ok "process.env не используется в apps/web/src"
fi

# 2. Определяем активный порт фронта (4321 или 4322)
section "Определение порта фронта"
WEB_PORT=""
for PORT in 4321 4322; do
  if curl -fsS "http://localhost:${PORT}/" >/dev/null 2>&1; then
    WEB_PORT="$PORT"
    break
  fi
done

if [[ -z "$WEB_PORT" ]]; then
  fail "Фронтенд не отвечает ни на 4321, ни на 4322"
else
  ok "Фронтенд отвечает на порту ${WEB_PORT}"
fi

# 3. Проверка CMS API (список статей)
section "Проверка CMS /api/articles"
if curl -fsS "http://localhost:3000/api/articles?limit=1" >/dev/null 2>&1; then
  ok "CMS /api/articles отвечает"
else
  fail "CMS /api/articles не отвечает"
fi

# 4. Проверка главной страницы
section "Проверка главной страницы фронта"
set +o pipefail
if curl -fsS "http://localhost:${WEB_PORT}/" 2>/dev/null | grep -q "Последние новости"; then
  ok "Главная страница отдаётся и содержит блок 'Последние новости'"
else
  fail "Главная страница не содержит ожидаемый блок 'Последние новости'"
fi
set -o pipefail

# 5. Проверка блока "Ещё по теме" на странице статьи
section "Проверка блока 'Ещё по теме' на странице статьи"
ARTICLE_PATH="article/umg-and-awake-ny-collaborate-on-music-is-universal-capsule-785.html"
set +o pipefail
if curl -fsS "http://localhost:${WEB_PORT}/${ARTICLE_PATH}" 2>/dev/null | grep -q "Ещё по теме"; then
  ok "На странице статьи отображается блок 'Ещё по теме'"
else
  fail "На странице статьи нет блока 'Ещё по теме'"
fi
set -o pipefail

# 6. Проверка CORS для счётчика просмотров
section "Проверка CORS для increment-view"
ARTICLE_ID=$(curl -fsS "http://localhost:3000/api/articles?limit=1" | jq '.docs[0].id' 2>/dev/null || echo "")
if [[ -z "$ARTICLE_ID" || "$ARTICLE_ID" == "null" ]]; then
  fail "Не удалось получить ID статьи из CMS"
fi

# Проверяем CORS-заголовки
INC_RESP_HEADERS=$(curl -fsSI -X POST "http://localhost:3000/api/articles/${ARTICLE_ID}/increment-view" \
  -H "Origin: http://localhost:${WEB_PORT}" 2>/dev/null || true)

if echo "$INC_RESP_HEADERS" | grep -qi "access-control-allow-origin"; then
  ok "CMS возвращает Access-Control-Allow-Origin для increment-view"
else
  fail "CMS не возвращает Access-Control-Allow-Origin для increment-view"
fi

# 7. Проверка фактического инкремента счётчика
section "Проверка увеличения viewCount"
BEFORE=$(curl -fsS "http://localhost:3000/api/articles/${ARTICLE_ID}" | jq '.viewCount // 0' 2>/dev/null || echo "0")

curl -fsS -X POST "http://localhost:3000/api/articles/${ARTICLE_ID}/increment-view" \
  -H "Origin: http://localhost:${WEB_PORT}" \
  -H "Content-Type: application/json" >/dev/null 2>&1 || fail "Не удалось вызвать increment-view"

AFTER=$(curl -fsS "http://localhost:3000/api/articles/${ARTICLE_ID}" | jq '.viewCount // 0' 2>/dev/null || echo "0")

if [[ "$AFTER" -gt "$BEFORE" ]]; then
  ok "viewCount увеличился: ${BEFORE} → ${AFTER} (articleId=${ARTICLE_ID})"
else
  fail "viewCount не увеличился (до=${BEFORE}, после=${AFTER}, articleId=${ARTICLE_ID})"
fi

section "Все проверки пройдены"
ok "Smoke-тесты фронта и CMS успешно завершены"
