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

## План по выходным

Два рабочих дня в неделю — суббота и воскресенье. Итерация = одни выходные,
вместимость 2 дня; задача длиннее двух дней занимает несколько выходных подряд.
Начало — 19 сентября 2026, конец плана — конец июня 2027, 39 недель.

### Недели 1–2: Решения и быстрые починки — 4 дн.

- **Нед 01** (09-19): fork-coldsweat#1 (0.25д, P0), pack#1 (0.25д, P1), pack#33 (0.25д, P0), pack#4 (0.25д, P1), pack#6 (0.25д, P0), pack#65 (0.25д, P1), pack#67 (0.25д, P1), pack#7 (0.5д, P0)- **Нед 02** (09-26): pack#2 (0.5д, P1), pack#3 (0.5д, P1), pack#8 (0.5д, P0), pack#9 (0.25д, P2)

### Недели 3–9: Установка всех модов — 14.5 дн.

- **Нед 03** (10-03): pack#72 (0.5д, P0), pack#78 (2д, P0)- **Нед 04** (10-10): pack#79 (1.5д, P0)- **Нед 05** (10-17): pack#80 (1д, P0), pack#81 (1д, P0)- **Нед 06** (10-24): pack#82 (0.5д, P0), pack#83 (1.5д, P0)- **Нед 07** (10-31): pack#84 (1.5д, P0), pack#85 (0.5д, P0)- **Нед 08** (11-07): pack#74 (0.5д, P1), pack#86 (1д, P0), pack#75 (1д, P1)- **Нед 09** (11-14): pack#76 (2д, P1)

### Недели 10–17: Инструменты и сшивки по полному составу — 16 дн.

- **Нед 10** (11-21): pack#30 (2д, P0)- **Нед 11** (11-28): pack#31 (1.5д, P1)- **Нед 12** (12-05): pack#32 (1.5д, P1), pack#71 (2д, P1)- **Нед 13** (12-12): pack#54 (1д, P1)- **Нед 14** (12-19): pack#77 (4д, P2)- **Нед 16** (01-02): pack#55 (3д, P2)- **Нед 17** (01-09): pack#11 (1д, P2)

### Недели 18–38: Ворота и прохождение по эрам — 43.25 дн.

- **Нед 18** (01-16): pack#34 (0.5д, P1), pack#69 (0.25д, P1), pack#60 (1д, P1)- **Нед 19** (01-23): pack#35 (1д, P1), pack#36 (0.5д, P1), pack#57 (2д, P2)- **Нед 20** (01-30): pack#37 (1д, P1)- **Нед 21** (02-06): pack#73 (2д, P2)- **Нед 22** (02-13): pack#38 (1д, P2), pack#56 (1д, P2)- **Нед 23** (02-20): pack#62 (1д, P2), pack#63 (0.5д, P2)- **Нед 24** (02-27): pack#39 (1д, P2), pack#40 (2д, P2)- **Нед 25** (03-06): pack#58 (1д, P2)- **Нед 26** (03-13): pack#41 (2д, P2)- **Нед 27** (03-20): pack#42 (1д, P2), pack#70 (0.5д, P2), pack#43 (2д, P2)- **Нед 28** (03-27): pack#64 (2д, P2)- **Нед 29** (04-03): pack#66 (1д, P2)- **Нед 30** (04-10): pack#68 (1д, P2), pack#44 (1д, P2)- **Нед 31** (04-17): pack#61 (1д, P2), pack#45 (2д, P2)- **Нед 32** (04-24): pack#46 (1д, P2)- **Нед 33** (05-01): pack#59 (0.5д, P2), pack#47 (2д, P2)- **Нед 34** (05-08): pack#48 (1д, P3)- **Нед 35** (05-15): pack#49 (2д, P3)- **Нед 36** (05-22): pack#50 (1д, P3), pack#51 (2д, P3)- **Нед 37** (05-29): pack#52 (0.5д, P3), pack#53 (4д, P3)

### Недели 39–40: Книга — 4 дн.

- **Нед 39** (06-12): book#2 (4д, P3)

## Колонки проекта

**Решить** → **Очередь** → **Готово к работе** → **В работе** → **На проверке** → **Сделано**

Поля: **Приоритет** (P0 блокирует / P1 сейчас / P2 следом / P3 когда-нибудь), **Size**,
**Estimate** (дней), **Iteration** (выходные), **Начало**, **Срок**. Шаблонные `Priority`,
`Start date`, `Target date` удалены — API не даёт их заполнять.

«Решить» ждёт владельца, а не исполнителя. Метки одинаковые во всех
репозиториях: `эра`, `ось`, `прогрессия`, `совместимость`, `инфраструктура`,
`решение`.

Новое отложенное заводи сразу issue, а не сюда.
