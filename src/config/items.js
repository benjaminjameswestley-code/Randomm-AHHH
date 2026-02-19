// Item definitions for the economy system
const ITEMS = {
  COMMON: [
    { id: 'wood', name: 'Wood', value: 50, rarity: 'common' },
    { id: 'stone', name: 'Stone', value: 75, rarity: 'common' },
    { id: 'copper', name: 'Copper Ore', value: 100, rarity: 'common' }
  ],
  UNCOMMON: [
    { id: 'iron', name: 'Iron Ore', value: 200, rarity: 'uncommon' },
    { id: 'silver', name: 'Silver Ore', value: 250, rarity: 'uncommon' }
  ],
  RARE: [
    { id: 'gold', name: 'Gold Ore', value: 500, rarity: 'rare' },
    { id: 'mithril', name: 'Mithril', value: 750, rarity: 'rare' }
  ],
  EPIC: [
    { id: 'dragonstone', name: 'Dragonstone', value: 2000, rarity: 'epic' },
    { id: 'diamond', name: 'Diamond', value: 2500, rarity: 'epic' }
  ],
  LEGENDARY: [
    { id: 'godstone', name: 'Godstone', value: 10000, rarity: 'legendary' },
    { id: 'immortalcore', name: 'Immortal Core', value: 15000, rarity: 'legendary' }
  ]
};

const RECIPES = {
  // Crafting recipes
  iron_sword: {
    name: 'Iron Sword',
    ingredients: { iron: 5, wood: 3 },
    output: 1,
    craftTime: 5000, // 5 seconds
    exp: 50
  },
  golden_pickaxe: {
    name: 'Golden Pickaxe',
    ingredients: { gold: 3, iron: 2 },
    output: 1,
    craftTime: 10000,
    exp: 100
  },
  legendary_armor: {
    name: 'Legendary Armor',
    ingredients: { dragonstone: 2, godstone: 1, mithril: 5 },
    output: 1,
    craftTime: 30000,
    exp: 500
  }
};

module.exports = {
  ITEMS,
  RECIPES
};
