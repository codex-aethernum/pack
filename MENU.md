# Меню: Codex Aethernum

| Файл | Что это |
|---|---|
| `minecraft/config/fancymenu/assets/menu_background.png` | фон главного меню (1672×941) |
| `minecraft/config/fancymenu/assets/menu_embers.png` | APNG: искры и пепел, 90 кадров, цикл 4.5 с, прозрачный фон |
| `minecraft/config/fancymenu/customization/codex_aethernum_title.txt` | раскладка титульного экрана |
| `minecraft/config/fancymenu/customization/codex_aethernum_universal.txt` | фон для остальных экранов вне игры |
| `minecraft/config/fancymenu/assets/menu_logo.png` | логотип сборки (2172×724) |
| иконка сборки | `%APPDATA%/PrismLauncher/icons/codex_aethernum.png` |
| `minecraft/resourcepacks/CodexAethernum/` | ресурспак с музыкой меню |

Моды: **FancyMenu** 3.9.12 + **Konkrete** 1.9.9 (его библиотека).

## Про анимацию

Слой сгенерирован процедурно, цикл замкнут математически: за 90 кадров каждая
частица проходит целое число высот кадра, мерцание и боковой снос используют
целые гармоники — кадр 90 совпадает с кадром 0, шва не видно.

Тёплые искры сгущены слева (там завод), фиолетовые справа (портал), одна
бирюзовая под шпиль. Пепел падает по всему кадру медленнее искр.

Пересобрать с другими параметрами можно скриптом `embers.py` из сессии —
там в начале файла количество частиц, цвета, скорости и длина цикла.

**Размер кадра важен.** Первая версия была 1280×720 × 90 кадров — это ~331 МБ
распакованных кадров RGBA, мод не успевал их подготовить, и слой просто не
появлялся (ошибок в лог при этом не писал). Текущая версия 640×360 — те же
90 кадров, но ~79 МБ; частицы сделаны крупнее и ярче, чтобы пережить растяжение
на сверхширокий экран.

## Формат раскладки (восстановлен по байткоду, версия 3)

Первая попытка не сработала: фон я записал как `customization { action = background }`,
а FancyMenu читает его через `getContainersOfType("menu_background")` — это
**отдельный тип контейнера**. Проверенная структура:

| Блок | Назначение | Ключевое |
|---|---|---|
| `layout-meta` | к какому экрану цепляется | `identifier = title_screen` (универсальный id из `UniversalScreenIdentifierRegistry`) |
| `menu_background` | фон | `background_type = image` выбирает билдер, дальше `image_path` |
| `element` | наложенные объекты | `element_type = image`, путь в ключе `source` |

Ещё три вещи, выясненные после первого рабочего запуска:

**Растяжение фона.** `ImageMenuBackground.render()` выбирает режим так:
`repeat_texture` → `slide` → `keepBackgroundAspectRatio` → иначе растянуть на
весь экран. Сохранение пропорций задаётся **не в блоке фона**, а опцией уровня
раскладки:

```
customization {
  action = backgroundoptions
  keepaspectratio = true
}
```

На сверхшироком мониторе это даст поля по бокам. Альтернатива без полей —
`slide = true` в блоке фона: картинка заполняет высоту и медленно едет вбок.

**Логотип.** `title_screen_logo` — легаси-ключ, он работает только при
конвертации старых раскладок: превращается в контейнер `vanilla_button`.
В новом формате писать надо сразу так:

```
vanilla_button {
  element_type = vanilla_button
  instance_identifier = minecraft_logo_widget
  is_hidden = true
}
```

Eternal Tales подменяет ванильную текстуру логотипа, поэтому прячется он именно
этим. Остальные виджеты: `minecraft_branding_widget`, `minecraft_splash_widget`,
`minecraft_realms_notification_icons_widget`.

**Пути к файлам — писать БЕЗ префикса.** `ResourceSourceType` знает `local:`,
`location:`, `web:`, но в раскладке эти префиксы **не разбираются**: строка
уходит в загрузчик целиком. Проверено по логу:

```
source = config/fancymenu/assets/menu_embers.png
  -> ResourceSource{sourceType=LOCAL, source='C:/.../menu_embers.png'}   OK

source = local:config/fancymenu/assets/menu_embers.png
  -> ResourceSource{sourceType=LOCATION, source='local:config/...'}
  -> FileNotFoundException -> розово-чёрная заглушка во весь экран
```

**Другие экраны.** Раскладка цепляется к одному экрану через `identifier`.
Плодить файл на каждый экран не нужно — есть универсальная раскладка:

```
identifier = %fancymenu:universal_layout%
universal_layout_whitelist = options_screen;create_world_screen;...
universal_layout_blacklist = title_screen;pause_screen;...
```

Разделитель списков — **точка с запятой**. Всего в
`UniversalScreenIdentifierRegistry` 121 идентификатор.

