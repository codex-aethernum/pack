# Разбор первого запуска (19.09.2026)

Первый запуск упал. Крэш показывал FTB Quests, но виновата была не она:
три мода упали на конструировании → NeoForge перешёл в «broken mod state» и
перестал рассылать события ресурсов (`Cowardly refusing to send event…`) →
FTB Quests не получила файл темы и упала на пустой коллекции.

**Правило: при таком крэше ищи первую ошибку `Failed to create mod instance`,
а не последнюю строку стектрейса.**

## Что было сломано

| Мод | Причина | Решение |
|---|---|---|
| Compat Delight 1.0.1.1 | ссылался на `ShepherdsPieBlock`, которого нет в Farmer's Delight 1.3.4 (остался только `PieBlock`) | **отключён**: мод от сентября 2025, совместимой версии нет; откатить FD нельзя — Supplementaries объявляет несовместимость с FD < 1.3.0 |
| Create: Relics plus 1.5.2 | ссылался на `WearableRelicItem`, которого нет в Relics **0.10.7.8** | Relics поднята до **0.12.8** |
| Mek Energistics 2.0.2 | миксин-аксессор ждал поле `inputSlot` типа `mekanism…InputInventorySlot`, а MoreMachine 1.4.x сменил тип на свой `BigStackInputInventorySlot` | MoreMachine откачен до **1.3.3** (последняя с нужным типом) |

Найдено уже после, второй проверкой — **до** следующего запуска:

| Мод | Причина | Решение |
|---|---|---|
| RAR-Compat 0.9.7 | 38 исчезнувших классов Relics — сломался от подъёма Relics до 0.12.8 | поднят до **1.0.8** (Reliquified Artifacts) |
| Artifacts 13.2.5 | RAR-Compat 1.0.8 пинит ровно `[13.2.3]` | откачен до **13.2.3** |
| Serene & Slice Compat 0.3.3 | миксин в `WetAir`, удалённый в Slice & Dice 4.3.3; совместимой версии нет | **отключён** |

## Корневая причина трёх из шести

Мой резолвер предпочитал release-канал Modrinth. Под 1.21.1 у JEI, Relics и
RAR-Compat release застыл на старых версиях, а живая разработка идёт в beta —
в результате трижды ставилась версия, несовместимая с соседями.
`resolve.py` исправлен: теперь берётся самая свежая по дате, без учёта канала.

## Две проверки перед запуском

```bash
python preflight.py minecraft/mods
python classcheck.py minecraft/mods
```

**`preflight.py`** — объявленные вещи: `mods.toml` без `modLoader`/`loaderVersion`
и нарушенные `versionRange` (включая optional-зависимости и `type = incompatible`,
где диапазон означает несовместимые версии, а не требуемые).

**`classcheck.py`** — необъявленные: читает constant pool каждого класса и ищет
ссылки на классы соседних модов, которых в установленной версии больше нет.
Ровно так падают Compat Delight и Create: Relics plus, при том что все
объявленные диапазоны у них в порядке.

Ссылки в пакеты **отсутствующих** модов пропускаются — это обычные мягкие
зависимости под `mod_loaded`, они не падают.

### Известные ложные срабатывания classcheck

```
create_vibrant_vaults  -> ProcessingRecipeSerializer, CreateRecipeProvider$GeneratedRecipe
aether_overworld_ores  -> ProcessingRecipeSerializer, ProcessingRecipeBuilder$ProcessingRecipeFactory
```

Обе ссылки живут в классах `…/data/…RecipeProvider` — это генераторы данных,
в игре не загружаются. Проверено: смотри, из какого класса идёт ссылка —
`data/` или `datagen/` в пути означает, что путь мёртвый.

**Чего classcheck не ловит:** смену *типа* поля или сигнатуры метода — как в
случае Mek Energistics. Проверяется только существование класса.

## Прочее из лога (не требует действий)

- `wdutils`: отсутствует заявленный `accesstransformer.cfg` — ошибка в логе, но
  мод грузится. Приехал вложенным в Create: Addon Organizer.
- Konkrete: NPE при копировании файлов локализации — косметика.
- Create: Addon Organizer лезет в сеть за баннерами до загрузки конфига и
  печатает три предупреждения. Мод тянет данные с чужого сервера при каждом
  старте — если не нравится, отключается в его конфиге.
- Sable предупреждает о совместимости с Flywheel: он приехал зависимостью
  Create Aeronautics и переопределяет освещение. При графических артефактах
  подозревать в первую очередь его.


---

# Зависание на создании мира (19.09.2026)

Игра намертво вставала при переходе на экран создания мира: процесс жрал
процессор, но не отвечал. В логе — падение **серверного потока**, клиент после
этого оставался висеть.

