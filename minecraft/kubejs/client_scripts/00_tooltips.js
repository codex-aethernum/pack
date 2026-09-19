// Подсказки: объясняют игроку изменённую прогрессию прямо в интерфейсе.
// В KubeJS 2101 событие называется modifyTooltips (не tooltip — такого нет).

ItemEvents.modifyTooltips(event => {
    // event.add('mekanism:steel_casing', Text.gray('Требует собственную линию стали'))
})

// dynamicTooltips — если подсказка должна зависеть от состояния предмета
// ItemEvents.dynamicTooltips(event => { ... })
