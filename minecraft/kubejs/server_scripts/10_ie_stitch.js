// ============================================================================
//  Сшивка: Immersive Engineering <-> остальная сборка
//  Замена мода engineeredcompatibility (он отключён, см. BRIDGES.md).
//
//  Оригинал вкидывал 1008 готовых JSON-рецептов, из которых в нашей сборке
//  оживало 312. Здесь то же самое, но правилами: шаблонное
//  (пилорама/дробилка/дуговая печь/бетон) генерируется циклами, а данные вынесены
//  в таблицы наверху файла. Меняешь число в TUNING — меняется вся категория.
//
//  /kubejs reload server_scripts — применить без перезапуска.
// ============================================================================

// ------------------------------- НАСТРОЙКА ---------------------------------
const TUNING = {
  sawmillEnergy:    1600,   // пилорама: энергия за распил
  sawdustPerLog:      16,   // дробилка: опилок из бревна
  crusherEnergy:    2400,   // дробилка: руда/слиток -> пыль
  arcEnergy:       51200,   // дуговая печь: базовая энергия
  arcTime:           100,   // дуговая печь: базовое время
  oreToIngot:          2,   // дуга: множитель руда -> слиток
  rawBlockToIngot:    13,   // дуга: блок сырья -> слитки
}

// Материалы, для которых генерируется цепочка дуговой печи.
// Строка попадает в рецепты только если соответствующие теги реально есть.
const ORE_CHAINS = [
  'veridium', 'shadoline', 'nagrilite', 'tenebrum', 'iesnium',
  'cloggrum', 'froststeel', 'hellcd',
]

// Материалы для дробилки: слиток/самоцвет -> пыль.
const CRUSH_MATERIALS = [
  'iron', 'gold', 'copper', 'tin', 'lead', 'silver', 'nickel', 'uranium',
  'osmium', 'zinc', 'aluminum', 'steel', 'bronze', 'brass', 'constantan',
  'electrum', 'invar', 'certus_quartz', 'fluix', 'iesnium', 'cloggrum',
  'froststeel', 'veridium', 'shadoline', 'nagrilite', 'tenebrum',
]

