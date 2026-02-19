const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  wallet: { type: Number, default: 1000 },
  bank: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  items: [{
    itemId: String,
    name: String,
    quantity: Number,
    rarity: { type: String, enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
    acquiredAt: { type: Date, default: Date.now }
  }],
  fishingStats: {
    totalCaught: { type: Number, default: 0 },
    totalFished: { type: Number, default: 0 },
    streak: { type: Number, default: 0 }
  },
  farmingStats: {
    crops: [{
      cropType: String,
      quantity: Number,
      plantedAt: Date,
      readyAt: Date
    }],
    level: { type: Number, default: 1 }
  },
  hunted: { type: Number, default: 0 },
  workStreak: { type: Number, default: 0 },
  lastWork: Date,
  lastFish: Date,
  lastHunt: Date,
  lastMine: Date,
  lastForage: Date,
  lastCook: Date,
  lastAdventure: Date,
  rob: {
    successCount: { type: Number, default: 0 },
    failureCount: { type: Number, default: 0 },
    lastRobbed: Date
  },
  pet: {
    type: String,
    hunger: Number,
    happiness: Number
  },
  guild: {
    name: String,
    leader: String,
    members: [String],
    createdAt: Date
  },
  achievements: [String],
  dailyStreak: { type: Number, default: 0 },
  lastDailyReward: Date,
  house: {
    tier: { type: Number, default: 0 },
    value: { type: Number, default: 0 },
    decorations: [String],
    locked: { type: Boolean, default: false }
  },
  quests: {
    activeQuests: [{
      questId: String,
      name: String,
      description: String,
      progress: Number,
      target: Number,
      reward: Number,
      startedAt: Date
    }],
    completedQuests: [String],
    totalCompleted: { type: Number, default: 0 }
  },
  skills: {
    skillLevels: {
      combat: { type: Number, default: 1 },
      magic: { type: Number, default: 1 },
      crafting: { type: Number, default: 1 },
      farming: { type: Number, default: 1 },
      fishing: { type: Number, default: 1 }
    },
    talents: [String],
    prestigeLevel: { type: Number, default: 0 },
    lastPrestige: Date
  },
  dungeon: {
    currentFloor: { type: Number, default: 0 },
    highestFloor: { type: Number, default: 0 },
    raidBossDefeats: { type: Number, default: 0 },
    lastRaidAttempt: Date
  },
  tournament: {
    rank: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 }
  },
  crafting: {
    recipes: [String],
    craftXP: { type: Number, default: 0 },
    level: { type: Number, default: 1 }
  },
  stocks: {
    owned: [{
      stockId: String,
      quantity: Number,
      purchasePrice: Number
    }],
    investments: [{
      investmentId: String,
      amount: Number,
      returnRate: Number,
      startDate: Date
    }],
    portfolio: { type: Number, default: 0 }
  },
  clanWars: {
    warsWon: { type: Number, default: 0 },
    warsLost: { type: Number, default: 0 },
    treasuryShare: { type: Number, default: 0 }
  },
  loot: {
    lootboxesOpened: { type: Number, default: 0 },
    treasuresFound: { type: Number, default: 0 },
    lastTreasureHunt: Date
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
