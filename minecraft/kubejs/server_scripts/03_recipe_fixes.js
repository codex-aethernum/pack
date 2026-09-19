// Рецепты, сломанные в самих модах. Не баланс — починка.
ServerEvents.recipes(event => {

    // aether_overworld_ores: дробление святокаменной серной руды выдавало
    // minecraft:air с count 0 — рецепт списан с Create-совместимости под Thermal
    // (thermal:sulfur), а датаген автора подставил вместо отсутствующего мода воздух.
    // Almost Unified такой рецепт переписывал, игра его не грузила (#8).
    // Повторяем оригинальную раскладку Create для серной руды, но с серой Mekanism —
    // она победитель юнификации #c:dusts/sulfur (IE скрыт).
    event.remove({ id: 'aether_overworld_ores:crushing/holystone_sulfur_ore_crushing' })
    event.recipes.create.crushing([
        Item.of('mekanism:dust_sulfur', 2),
        Item.of('mekanism:dust_sulfur').withChance(0.25),
        Item.of('create:experience_nugget').withChance(0.75),
        Item.of('aether:holystone').withChance(0.12)
    ], 'aether_overworld_ores:holystone_sulfur_ore')
        .processingTime(350)
        .id('codex:crushing/holystone_sulfur_ore')
})
