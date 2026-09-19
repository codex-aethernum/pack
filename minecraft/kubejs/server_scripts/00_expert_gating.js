// Хардкор/эксперт: точка входа для перестройки прогрессии.
// Правило сборки — ничего не удаляем «насовсем», а заменяем на более дорогой путь,
// чтобы рецепт оставался видимым в JEI и логика читалась.

ServerEvents.recipes(event => {

    // --- 1. Пример: удорожаем ключевой ранний блок ---
    // event.remove({ output: 'create:mechanical_press' })
    // event.shaped('create:mechanical_press', [
    //     'III',
    //     ' C ',
    //     ' A '
    // ], {
    //     I: '#c:ingots/iron',
    //     C: 'create:cogwheel',
    //     A: 'create:andesite_alloy'
    // })

    // --- 2. Пример: гейт межмодового перехода ---
    // Не даёт прыгнуть из Create сразу в Mekanism без своего этапа.
    // event.remove({ output: 'mekanism:steel_casing' })

    // --- 3. Пример: юнификация вручную, если Almost Unified что-то не свёл ---
    // event.replaceInput({}, 'immersiveengineering:ingot_steel', '#c:ingots/steel')
})

// Теги — самый дешёвый способ сделать сборку логичной:
// один тег вместо десятка одинаковых слитков из разных модов.
ServerEvents.tags('item', event => {
    // event.add('c:ingots/steel', 'mekanism:ingot_steel')
    // event.add('mypack:tier2_machine_casing', 'create:brass_casing', 'mekanism:steel_casing')
})
