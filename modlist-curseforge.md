# Моды не с Modrinth

| Мод | Версия | Откуда качалось |
|---|---|---|
| FTB Quests (NeoForge) | 2101.1.36 | CurseForge CDN (`mediafilez.forgecdn.net`), индекс через `api.cfwidget.com` |
| FTB Library (NeoForge) | 2101.1.36 | **официальный maven FTB** — `maven.ftb.dev/releases/dev/ftb/mods/ftb-library-neoforge/` |
| FTB Teams (NeoForge) | 2101.1.11 | CurseForge CDN |
| FTB XMod Compat (NeoForge) | 21.1.12 | CurseForge CDN |
| Architectury API | 13.0.11 | Modrinth |
| LaserIO | 1.9.11 | CurseForge CDN |
| Botania | 457-SNAPSHOT | **официальный maven** — `maven.blamejared.com/vazkii/botania/botania-neoforge-1.21.1/` |
| MineColonies + Structurize + Domum Ornamentum + Multi-Piston | 1.21.1-snapshot | CurseForge CDN |
| BlockUI | 1.21.1-1.0.182-beta | **официальный maven LDTTeam** — `ldtteam.jfrog.io/artifactory/modding/` |
| Flux Networks | 8.0.0 | CurseForge CDN |
| The Twilight Forest | 4.8.3345 | CurseForge CDN |

Версии сверены с `neoforge.mods.toml` самого FTB Quests — все диапазоны
зависимостей выполнены (`ftblibrary>=2101.1.36`, `ftbteams>=2101.1.9`,
`architectury>=13.0.8`, `ftbxmodcompat>=21.1.7`).

LaserIO 1.9.11 обязательных зависимостей не имеет (`minecraft [1.21,1.22)`,
`neoforge [21.0,)`); опциональная интеграция с Mekanism активируется сама.

## Как обновлять

У CurseForge закрытый API — прямой поиск требует ключа с
`console.curseforge.com` (бесплатный). Без ключа рабочие пути:

1. **maven.ftb.dev** — для всего, что делает FTB Team. Официально, стабильно,
   `maven-metadata.xml` отдаёт список версий. Предпочитать этот путь.
2. **api.cfwidget.com** — публичный индекс проектов CurseForge, отдаёт `fileId`.
   По нему собирается прямая ссылка на CDN:
   `https://mediafilez.forgecdn.net/files/{fileId/1000}/{fileId%1000}/{имя файла}`
   Сам CDN отдаёт файлы свободно; 403 даёт только сайт и официальный API.

Скрипт `cfdl.py` из сессии делает это автоматически.