const CLOCHE = [
  {
    "seed": "ars_nouveau:magebloom_crop",
    "block": "ars_nouveau:magebloom_crop",
    "rtype": "immersiveengineering:crop",
    "results": [
      [
        "ars_nouveau:magebloom",
        1
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 800
  },
  {
    "seed": "ars_nouveau:magebloom_crop",
    "block": "ars_nouveau:magebloom_crop",
    "rtype": "immersiveengineering:crop",
    "results": [
      [
        "ars_nouveau:magebloom",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 530
  },
  {
    "seed": "ars_nouveau:sourceberry_bush",
    "block": "ars_nouveau:sourceberry_bush",
    "rtype": "immersiveengineering:crop",
    "results": [
      [
        "ars_nouveau:sourceberry_bush",
        2
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 560
  },
  {
    "seed": "ars_nouveau:sourceberry_bush",
    "block": "ars_nouveau:sourceberry_bush",
    "rtype": "immersiveengineering:crop",
    "results": [
      [
        "ars_nouveau:sourceberry_bush",
        2
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 370
  },
  {
    "seed": "botania:black_petal",
    "block": "botania:black_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:black_petal",
        1
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 480
  },
  {
    "seed": "botania:black_petal",
    "block": "botania:black_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:black_petal",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 320
  },
  {
    "seed": "botania:blue_petal",
    "block": "botania:blue_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:blue_petal",
        1
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 480
  },
  {
    "seed": "botania:blue_petal",
    "block": "botania:blue_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:blue_petal",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 320
  },
  {
    "seed": "botania:brown_petal",
    "block": "botania:brown_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:brown_petal",
        1
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 480
  },
  {
    "seed": "botania:brown_petal",
    "block": "botania:brown_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:brown_petal",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 320
  },
  {
    "seed": "botania:cyan_petal",
    "block": "botania:cyan_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:cyan_petal",
        1
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 480
  },
  {
    "seed": "botania:cyan_petal",
    "block": "botania:cyan_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:cyan_petal",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 320
  },
  {
    "seed": "botania:gray_petal",
    "block": "botania:gray_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:gray_petal",
        1
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 480
  },
  {
    "seed": "botania:gray_petal",
    "block": "botania:gray_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:gray_petal",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 320
  },
  {
    "seed": "botania:green_petal",
    "block": "botania:green_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:green_petal",
        1
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 480
  },
  {
    "seed": "botania:green_petal",
    "block": "botania:green_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:green_petal",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 320
  },
  {
    "seed": "botania:light_blue_petal",
    "block": "botania:light_blue_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:light_blue_petal",
        1
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 480
  },
  {
    "seed": "botania:light_blue_petal",
    "block": "botania:light_blue_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:light_blue_petal",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 320
  },
  {
    "seed": "botania:light_gray_petal",
    "block": "botania:light_gray_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:light_gray_petal",
        1
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 480
  },
  {
    "seed": "botania:light_gray_petal",
    "block": "botania:light_gray_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:light_gray_petal",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 320
  },
  {
    "seed": "botania:lime_petal",
    "block": "botania:lime_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:lime_petal",
        1
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 480
  },
  {
    "seed": "botania:lime_petal",
    "block": "botania:lime_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:lime_petal",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 320
  },
  {
    "seed": "botania:magenta_petal",
    "block": "botania:magenta_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:magenta_petal",
        1
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 480
  },
  {
    "seed": "botania:magenta_petal",
    "block": "botania:magenta_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:magenta_petal",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 320
  },
  {
    "seed": "botania:orange_petal",
    "block": "botania:orange_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:orange_petal",
        1
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 480
  },
  {
    "seed": "botania:orange_petal",
    "block": "botania:orange_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:orange_petal",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 320
  },
  {
    "seed": "botania:pink_petal",
    "block": "botania:pink_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:pink_petal",
        1
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 480
  },
  {
    "seed": "botania:pink_petal",
    "block": "botania:pink_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:pink_petal",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 320
  },
  {
    "seed": "botania:purple_petal",
    "block": "botania:purple_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:purple_petal",
        1
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 480
  },
  {
    "seed": "botania:purple_petal",
    "block": "botania:purple_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:purple_petal",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 320
  },
  {
    "seed": "botania:red_petal",
    "block": "botania:red_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:red_petal",
        1
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 480
  },
  {
    "seed": "botania:red_petal",
    "block": "botania:red_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:red_petal",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 320
  },
  {
    "seed": "botania:white_petal",
    "block": "botania:white_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:white_petal",
        1
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 480
  },
  {
    "seed": "botania:white_petal",
    "block": "botania:white_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:white_petal",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 320
  },
  {
    "seed": "botania:yellow_petal",
    "block": "botania:yellow_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:yellow_petal",
        1
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 480
  },
  {
    "seed": "botania:yellow_petal",
    "block": "botania:yellow_mystical_flower",
    "rtype": "immersiveengineering:generic",
    "results": [
      [
        "botania:yellow_petal",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 320
  },
  {
    "seed": "minecraft:bamboo",
    "block": "minecraft:bamboo",
    "rtype": "immersiveengineering:stacking",
    "results": [
      [
        "minecraft:bamboo",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 370
  },
  {
    "seed": "minecraft:beetroot_seeds",
    "block": "minecraft:beetroots",
    "rtype": "immersiveengineering:crop",
    "results": [
      [
        "minecraft:beetroot",
        2
      ],
      [
        "minecraft:beetroot_seeds",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 530
  },
  {
    "seed": "farmersdelight:cabbage_seeds",
    "block": "farmersdelight:cabbages",
    "rtype": "immersiveengineering:crop",
    "results": [
      [
        "farmersdelight:cabbage",
        2
      ],
      [
        "farmersdelight:cabbage_seeds",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 530
  },
  {
    "seed": "minecraft:carrot",
    "block": "minecraft:carrots",
    "rtype": "immersiveengineering:crop",
    "results": [
      [
        "minecraft:carrot",
        2
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 530
  },
  {
    "seed": "immersiveengineering:seed",
    "block": "immersiveengineering:hemp",
    "rtype": "immersiveengineering:doublecrop",
    "results": [
      [
        "immersiveengineering:hemp_fiber",
        1
      ],
      [
        "immersiveengineering:seed",
        2
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 530
  },
  {
    "seed": "minecraft:melon_seeds",
    "block": null,
    "rtype": "immersiveengineering:stem",
    "results": [
      [
        "minecraft:melon",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 530
  },
  {
    "seed": "farmersdelight:onion",
    "block": "farmersdelight:onions",
    "rtype": "immersiveengineering:crop",
    "results": [
      [
        "farmersdelight:onion",
        2
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 530
  },
  {
    "seed": "minecraft:potato",
    "block": "minecraft:potatoes",
    "rtype": "immersiveengineering:crop",
    "results": [
      [
        "minecraft:potato",
        2
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 530
  },
  {
    "seed": "minecraft:pumpkin_seeds",
    "block": null,
    "rtype": "immersiveengineering:stem",
    "results": [
      [
        "minecraft:pumpkin",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 530
  },
  {
    "seed": "farmersdelight:rice",
    "block": "farmersdelight:rice_panicles",
    "rtype": "immersiveengineering:crop",
    "results": [
      [
        "farmersdelight:rice_panicle",
        2
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 530
  },
  {
    "seed": "minecraft:sweet_berries",
    "block": "minecraft:sweet_berry_bush",
    "rtype": "immersiveengineering:crop",
    "results": [
      [
        "minecraft:sweet_berries",
        2
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 370
  },
  {
    "seed": "farmersdelight:tomato_seeds",
    "block": "farmersdelight:tomatoes",
    "rtype": "immersiveengineering:crop",
    "results": [
      [
        "farmersdelight:tomato",
        2
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 530
  },
  {
    "seed": "minecraft:wheat_seeds",
    "block": "minecraft:wheat",
    "rtype": "immersiveengineering:crop",
    "results": [
      [
        "minecraft:wheat",
        2
      ],
      [
        "minecraft:wheat_seeds",
        1
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 425
  },
  {
    "seed": "occultism:datura_seeds",
    "block": "occultism:datura",
    "rtype": "immersiveengineering:crop",
    "results": [
      [
        "occultism:datura",
        1
      ],
      [
        "occultism:datura_seeds",
        2
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 800
  },
  {
    "seed": "occultism:datura_seeds",
    "block": "occultism:datura",
    "rtype": "immersiveengineering:crop",
    "results": [
      [
        "occultism:datura",
        1
      ],
      [
        "occultism:datura_seeds",
        2
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 530
  },
  {
    "seed": "supplementaries:flax_seeds",
    "block": "supplementaries:flax",
    "rtype": "immersiveengineering:doublecrop",
    "results": [
      [
        "supplementaries:flax",
        1
      ],
      [
        "supplementaries:flax_seeds",
        2
      ]
    ],
    "soil": "minecraft:dirt",
    "time": 800
  },
  {
    "seed": "supplementaries:flax_seeds",
    "block": "supplementaries:flax",
    "rtype": "immersiveengineering:doublecrop",
    "results": [
      [
        "supplementaries:flax",
        1
      ],
      [
        "supplementaries:flax_seeds",
        2
      ]
    ],
    "soil": "farmersdelight:rich_soil",
    "time": 530
  }
]

const SQUEEZER = [
  {
    "input": "c:seeds/asparagus",
    "fluid": "immersiveengineering:plantoil",
    "amount": 60,
    "item": null,
    "count": null,
    "energy": 6400
  },
  {
    "input": "c:seeds/belladonna",
    "fluid": "immersiveengineering:plantoil",
    "amount": 30,
    "item": null,
    "count": null,
    "energy": 6400
  },
  {
    "input": "c:seeds/chili_pepper",
    "fluid": "immersiveengineering:plantoil",
    "amount": 50,
    "item": null,
    "count": null,
    "energy": 6400
  },
  {
    "input": "c:seeds/corn",
    "fluid": "immersiveengineering:plantoil",
    "amount": 60,
    "item": null,
    "count": null,
    "energy": 6400
  },
  {
    "input": "c:seeds/cucumber",
    "fluid": "immersiveengineering:plantoil",
    "amount": 80,
    "item": null,
    "count": null,
    "energy": 6400
  },
  {
    "input": "c:seeds/eggplant",
    "fluid": "immersiveengineering:plantoil",
    "amount": 80,
    "item": null,
    "count": null,
    "energy": 6400
  },
  {
    "input": "c:seeds/flax",
    "fluid": "immersiveengineering:plantoil",
    "amount": 100,
    "item": null,
    "count": null,
    "energy": 6400
  },
  {
    "input": "c:seeds/mandrake",
    "fluid": "immersiveengineering:plantoil",
    "amount": 80,
    "item": null,
    "count": null,
    "energy": 6400
  },
  {
    "input": "c:crops/peanut",
    "fluid": "immersiveengineering:plantoil",
    "amount": 100,
    "item": null,
    "count": null,
    "energy": 6400
  },
  {
    "input": "c:seeds/rabbage",
    "fluid": "immersiveengineering:plantoil",
    "amount": 80,
    "item": null,
    "count": null,
    "energy": 6400
  },
  {
    "input": "c:seeds/sage",
    "fluid": "immersiveengineering:plantoil",
    "amount": 20,
    "item": null,
    "count": null,
    "energy": 6400
  },
  {
    "input": "c:seeds/snowbell",
    "fluid": "immersiveengineering:plantoil",
    "amount": 40,
    "item": null,
    "count": null,
    "energy": 6400
  },
  {
    "input": "c:seeds/sunfire_tomato",
    "fluid": "immersiveengineering:plantoil",
    "amount": 60,
    "item": null,
    "count": null,
    "energy": 6400
  },
  {
    "input": "c:seeds/tea",
    "fluid": "immersiveengineering:plantoil",
    "amount": 80,
    "item": null,
    "count": null,
    "energy": 6400
  },
  {
    "input": "c:nuts/walnut",
    "fluid": "immersiveengineering:plantoil",
    "amount": 100,
    "item": null,
    "count": null,
    "energy": 6400
  },
  {
    "input": "c:seeds/water_artichoke",
    "fluid": "immersiveengineering:plantoil",
    "amount": 60,
    "item": null,
    "count": null,
    "energy": 6400
  },
  {
    "input": "c:seeds/wolfsbane",
    "fluid": "immersiveengineering:plantoil",
    "amount": 80,
    "item": null,
    "count": null,
    "energy": 6400
  }
]

const FERMENTER = [
  {
    "input": "aether:blue_berry",
    "fluid": "immersiveengineering:ethanol",
    "amount": 60,
    "energy": 6400
  },
  {
    "input": "c:crops/corn",
    "fluid": "immersiveengineering:ethanol",
    "amount": 100,
    "energy": 6400
  },
  {
    "input": "aether:enchanted_berry",
    "fluid": "immersiveengineering:ethanol",
    "amount": 90,
    "energy": 6400
  },
  {
    "input": "c:fruits/fig",
    "fluid": "immersiveengineering:ethanol",
    "amount": 80,
    "energy": 6400
  },
  {
    "input": "deep_aether:goldenleaf_berries",
    "fluid": "immersiveengineering:ethanol",
    "amount": 80,
    "energy": 6400
  },
  {
    "input": "c:fruits/salmonberries",
    "fluid": "immersiveengineering:ethanol",
    "amount": 50,
    "energy": 6400
  },
  {
    "input": "c:crops/sweet_potato",
    "fluid": "immersiveengineering:ethanol",
    "amount": 100,
    "energy": 6400
  },
  {
    "input": "c:vinegar_ingredients",
    "fluid": "immersiveengineering:ethanol",
    "amount": 80,
    "energy": 6400
  }
]

// ---------------------------------------------------------------------------

ServerEvents.recipes(event => {
  const IE = 'immersiveengineering'
  let made = 0, skipped = 0

  // Тег существует и непустой?
  const hasTag = (tag) => {
    try { return !Ingredient.of(tag).isEmpty() } catch (e) { return false }
  }
  // Безопасная выдача: один битый рецепт не должен ронять весь скрипт
  const add = (json) => {
    try { event.custom(json); made++ } catch (e) { skipped++ }
  }

  // === 1. ПИЛОРАМА: любое бревно -> доски своего дерева + опилки ============
  // Правило вместо 106 рецептов: бревно -> доски того же мода.
  const LOG_SUFFIXES = ['_log', '_stem', '_wood', '_hyphae']
  Ingredient.of('#minecraft:logs').itemIds.forEach(logId => {
    const [ns, path] = logId.split(':')
    const suffix = LOG_SUFFIXES.find(s => path.endsWith(s))
    if (!suffix) return
    let base = path.slice(0, -suffix.length)
    if (base.startsWith('stripped_')) return           // обработанные пропускаем
    const planks = `${ns}:${base}_planks`
    if (!Item.exists(planks)) return
    add({
      type: `${IE}:sawmill`,
      energy: TUNING.sawmillEnergy,
      input: { item: logId },
      result: { basePredicate: { item: planks }, count: 6 },
      secondaryOutputs: [{ tag: 'c:dusts/wood' }],
      strippingSecondaries: [],
    })
  })

  // Бревно -> опилки в дробилке (одним рецептом по тегу, как в оригинале)
  add({
    type: `${IE}:crusher`,
    energy: TUNING.sawmillEnergy,
    input: { tag: 'minecraft:logs' },
    result: { basePredicate: { tag: 'c:dusts/wood' }, count: TUNING.sawdustPerLog },
    secondaries: [],
  })

  // === 2. ДРОБИЛКА: слиток/самоцвет -> пыль =================================
  CRUSH_MATERIALS.forEach(m => {
    const dust = `c:dusts/${m}`
    if (!hasTag(`#${dust}`)) return
    ;[`c:ingots/${m}`, `c:gems/${m}`].forEach(src => {
      if (!hasTag(`#${src}`)) return
      add({
        type: `${IE}:crusher`,
        energy: TUNING.crusherEnergy,
        input: { tag: src },
        result: { basePredicate: { tag: dust }, count: 1 },
        secondaries: [],
      })
    })
  })

  // === 3. ДУГОВАЯ ПЕЧЬ: полная цепочка переработки материала ================
  // Правило вместо 41 рецепта: руда/сырьё/блок сырья/пыль -> слиток.
  ORE_CHAINS.forEach(m => {
    const ingot = `c:ingots/${m}`
    if (!hasTag(`#${ingot}`)) return
    const chain = [
      [`c:ores/${m}`,                 TUNING.oreToIngot],
      [`c:raw_materials/${m}`,        1],
      [`c:storage_blocks/raw_${m}`,   TUNING.rawBlockToIngot],
      [`c:dusts/${m}`,                1],
    ]
    chain.forEach(([src, count]) => {
      if (!hasTag(`#${src}`)) return
      add({
        type: `${IE}:arc_furnace`,
        energy: TUNING.arcEnergy,
        time: TUNING.arcTime,
        input: { tag: src },
        results: [{ basePredicate: { tag: ingot }, count: count }],
        slag: { tag: 'c:slag' },
      })
    })
  })

  // === 4. ТЕПЛИЦА ==========================================================
  CLOCHE.forEach(c => {
    if (!Item.exists(c.seed) && !hasTag(`#${c.seed}`)) return
    add({
      type: `${IE}:cloche`,
      input: { item: c.seed },
      render: { type: c.rtype, block: c.block },
      results: c.results.map(([id, n]) => ({ id: id, count: n })),
      soil: { item: c.soil },
      time: c.time,
    })
  })

  // === 5. ПРЕСС И ФЕРМЕНТЁР ================================================
  SQUEEZER.forEach(s => {
    const isTag = !s.input.includes(':') || s.input.startsWith('c:')
    if (isTag ? !hasTag(`#${s.input}`) : !Item.exists(s.input)) return
    const r = { type: `${IE}:squeezer`, energy: s.energy,
               input: isTag ? { tag: s.input } : { item: s.input } }
    if (s.fluid) r.fluid = { id: s.fluid, amount: s.amount }
    if (s.item) r.result = { basePredicate: { item: s.item }, count: s.count }
    add(r)
  })

  FERMENTER.forEach(f => {
    const isTag = f.input.startsWith('c:')
    if (isTag ? !hasTag(`#${f.input}`) : !Item.exists(f.input)) return
    add({
      type: `${IE}:fermenter`, energy: f.energy,
      fluid: { id: f.fluid, amount: f.amount },
      input: isTag ? { tag: f.input } : { item: f.input },
    })
  })

  // === 6. ВАНИЛЬНЫЕ РЕЦЕПТЫ ПО ТЕГАМ =======================================
  // Оригинал держал 16 почти одинаковых файлов на бетон — здесь один цикл.
  const DYES = ['white', 'orange', 'magenta', 'light_blue', 'yellow', 'lime',
                'pink', 'gray', 'light_gray', 'cyan', 'purple', 'blue',
                'brown', 'green', 'red', 'black']
  DYES.forEach(c => {
    event.remove({ id: `minecraft:${c}_concrete_powder` })
    add({
      type: 'minecraft:crafting_shapeless',
      category: 'building', group: 'concrete_powder',
      ingredients: [{ item: `minecraft:${c}_dye` }]
        .concat([1, 2, 3, 4].map(() => ({ tag: 'c:sands' })))
        .concat([1, 2, 3, 4].map(() => ({ tag: 'c:gravels' }))),
      result: { id: `minecraft:${c}_concrete_powder`, count: 8 },
    })
  })

  // === 7. ТОЧЕЧНЫЕ РЕЦЕПТЫ (перенесены как есть) ===========================
  add({
  "type": "immersiveengineering:mixer",
  "energy": 1600,
  "fluid": {
    "amount": 250,
    "tag": "c:milk"
  },
  "inputs": [
    {
      "basePredicate": {
        "tag": "c:sugars"
      },
      "count": 1
    },
    {
      "basePredicate": {
        "tag": "c:crops/cocoa_bean"
      },
      "count": 1
    }
  ],
  "result": {
    "amount": 250,
    "id": "create:chocolate"
  }
})  // chocolate.json

  add({
  "type": "immersiveengineering:mixer",
  "energy": 9600,
  "fluid": {
    "amount": 1000,
    "tag": "pneumaticcraft:plastic"
  },
  "inputs": [
    {
      "basePredicate": {
        "tag": "c:gunpowders"
      },
      "count": 2
    },
    {
      "basePredicate": {
        "item": "minecraft:rotten_flesh"
      },
      "count": 2
    },
    {
      "basePredicate": {
        "item": "minecraft:spider_eye"
      },
      "count": 2
    }
  ],
  "result": {
    "amount": 1000,
    "id": "pneumaticcraft:etching_acid"
  }
})  // etching_acid_pnc.json

  add({
  "type": "immersiveengineering:mixer",
  "energy": 9600,
  "fluid": {
    "amount": 1000,
    "tag": "c:phenolic_resin"
  },
  "inputs": [
    {
      "basePredicate": {
        "tag": "c:gunpowders"
      },
      "count": 2
    },
    {
      "basePredicate": {
        "item": "minecraft:nether_wart"
      },
      "count": 4
    },
    {
      "basePredicate": {
        "tag": "c:slag"
      },
      "count": 4
    }
  ],
  "result": {
    "amount": 1000,
    "id": "pneumaticcraft:etching_acid"
  }
})  // etching_acid_renewable.json

  add({
  "type": "immersiveengineering:blueprint",
  "category": "pcb",
  "inputs": [
    {
      "basePredicate": {
        "tag": "c:plates/plastic"
      },
      "count": 2
    },
    {
      "basePredicate": {
        "tag": "c:plates/aluminum"
      },
      "count": 2
    },
    {
      "tag": "c:dusts/redstone"
    },
    {
      "tag": "immersiveengineering:circuits/solder"
    }
  ],
  "result": {
    "Count": 4,
    "id": "pneumaticcraft:capacitor"
  }
})  // capacitor.json

  add({
  "type": "immersiveengineering:blueprint",
  "category": "components",
  "inputs": [
    {
      "basePredicate": {
        "item": "pneumaticcraft:plastic"
      },
      "count": 3
    },
    {
      "basePredicate": {
        "tag": "c:plates/copper"
      },
      "count": 2
    }
  ],
  "result": {
    "Count": 2,
    "id": "immersiveengineering:circuit_board"
  }
})  // circuit_backplane.json

  add({
  "type": "immersiveengineering:blueprint",
  "category": "pcb",
  "inputs": [
    {
      "tag": "c:plates/plastic"
    },
    {
      "tag": "c:plates/copper"
    },
    {
      "basePredicate": {
        "tag": "c:nuggets/silver"
      },
      "count": 4
    },
    {
      "basePredicate": {
        "tag": "c:dusts/redstone"
      },
      "count": 4
    }
  ],
  "result": {
    "Count": 4,
    "id": "pneumaticcraft:empty_pcb"
  }
})  // empty_pcb.json

  add({
  "type": "immersiveengineering:blueprint",
  "category": "pcb",
  "inputs": [
    {
      "basePredicate": {
        "item": "pneumaticcraft:unassembled_pcb"
      },
      "count": 1
    },
    {
      "basePredicate": {
        "item": "immersiveengineering:electron_tube"
      },
      "count": 3
    },
    {
      "basePredicate": {
        "item": "pneumaticcraft:capacitor"
      },
      "count": 2
    }
  ],
  "result": {
    "Count": 1,
    "id": "pneumaticcraft:printed_circuit_board"
  }
})  // pcb.json

  add({
  "type": "immersiveengineering:metal_press",
  "energy": 2400,
  "input": {
    "basePredicate": {
      "tag": "c:ingots/compressed_iron"
    },
    "count": 4
  },
  "mold": "immersiveengineering:mold_plate",
  "result": {
    "tag": "c:gears/compressed_iron"
  }
})  // gear_compressed_iron.json

  add({
  "type": "create:crushing",
  "ingredients": [
    {
      "tag": "c:slag"
    }
  ],
  "results": [
    {
      "id": "immersiveengineering:slag_gravel",
      "count": 1,
      "chance": 1
    }
  ],
  "processingTime": 300
})  // slag_gravel.json

  add({
  "type": "immersiveengineering:generator_fuel",
  "burnTime": 322,
  "fluidTag": "c:diesel"
})  // diesel.json

  add({
  "type": "immersiveengineering:generator_fuel",
  "burnTime": 208,
  "fluidTag": "c:kerosene"
})  // kerosene.json

  add({
  "type": "immersiveengineering:mineral_mix",
  "biome_predicates": [
    [
      "minecraft:is_overworld"
    ],
    [
      "minecraft:is_mountain"
    ]
  ],
  "fail_chance": 0.05,
  "ores": [
    {
      "chance": 0.4,
      "output": {
        "tag": "c:ores/zinc"
      }
    },
    {
      "chance": 0.3,
      "output": {
        "tag": "c:dusts/sulfur"
      }
    },
    {
      "chance": 0.1,
      "output": {
        "tag": "c:fluxes/calcite"
      }
    }
  ],
  "spoils": [
    {
      "chance": 0.2,
      "output": {
        "item": "minecraft:gravel"
      }
    },
    {
      "chance": 0.5,
      "output": {
        "item": "minecraft:cobblestone"
      }
    },
    {
      "chance": 0.3,
      "output": {
        "item": "minecraft:cobbled_deepslate"
      }
    }
  ],
  "weight": 20
})  // sphalerite.json

  add({
  "type": "pneumaticcraft:fuel_quality",
  "air_per_bucket": 1250000,
  "burn_rate": 1.0,
  "fluid": {
    "tag": "c:high_power_biodiesel"
  }
})  // high_cetane_biodiesel.json

  add({
  "type": "minecraft:crafting_shaped",
  "category": "misc",
  "key": {
    "T": {
      "tag": "c:fabric_hemp"
    },
    "G": {
      "item": "pneumaticcraft:glycerol"
    }
  },
  "pattern": [
    " G ",
    "GTG",
    " G "
  ],
  "result": {
    "id": "pneumaticcraft:bandage",
    "count": 1
  }
})  // bandage_tough_fabric.json

  add({
  "type": "minecraft:crafting_shaped",
  "category": "misc",
  "key": {
    "d": {
      "tag": "c:dyes/blue"
    },
    "k": {
      "tag": "c:plates/plastic"
    },
    "l": {
      "tag": "c:ingots/compressed_iron"
    },
    "p": {
      "tag": "c:paper"
    }
  },
  "pattern": [
    "lkl",
    "ddd",
    "ppp"
  ],
  "result": {
    "id": "immersiveengineering:blueprint",
    "nbt": "{blueprint:\"pcb\"}"
  },
  "show_notification": false
})  // pcb_blueprint.json

  add({
  "type": "minecraft:crafting_shaped",
  "category": "misc",
  "key": {
    "#": {
      "tag": "c:gravels"
    },
    "X": {
      "item": "minecraft:dirt"
    }
  },
  "pattern": [
    "X#",
    "#X"
  ],
  "result": {
    "id": "minecraft:coarse_dirt",
    "count": 4
  },
  "show_notification": true
})  // coarse_dirt.json

  add({
  "type": "minecraft:crafting_shaped",
  "category": "misc",
  "key": {
    "#": {
      "tag": "c:rods/wooden"
    },
    "X": {
      "tag": "c:leathers"
    }
  },
  "pattern": [
    "###",
    "#X#",
    "###"
  ],
  "result": {
    "id": "minecraft:item_frame"
  },
  "show_notification": true
})  // item_frame.json

  add({
  "type": "minecraft:crafting_shaped",
  "category": "equipment",
  "key": {
    "X": {
      "tag": "c:leathers"
    }
  },
  "pattern": [
    "X X",
    "X X"
  ],
  "result": {
    "id": "minecraft:leather_boots"
  },
  "show_notification": true
})  // leather_boots.json

  add({
  "type": "minecraft:crafting_shaped",
  "category": "equipment",
  "key": {
    "X": {
      "tag": "c:leathers"
    }
  },
  "pattern": [
    "X X",
    "XXX",
    "XXX"
  ],
  "result": {
    "id": "minecraft:leather_chestplate"
  },
  "show_notification": true
})  // leather_chestplate.json

  add({
  "type": "minecraft:crafting_shaped",
  "category": "equipment",
  "key": {
    "X": {
      "tag": "c:leathers"
    }
  },
  "pattern": [
    "XXX",
    "X X"
  ],
  "result": {
    "id": "minecraft:leather_helmet"
  },
  "show_notification": true
})  // leather_helmet.json

  add({
  "type": "minecraft:crafting_shaped",
  "category": "misc",
  "key": {
    "X": {
      "tag": "c:leathers"
    }
  },
  "pattern": [
    "X X",
    "XXX",
    "X X"
  ],
  "result": {
    "id": "minecraft:leather_horse_armor"
  },
  "show_notification": true
})  // leather_horse_armor.json

  add({
  "type": "minecraft:crafting_shaped",
  "category": "equipment",
  "key": {
    "X": {
      "tag": "c:leathers"
    }
  },
  "pattern": [
    "XXX",
    "X X",
    "X X"
  ],
  "result": {
    "id": "minecraft:leather_leggings"
  },
  "show_notification": true
})  // leather_leggings.json

  add({
  "type": "minecraft:crafting_shapeless",
  "category": "misc",
  "ingredients": [
    {
      "item": "minecraft:paper"
    },
    {
      "item": "minecraft:paper"
    },
    {
      "item": "minecraft:paper"
    },
    {
      "tag": "c:leathers"
    }
  ],
  "result": {
    "id": "minecraft:book"
  }
})  // book.json

  console.info(`[сшивка IE] выдано рецептов: ${made}, пропущено: ${skipped}`)
})