У нас два файла: `codex_aethernum_title.txt` (титульный экран — фон, искры,
логотип, скрытие ванильного логотипа) и `codex_aethernum_universal.txt`
(только фон, на 16 экранов вне игры). В чёрном списке — титульный экран
(у него свой файл) и внутриигровые: пауза, инвентарь, загрузка мира. Туда фон
не ставится намеренно: он перекрыл бы размытие мира и экраны прогресса.

Допустимые `anchor_point`: `top-left`, `top-centered`, `top-right`, `mid-left`,
`mid-centered`, `mid-right`, `bottom-left`, `bottom-centered`, `bottom-right`,
`element`, `vanilla`.

## Если раскладка всё-таки не подхватится

FancyMenu игнорирует непонятный файл молча, без строчки в логе. Если меню
осталось прежним — собери раскладку встроенным редактором, файлы на местах:

1. Главное меню → кнопка **FancyMenu** (шестерёнка слева вверху) → **Customize Menu**.
2. ПКМ по пустому месту → **Menu Background** → **Image** → **Choose Image** →
   `menu_background.png` (он уже в списке локальных).
3. ПКМ → **Add Element** → **Image** → выбрать `menu_embers.png`.
4. Растянуть элемент на весь экран, в его настройках включить
   **Restart Animation on Menu Load**.
5. **Ctrl+S**, выйти из редактора.

Займёт пару минут и даст гарантированный результат.

## MCP-сервер FancyMenu: функции нет

В `config/fancymenu/options.txt` есть `B:mcp_server_enabled`, но это пустая
заготовка. Проверено по байткоду: строка `mcp_server` встречается **только** в
`Options.class`, ни одного класса с сокетом, HTTP-сервером или MCP-SDK в джарнике
нет — ни в 3.9.12 (последняя под 1.21.1), ни в 3.9.13 под MC 26.3. Включать
опцию бессмысленно, игру держать запущенной незачем.

## Музыка главного меню

Исходник `Workshop to Space.mp3` (3:30, 192 kbps) сконвертирован в OGG Vorbis —
Minecraft другие форматы не читает. Качество `-q:a 5` (~160 kbps, 3.9 МБ),
44.1 кГц стерео.

Лежит в ресурспаке `CodexAethernum`, а не в настройках FancyMenu: так замена
не зависит от того, подхватилась ли раскладка, и переживёт обновление мода.

`assets/minecraft/sounds.json`:

```json
{ "music.menu": { "replace": true, "subtitle": "Workshop to Space",
  "sounds": [ { "name": "codex/menu_theme", "stream": true, "volume": 0.4 } ] } }
```

- `"replace": true` — вытесняет ванильные мелодии меню, иначе игра выбирала бы
  случайно между ними и нашей.
- `"stream": true` — трек длинный, его надо проигрывать потоком, а не грузить
  целиком в память.
- `"volume": 0.4` — **важно**: ванильная музыка меню играет именно на 0.4.
  Без этого поля громкость по умолчанию 1.0, и трек звучал бы в 2.5 раза
  громче, чем игрок ожидает.
- Поля `"category"` в `sounds.json` не существует (проверено: его нет ни в
  одной из 1613 ванильных записей) — категорию задаёт код игры, а не ресурспак.

Пак включён через `options.txt` (`resourcePacks:["file/CodexAethernum"]`).
Файл создан с одной этой строкой — остальные настройки Minecraft допишет сам
при первом выходе из игры.

Заменить трек: положить новый `.ogg` под тем же именем, или сконвертировать
командой

```
ffmpeg -i вход.mp3 -vn -c:a libvorbis -q:a 5 -ar 44100 -ac 2 menu_theme.ogg
```

## Музыка меню: почему ванильная замена не сработала

Наш ресурспак подменяет событие `minecraft:music.menu` — и делает это правильно,
в логе нет ни одной жалобы. Но на титульном экране это событие **не играется**.

`Aquamirae` в классе `HookMinecraft` проверяет свой ранний конфиг
`EarlyConfig.THEMED_MAIN_MENU` и подменяет `Musics.MENU` на
`AquamiraeMusic.TITLE_SCREEN_THEME`. То есть музыку меню перехватывает код мода,
а не ресурсы.

Выключается в `config/obscuria/aquamirae-early.json` (файл создаётся модом
отдельно от его `.toml`-конфигов):

```json
{ "themed_main_menu": false }
```

После этого титульный экран снова играет `minecraft:music.menu`, то есть наш трек.

## Логотип сборки

`menu_logo.png` (2172×724, 3:1, с прозрачностью) ставится элементом на титульный
экран: `anchor_point = top-centered`, `x = 0`, `y = 10`, размер `390×130`
в GUI-единицах.

Про якорь: `AnchorTopCenter.getElementPositionX` считает как
`originX - width/2 + x`, то есть при `x = 0` элемент центрируется сам —
сдвигать на половину ширины не нужно.

Элемент логотипа стоит в файле **последним**, поэтому рисуется поверх слоя искр.
Размер задан в GUI-единицах, а не в пикселях: при смене масштаба интерфейса
в настройках игры логотип изменится вместе с кнопками.