```
java.lang.NoSuchMethodError:
  com.momosoftworks.coldsweat.api.temperature.block_temp.BlockTemp
    .<init>(DDDDDZZ[Lnet/minecraft/world/level/block/Block;)V
  at pneumaticcraft ... PNCHeatBlockTemp.<init>
  at cold_sweat ... TempModifierInit.buildBlockRegistries
```

PneumaticCraft вызывает конструктор `BlockTemp` с пятью `double` и двумя
`boolean`. В Cold Sweat **2.4.3.1** остался только `BlockTemp(Block...)` —
сигнатуру изменили. Проверил по джарникам: конструктор есть в **2.4.2** и
раньше, пропал начиная с 2.4.3.

**Решение:** Cold Sweat откачен до 2.4.2. `create_cold_sweat` при этом не
пострадал — он пользуется другими методами (`BlockTemp(Block...)`,
`getTemperature(...)`), оба на месте.

**Признак этого класса поломок:** клиент виснет, а не падает. Сервер уже умер,
но клиент продолжает его ждать. Всегда смотри `logs/latest.log` и
`crash-reports/*-server.txt`, а не только окно игры.

# Третья проверка: apicheck.py

```bash
python apicheck.py minecraft/mods
```

`preflight.py` проверяет объявленные диапазоны версий.
`classcheck.py` — существование классов соседних модов.
**`apicheck.py` — существование методов, конструкторов и полей с нужной
сигнатурой.** Ровно это ловит случаи, когда класс на месте, а член изменился:

| Случай | preflight | classcheck | apicheck |
|---|---|---|---|
| FD убрал `ShepherdsPieBlock` | нет | **да** | да |
| Relics переехал `WearableRelicItem` | нет | **да** | да |
| Cold Sweat сменил конструктор `BlockTemp` | нет | нет | **да** |
| MoreMachine сменил тип поля `inputSlot` | нет | нет | **да** |
| JEI ниже требуемого диапазона | **да** | нет | нет |

Как работает: читает constant pool всех классов, выбирает ссылки на члены
классов, принадлежащих **другому** установленному моду, затем разбирает таблицы
методов и полей у этих классов-целей и сверяет дескрипторы, поднимаясь по
цепочке суперклассов. Цели вне модов (Minecraft, JDK) не проверяются.

Проверено на реальном случае: ссылку `BlockTemp.<init>(DDDDDZZ[LBlock;)V` из
PneumaticCraft она видит и с Cold Sweat 2.4.3.1 пометила бы как отсутствующую.

**Прогонять все три перед каждым запуском после добавления модов.**

## Краш при удалении мира: Cold Sweat × Aquamirae

**Симптом.** `Failed to load registries due to above errors` при любом действии,
которое перезагружает датапаки (создание/удаление мира). В логе перед крашем:

```
Error deserializing config: object "aquamirae:three_bolt_boots" does not exist
Failed to parse cold_sweat:.../aquamirae_three_bolt/three_bolt_boots.json
```

**Причина.** Aquamirae переименовал водолазный костюм: `three_bolt_*` →
`salvager_helmet / salvager_suit / salvager_waders / salvager_boots`.
Cold Sweat **2.4.2** ещё ссылается на старые имена в четырёх встроенных
конфигах изоляторов. В 2.4.3 они обновлены — но 2.4.3 несовместим с
PneumaticCraft (см. раздел про зависание при создании мира), поэтому
откатиться к ней нельзя.

**Решение.** Четыре JSON внутри `ColdSweat-2.4.2.jar` пропатчены на новые
идентификаторы предметов. Функция сохранена: костюм по-прежнему даёт
иммунитет к `cold_sweat:water` и +0.2 к холодостойкости за комплект.
Оригинал джарника: `scratchpad/csfix/ColdSweat-2.4.2.orig.jar`.

> При обновлении Cold Sweat патч будет затёрт. Если снова появится эта ошибка —
> либо повторить патч, либо проверить, совместима ли новая версия с
> PneumaticCraft по конструктору `BlockTemp`.

