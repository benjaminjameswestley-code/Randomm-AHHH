const User = require('../models/User');

class EconomyManager {
  static async getOrCreateUser(userId, username) {
    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({
        userId,
        username,
        wallet: 1000,
        bank: 0
      });
      await user.save();
    }
    return user;
  }

  static async addMoney(userId, amount, type = 'wallet') {
    const user = await User.findOne({ userId });
    if (!user) throw new Error('User not found');

    if (type === 'wallet') {
      user.wallet += amount;
    } else if (type === 'bank') {
      user.bank += amount;
    }

    user.updatedAt = new Date();
    await user.save();
    return user;
  }

  static async removeMoney(userId, amount, type = 'wallet') {
    const user = await User.findOne({ userId });
    if (!user) throw new Error('User not found');

    if (type === 'wallet') {
      if (user.wallet < amount) throw new Error('Insufficient wallet balance');
      user.wallet -= amount;
    } else if (type === 'bank') {
      if (user.bank < amount) throw new Error('Insufficient bank balance');
      user.bank -= amount;
    }

    user.updatedAt = new Date();
    await user.save();
    return user;
  }

  static async deposit(userId, amount) {
    const user = await User.findOne({ userId });
    if (!user) throw new Error('User not found');
    if (user.wallet < amount) throw new Error('Insufficient wallet balance');

    user.wallet -= amount;
    user.bank += amount;
    user.updatedAt = new Date();
    await user.save();
    return user;
  }

  static async withdraw(userId, amount) {
    const user = await User.findOne({ userId });
    if (!user) throw new Error('User not found');
    if (user.bank < amount) throw new Error('Insufficient bank balance');

    user.bank -= amount;
    user.wallet += amount;
    user.updatedAt = new Date();
    await user.save();
    return user;
  }

  static async getGlobalLeaderboard(type = 'networth', limit = 10) {
    const leaderboard = await User.aggregate([
      {
        $addFields: {
          networth: { $add: ['$wallet', '$bank'] }
        }
      },
      {
        $sort: type === 'networth' 
          ? { networth: -1 } 
          : { [type]: -1 }
      },
      { $limit: limit }
    ]);
    return leaderboard;
  }

  static async addItem(userId, itemId, itemName, quantity = 1, rarity = 'common') {
    const user = await User.findOne({ userId });
    if (!user) throw new Error('User not found');

    const existingItem = user.items.find(item => item.itemId === itemId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.items.push({
        itemId,
        name: itemName,
        quantity,
        rarity
      });
    }

    user.updatedAt = new Date();
    await user.save();
    return user;
  }

  static async removeItem(userId, itemId, quantity = 1) {
    const user = await User.findOne({ userId });
    if (!user) throw new Error('User not found');

    const item = user.items.find(item => item.itemId === itemId);
    if (!item || item.quantity < quantity) throw new Error('Item not found or insufficient quantity');

    item.quantity -= quantity;
    if (item.quantity === 0) {
      user.items = user.items.filter(item => item.itemId !== itemId);
    }

    user.updatedAt = new Date();
    await user.save();
    return user;
  }

  static formatMoney(amount) {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(2)}K`;
    }
    return amount.toString();
  }
}

module.exports = EconomyManager;
