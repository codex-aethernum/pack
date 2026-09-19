// Рецепты, сломанные в самих модах. Не баланс — починка.
ServerEvents.recipes(event => {

    // aether_overworld_ores: дробление святокаменной серной руды выдавало
    // minecraft:air с count 0 — рецепт списан с Create-совместимости под Thermal
    // (thermal:sulfur), а датаген автора подставил вместо отсутствующего мода воздух.
    // Almost Unified такой рецепт переписывал, игра его не грузила (#8).
    // Повторяем раскладку Create для серной руды, но с серой Mekanism —
    // она победитель юнификации #c:dusts/sulfur (IE скрыт).
    // event.custom с JSON как у самого Create: аддона KubeJS Create в сборке нет,
    // а Item.of(...).withChance() в 1.21 больше не работает.
    event.remove({ id: 'aether_overworld_ores:crushing/holystone_sulfur_ore_crushing' })
    event.custom({
        type: 'create:crushing',
        ingredients: [{ item: 'aether_overworld_ores:holystone_sulfur_ore' }],
        processing_time: 350,
        results: [
            { id: 'mekanism:dust_sulfur', count: 2 },
            { id: 'mekanism:dust_sulfur', chance: 0.25 },
            { id: 'create:experience_nugget', chance: 0.75 },
            { id: 'aether:holystone', chance: 0.12 }
        ]
    }).id('codex:crushing/holystone_sulfur_ore')
})
