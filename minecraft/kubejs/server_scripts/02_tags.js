// Теги: правки, которые нельзя сделать конфигом.
ServerEvents.tags('item', event => {
    // Уран Eternal Tales — самоцвет Вулканеха (эра 8), а не слиток эры 5.
    // Сам мод кладёт его и в #c:ingots/uranium, и в #c:gems/uranium; Almost Unified
    // на этом падает, а юнификация с Mekanism/IE открыла бы Вулканех на три эры раньше.
    event.remove('c:ingots/uranium', 'eternal_tales:uranium')
})
