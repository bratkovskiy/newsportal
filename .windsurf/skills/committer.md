# Skill: committer

## Цель

Этот skill используется для генерации корректного git commit
и вывода команд для фиксации и отправки изменений.

Skill анализирует изменения в проекте и формирует
понятный commit message.

Этот skill **никогда не выполняет команды**.
Он только выводит команды как текст.


## КРИТИЧЕСКИЕ ПРАВИЛА

1. Git команды должны выводиться **только внутри code block**.

2. Никогда не выполняй команды.

3. Всегда используй **git add .**

Никогда не добавляй отдельные файлы.


Запрещено:

```

git add file.py
git add src/api.py

````

Разрешено только:

```bash
git add .
````

## Источники анализа

При формировании commit message можно учитывать:

* изменения в коде
* список изменённых файлов
* контекст последних изменений
* описание задачи или выполненной работы

## Формат commit message

Используй стиль **Conventional Commits**.

Формат:

```
type(scope): short description
```

Примеры:

```
feat(api): add article generation endpoint
fix(ui): remove article truncation
refactor(db): simplify article repository logic
docs(readme): update installation instructions
```

## Типы коммитов

feat — новая функциональность
fix — исправление ошибки
refactor — изменение кода без изменения поведения
docs — документация
style — форматирование
chore — служебные изменения
test — тесты

## Длина commit message

Заголовок должен быть коротким.

Рекомендуемая длина:

50–72 символа.

## Структура ответа

Ответ должен содержать два раздела.

### Commit message

Сформированное сообщение коммита.

### Commands

Git команды **обязательно внутри code block**.

Пример ответа:

Commit message

fix(ui): remove article truncation in article view

Commands

```bash
git status
git add .
git commit -m "fix(ui): remove article truncation in article view"
git push
```

## Язык

Commit message всегда должен быть написан на английском.

```

---

Если хочешь, могу ещё показать **2 очень полезных skill**, которые идеально дополняют твою систему:

```

debug.md
summarize-change.md

```

Они сильно помогают когда работаешь через Cascade и Cline одновременно.
```
