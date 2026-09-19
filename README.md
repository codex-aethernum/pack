# Codex Aethernum: The NeverEnding Story

Minecraft 1.21.1 · NeoForge 21.1.251 · 220 модов · 12 ГБ heap

Сборка-фундамент: контента много, но прогрессия намеренно **не** доработана —
логику ты выстраиваешь сам через Almost Unified и KubeJS.

## Воркспейс

Сборка — часть организации [codex-aethernum](https://github.com/codex-aethernum):

| Репозиторий | Что там |
|---|---|
| [pack](https://github.com/codex-aethernum/pack) | этот репозиторий: конфиги, KubeJS, оформление, доки |
| [tools](https://github.com/codex-aethernum/tools) | скрипты сборки и три проверки, отдельно и без привязки к сборке |
| [book](https://github.com/codex-aethernum/book) | Codex Aethernum Book — квестовая книга: 1165 заданий, 20 карт прогрессии |
| [fork-coldsweat](https://github.com/codex-aethernum/fork-coldsweat) | форк Cold Sweat: правка изоляторов Aquamirae поверх 2.4.2 |

Джарников модов в git нет: 1.1 ГБ чужого кода, который к тому же почти нигде
нельзя перераздавать. Состав воспроизводится из `modlist.lock.json` —
в нём слаг, версия, URL и SHA-1 каждого мода.

## Что где

| Путь | Что это |
|---|---|
| `MODLIST.md` | состав по категориям |
| `modlist.lock.json` | лок-файл: слаг, версия, URL, SHA-1 каждого мода |
| `preflight.py` | проверка №1: битые mods.toml и версии зависимостей |
| `classcheck.py` | проверка №2: ссылки на исчезнувшие классы соседних модов |
| `apicheck.py` | проверка №3: вызовы методов/конструкторов с изменившейся сигнатурой |
| `TROUBLESHOOTING.md` | разбор первого запуска и что чем чинилось |
| `ROADMAP.md` | **замысел: единый путь через десять эр** |
| `PLANS.md` | указатель на дерево задач и доску проекта |
| `ADDITIONS.md` | кандидаты на добавление, разложенные по эрам |
| `MENU.md` | оформление главного меню: фон, анимация, иконка |
| `BRIDGES.md` | разбор мод-мостов и что из них заменено скриптами |
| `modlist-curseforge.md` | 5 модов мимо Modrinth: откуда и как обновлять |
| `client_only_mods.txt` | 15 модов, которые НЕ ставить на сервер |
| `minecraft/config/almostunified/` | приоритеты юнификации руд/слитков |
| `minecraft/kubejs/` | скелет скриптов с примерами гейтинга |

## Первый запуск

1. В Prism жми **Add Instance → Import** не нужно — инстанс уже в списке
   (если не видно, перезапусти Prism: он был открыт во время создания).
2. Первый запуск долгий (2–5 мин): NeoForge докачивает библиотеки, KubeJS
   и Almost Unified генерируют остальные конфиги.
3. После первого запуска проверь `minecraft/logs/almostunified/almostunified.log` —
   там видно, какие руды реально свелись, а какие нет.

## Almost Unified: как настроено

`config/almostunified/unification/materials.json` — приоритет модов сверху вниз:

```
minecraft → mekanism → immersiveengineering → create → powah → ...
```

Побеждает первый мод в списке, у которого есть предмет с нужным тегом.
Ванильные железо/золото/медь остаются ванильными, металлы техномодов
сводятся к Mekanism как к самой глубокой цепочке переработки.

Остальные файлы (`placeholders.json`, `duplicates.json`, `debug.json`)
AU создаст сам при первом запуске — в них список материалов и правила
сравнения дубликатов, их удобно править уже по факту.

## KubeJS: с чего начинать

- `server_scripts/00_expert_gating.js` — рецепты и теги, основная работа
- `server_scripts/10_ie_stitch.js` — сшивка Immersive Engineering, заменяет отключённый engineeredcompatibility
- `server_scripts/01_loot_and_world.js` — лут
- `startup_scripts/00_registry.js` — свои предметы/блоки
- `client_scripts/00_tooltips.js` — подсказки об изменённой прогрессии

В игре: `/kubejs reload server_scripts` перезагружает рецепты без рестарта.
`/kubejs hand` печатает id предмета в руке.

## Сервер

Когда дойдёт до сервера:

1. Скопируй `minecraft/mods`, `config`, `kubejs` на сервер.
2. Удали из серверных модов всё из `client_only_mods.txt`.
3. Поставь NeoForge 21.1.251 server installer, Java 21.
4. В `config/almostunified/startup.json` оставь `server_only: false` —
   клиент и сервер должны юнифицировать одинаково, иначе рассинхрон рецептов.

## Моды не с Modrinth

FTB-стек (Quests + Library + Teams + XMod Compat), Architectury и LaserIO —
подробности и способ обновления в `modlist-curseforge.md`.

## Не установлено намеренно

- **Embeddium** — конфликтует с Sodium, который здесь стоит.
- **Create: Enchantment Industry** — под 1.21.1 доступен только форк,
  тянущий за собой посторонний мод с драконами.

## Проверка перед запуском

```
python preflight.py minecraft/mods
python classcheck.py minecraft/mods
python apicheck.py minecraft/mods
```

Ловит два класса ошибок, на которых NeoForge падает ещё до меню:

1. `mods.toml` без `modLoader`/`loaderVersion` — мод отвергается как «not a valid mod file»;
2. нарушенные `versionRange`, включая **optional**-зависимости: если мод присутствует,
   диапазон обязан выполняться.

Понимает `type = "incompatible"` (там диапазон означает несовместимые версии,
а не требуемые) и версии вида `1.21.1-1.0.212`, где спереди приписана версия Minecraft.
Прогоняй после каждого добавления модов — дешевле, чем ловить это запуском.
