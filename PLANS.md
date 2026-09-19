# Планы

Отложенное живёт **issue** в организации
[codex-aethernum](https://github.com/codex-aethernum) и собирается в проект
[Codex Aethernum](https://github.com/orgs/codex-aethernum/projects/1).

Замысел прогрессии — в [ROADMAP.md](ROADMAP.md). Задачи заведены по нему.

## Дерево задач

Корень — [pack#5](https://github.com/codex-aethernum/pack/issues/5)
«Прогрессия: единый путь по роадмапу», 19 эпиков под ним:

| Эпики | Что внутри |
|---|---|
| [#12](https://github.com/codex-aethernum/pack/issues/12)–[#21](https://github.com/codex-aethernum/pack/issues/21) | десять эр, у каждой «закрыть ворота» и «прохождение» |
| [#10](https://github.com/codex-aethernum/pack/issues/10), [#22](https://github.com/codex-aethernum/pack/issues/22)–[#27](https://github.com/codex-aethernum/pack/issues/27) | семь осей: техника, магия, выживание и еда, хранение, колония, лут и сила, перемещение |
| [#28](https://github.com/codex-aethernum/pack/issues/28) | юнификация и чистка Almost Unified |
| [#29](https://github.com/codex-aethernum/pack/issues/29) | инструменты: граф рецептов, поиск обходов, `doors.py` |
| [#78](https://github.com/codex-aethernum/pack/issues/78)–[#86](https://github.com/codex-aethernum/pack/issues/86) | установка модов по эрам (из [ADDITIONS.md](ADDITIONS.md)), под эпиками своих эр |
| [#72](https://github.com/codex-aethernum/pack/issues/72) | инструменты прогрессии первыми: In Control!, Pufferfish's Skills, Polymorph |
| [#75](https://github.com/codex-aethernum/pack/issues/75), [#76](https://github.com/codex-aethernum/pack/issues/76) | форки: Aether Redux, Dungeons Enhanced |
| [#77](https://github.com/codex-aethernum/pack/issues/77) | сшивка Modern Industrialization |
| [#73](https://github.com/codex-aethernum/pack/issues/73), [#74](https://github.com/codex-aethernum/pack/issues/74) | Neo Origins со своим набором; 29 клиентских модов |

## Порядок

**все моды (#74–#86) → стабильный запуск → граф рецептов (#30) → ворота по эрам → прохождение по эрам → релиз → книга**

Гейтить по неполному составу нельзя: ворота, закрытые до установки всех
модов, откроет первый же мод, поставленный позже. Установка по эрам — это
только очерёдность, чтобы ловить ошибки порциями, а не темп прогрессии.
Граф — скрипт над `mods`, перестраивается после каждого добавления.

Вне прогрессии — совместимость и инфраструктура:
[#1](https://github.com/codex-aethernum/pack/issues/1) Enhanced Celestials 2,
[#2](https://github.com/codex-aethernum/pack/issues/2) Sable × Copycats+,
[#3](https://github.com/codex-aethernum/pack/issues/3) JEI Create: More Catalysts,
[#4](https://github.com/codex-aethernum/pack/issues/4) две копии скриптов,
[book#2](https://github.com/codex-aethernum/book/issues/2) книга,
[fork-coldsweat#1](https://github.com/codex-aethernum/fork-coldsweat/issues/1) тег `chest_armor`.

## Колонки проекта

**Решить** → **Очередь** → **Готово к работе** → **В работе** → **На проверке** → **Сделано**

«Решить» ждёт владельца, а не исполнителя. Метки одинаковые во всех
репозиториях: `эра`, `ось`, `прогрессия`, `совместимость`, `инфраструктура`,
`решение`.

Новое отложенное заводи сразу issue, а не сюда.
