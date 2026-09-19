// Регистрация собственных предметов/блоков сборки.
// Всё, что ты добавишь здесь, доступно в server_scripts как 'kubejs:<id>'.

StartupEvents.registry('item', event => {
    // event.create('tier1_core').displayName('Ядро I ступени').tooltip('Основа прогрессии сборки')
})

StartupEvents.registry('block', event => {
    // event.create('research_table').material('wood').hardness(2.0)
})
