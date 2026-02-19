const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loot_chest')
    .setDescription('Open a loot chest from dungeon exploration'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      if (user.dungeon.currentFloor === 0) {
        return interaction.reply({ content: 'You must explore a dungeon first!', ephemeral: true });
      }

      const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
      const rng = Math.random();
      let rarity = 'common';
      if (rng > 0.8) rarity = 'legendary';
      else if (rng > 0.6) rarity = 'epic';
      else if (rng > 0.4) rarity = 'rare';
      else if (rng > 0.2) rarity = 'uncommon';

      const rewards = { common: 200, uncommon: 500, rare: 1200, epic: 2500, legendary: 5000 };
      const reward = rewards[rarity];

      await EconomyManager.addMoney(userId, reward);
      user.loot.lootboxesOpened += 1;

      const embed = new EmbedBuilder()
        .setColor(['#808080', '#00ff00', '#0000ff', '#ff00ff', '#ffff00'][rarities.indexOf(rarity)])
        .setTitle('📦 Loot Chest Opened!')
        .setDescription(`You found a **${rarity.toUpperCase()}** chest!`)
        .addFields(
          { name: 'Reward', value: `💰 ${reward} coins` },
          { name: 'Chests Opened', value: `${user.loot.lootboxesOpened}` }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error opening loot chest', ephemeral: true });
    }
  }
};