**Патч теперь воспроизводим.** Он живёт в форке
[codex-aethernum/fork-coldsweat](https://github.com/codex-aethernum/fork-coldsweat),
ветка `codex/2.4.2-aquamirae`: основана на `a0724565f` — последнем коммите с
`mod_version=2.4.2`, ровно том, из которого собран релизный джарник (сверено
побайтово). Поверх — один коммит на четыре файла.

Заодно выяснилось, что апстрим ту же проблему решил иначе: в 2.4.3 коммит
`c3781dcf5` «Remove Aquamirae compat» просто удалил все четыре конфига.
Совместимость не починена, а выброшена — костюм перестал быть изолятором.
Подробности и порядок действий при обновлении — в `CODEX-FORK.md` форка.

## KubeJS: скрипты не загружались

Два скрипта падали при загрузке, из-за чего вся сшивка Immersive Engineering
(1611 строк рецептов) не применялась:

- `10_ie_stitch.js:1032` — сокращённая запись свойства `{ count }`.
  **Rhino в KubeJS её не поддерживает**, нужно писать `{ count: count }`.
  Node.js такую ошибку не покажет — `node --check` проходит.
- `01_loot_and_world.js` — события `ServerEvents.blockLootTables` не существует
  (нужен LootJS, его в сборке нет). Обработчик закомментирован.

## Фон в меню настроек: universal-слой FancyMenu не работает

Слой с `identifier = %fancymenu:universal_layout%` и белым списком экранов
молча игнорировался — фон Eternal Tales оставался в Options и других меню.
Заменён на **отдельный layout-файл на каждый экран** (40 штук,
`codex_<screen_id>.txt`); этот способ уже доказал работоспособность на
`title_screen`. Список валидных id вытащен из
`UniversalScreenIdentifierRegistry` FancyMenu — всего их 118.
Старый файл сохранён как `codex_aethernum_universal.txt.disabled`.

## Краш на старте клиента: Iris 1.8.12 × Sodium 0.8

**Симптом.** `MixinTransformerError` на `LevelRenderer`, в глубине:

```
MixinPreProcessorException: Attach error for mixins.iris.compat.sodium.json:MixinRenderSectionManager
ClassNotFoundException: net.caffeinemc.mods.sodium.client.gui.SodiumGameOptions$PerformanceSettings
```

**Причина.** Sodium 0.8 переименовал `SodiumGameOptions` → `SodiumOptions`.
Iris 1.8.12 — последний релиз *старой* линии и требует Sodium **0.6.13**
(так и записано в его зависимости на Modrinth). Резолвер брал «последнее»
для каждого мода независимо, поэтому пара разъехалась.

**Почему нельзя просто откатить Sodium.** MoreCulling 1.0.10 объявляет
`sodium versionRange="[, 0.8.0)" type="incompatible"`, то есть требует 0.8+.
Откат Sodium сломал бы его.

**Решение.** Iris обновлён до **1.8.14-beta.1** — это линия под Sodium 0.8
(её `MixinRenderSectionManager` ссылается уже на `SodiumOptions$PerformanceSettings`,
а в `neoforge.mods.toml` прямым текстом: «Please use Sodium 0.8 instead»).
Релизной версии под 0.8 для 1.21.1 пока нет, стоит бета.
Старый джарник: `scratchpad/backup/iris-neoforge-1.8.12+mc1.21.1.jar`.

> При обновлении Sodium или Iris проверяй пару целиком: `versions?loaders=[neoforge]`
> у Iris показывает, какой ровно `version_id` Sodium он требует.

## Первый вход в мир: долгий «Loading terrain…» и три шумные записи

Мир грузится, но экран `Loading terrain…` висит ещё ~2 минуты. Это не зависание:
сервер уже отдал клиенту рецепты (`ClientboundUpdateRecipesPacket`), и JEI
по кругу инициализирует плагины всех модов. Смотри в логе
`PluginCallerTimerRunnable` — он сам печатает, кто сколько занял.

Главный тормоз — **mekanicalcreate** (~35 с): его `SimulationRecipeResolver`
сканирует всё семейство Create (нашёл 49 модов) и строит по ним симулированные
рецепты для JEI. Разово при каждом входе в мир.

Три записи оттуда, которые выглядят страшно и ничего не значат:

1. `Caught an error from mod plugin … create_more_catalysts:jei_plugin`
   → `recipeCategories must not be empty` из `AnvilcraftJeiCategories`.
   Мод регистрирует пустой список категорий для совместимости с Anvilcraft,
   а Anvilcraft в сборке нет. JEI ловит исключение и выбрасывает плагин целиком —
   теряются только вкладки JEI от Create: More Catalysts.
2. Стектрейс на пол-экрана через `SimulationRecipeResolver.collectCandidates` —
   это **WARN**, а не краш: `Skipped unsafe block entity recipe signature
   inspection for copycats:wrapped_copycat`. mekanicalcreate проверяет block
   entity на болванке в `BlockPos{0,0,0}`, на копикате Copycats+ получает
   `IllegalStateException`, ловит его и пропускает блок. Трейс печатает целиком.
3. `Sable: Failed to apply tag physics properties. Unknown block:
   copycats:copycat_catwalk` — Sable (приехал с Create Aeronautics) ссылается на
   блок, которого в установленной версии Copycats+ нет. Второй звоночек по паре
   Sable × Copycats+; при графических артефактах подозревать Sable первым.

**Правило:** `[ERROR]` от `mezz.jei.library.load.PluginCallerTimerRunnable` —
это таймер, а не ошибка. Он повышает уровень до ERROR просто чтобы заметили,
что плагин думает дольше пяти секунд.
