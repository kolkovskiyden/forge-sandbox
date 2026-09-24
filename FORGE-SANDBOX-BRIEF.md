# Forge sandbox — бриф для Claude Code

## Цель

Поднять песочницу AI Forge (продукт Vention, https://ai-forge.ventionteams.com) и прогнать через неё один полный Quick Flow: тикет в Jira → ветка → реализация агентом → архив → merge → тикет закрыт → PBI виден на дашборде Forge.

Это учебный проект Дениса, не рабочий. Цель — понять, как Forge и BMAD работают на практике.

## Что такое Forge, в двух словах

- **Skill Pack `@vention/sdlc`** (CLI `vsdlc`) ставит в git-воркспейс набор скиллов для Claude Code: стоковые BMAD (`bmad-*`) + свои Vention (`vention-*`). Скиллы ведут работу по фиксированному процессу: start flow → стадии → archive.
- **Forge app** — дашборды, куда скиллы через хуки докладывают о каждой стадии. Тикет считается доставленным, когда flow завершён **и** тикет закрыт в Jira.
- Артефакты (спеки, state-файлы) лежат в `_bmad-output/` и коммитятся в git.
- Единственный вход в процесс — `/vention-start-flow` на тикете. Без него ничего не трекается.

Доки: https://ai-forge.ventionteams.com/docs/ (Денис залогинен в браузере).

## Что уже сделано

- Forge-воркспейс `AI-Belarus-DK`, **Workspace ID: `ai-belarus-dk`**, Денис — Admin.
- В Forge подключена Jira Cloud: `https://cyber-sun.atlassian.net`, проект **FT** (отдельная песочница). PBI mapping: `Issue Type` = `Story, Bug`. Non-SDD: `Issue Type` = `Task`. Business Time: Minsk, Пн–Пт 9–17.
- На Mac: Node 20.19, git 2.50. Приватный npm-реестр `@vention` настроен, `npm login` пройден. `vsdlc 0.3.1` установлен глобально.
- Папка `~/forge-sandbox`: `git init`, один пустой коммит на `main`. Remote добавлен как `git@github.com:kolkovskiyden/forge-sandbox.git`, но **SSH на github.com:22 таймаутит** — push не прошёл.
- GitHub-репо существует: https://github.com/kolkovskiyden/forge-sandbox (приватный, пустой).

## Что осталось — по шагам

### 1. Запушить репо (Claude Code делает)

```
cd ~/forge-sandbox
git remote set-url origin https://github.com/kolkovskiyden/forge-sandbox.git
git push -u origin main
```

Если git просит креды — остановиться и сказать Денису. Ничего не вводить.

### 2. `vsdlc install` — Денис запускает сам в обычном терминале

Интерактивный визард, Claude Code его **не запускает**. Ответы:

| Вопрос | Ответ |
|---|---|
| How to configure | Interactive |
| Scenario | single-repo |
| Forge workspace id | `ai-belarus-dk` |
| Issue tracker | Jira |
| Jira base URL | `https://cyber-sun.atlassian.net` |
| Project key | `FT` |
| Bug type name | `Bug` |
| User story type name | `Story` |
| Epic type name | `Epic` |
| Initiative type name | пусто |
| TMS | None |
| CodeGraph | On |
| Ready to write | Proceed |
| Install local dependencies | Setup |
| Tools to wire | только Claude Code |
| BMAD modules | дефолт |
| Jira credentials | email Дениса + API-токен (вводит сам) |

Визард напишет `.vsdlc/workspace.toml`, `CLAUDE.md`, `AGENTS.md`, `.gitignore`, поставит BMAD-модули и MCP-серверы (AI-Forge, jira, figma).

### 3. Закоммитить и проверить (Claude Code)

```
git add -A && git commit -m "Set up Forge workspace" && git push
vsdlc check     # ожидаем exit 0
```

Если `vsdlc check` ругается — прочитать вывод и https://ai-forge.ventionteams.com/docs/how-to-guides/fix-installation-problems/

### 4. Первый тикет (Денис в Jira)

Создать в проекте FT тикет типа **Story**, например:
«Скелет todo-приложения: Vite + React + TypeScript, один экран со списком задач, добавление и удаление». Запомнить ключ (FT-1 или какой выдаст).

### 5. Первый flow (Claude Code, перезапущенный из `~/forge-sandbox`)

Перезапустить `claude`, чтобы подхватились новые скиллы и MCP. Затем:

```
/vention-start-flow start flow for FT-1
```

Ожидаемое поведение:
- скилл найдёт тикет в Jira, спросит Quick или Full → **Quick**;
- подтвердит имя ветки и base branch → соглашаться с дефолтами;
- Design-фаза → **нет** (UI без Figma);
- создаст ветку, `_bmad-output/userstory/<...>.json`, отправит событие flow-started;
- уйдёт в `bmad-quick-dev`: уточнит задачу, напишет короткую спеку, попросит **approve** — прочитать, одобрить;
- реализует, напишет тесты.

Дальше:
- `/vention-complete-stage` — если Implementation не закрылась сама;
- Testing: `/vention-qa-generate-test-docs` — можно пропустить на первом круге, тогда закрыть стадию через `/vention-complete-stage`;
- `vention-archive-artifacts` — перед мержем; прогонит drift check;
- merge ветки в main, push;
- закрыть тикет FT-1 в Jira (статус Done) — Forge сам статусы не меняет.

### 6. Проверить дашборд

https://ai-forge.ventionteams.com/dashboard — SDD Flow → PBI Delivery → Completed PBIs. Тикет должен появиться. Если нет — https://ai-forge.ventionteams.com/docs/how-to-guides/fix-flow-tracking/

## Правила для Claude Code

- Не вводить креды, токены, пароли — просить Дениса.
- Не запускать `vsdlc install` — он интерактивный, его запускает Денис.
- Не редактировать файлы под `_bmad/` (кроме `_bmad/custom/*.user.toml`) — их перезапишет следующий install.
- Не создавать второй flow на тот же тикет, если первый сломался — сначала разобраться по «Fix flow tracking».
- Не «подгонять» метрики повторными запусками стадий.
- Если скилл ведёт себя странно — `/bmad-help` покажет текущее состояние и следующий шаг.

## Полезные команды

```
vsdlc                    # меню: что можно сделать
vsdlc check              # здоровье воркспейса, ничего не меняет
vsdlc configure local    # поменять тулы/модули/креды на этой машине
vsdlc sync               # обновить репозитории
/bmad-help               # где я и что дальше
/vention-complete-stage  # закрыть стадию руками
git branch --show-current                  # flow привязан к ветке
cat _bmad-output/userstory/*.json          # локальное состояние flow
```
