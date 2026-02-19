const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mystery_box')
    .setDescription('Open a mystery box with random rewards'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const rewards = ['💰 1000 coins', '💎 Rare Gem', '🎁 Mystery Item', '🐉 Legendary Artifact', '📜 Quest Scroll'];
      const reward = rewards[Math.floor(Math.random() * rewards.length)];

      await EconomyManager.addMoney(userId, 500);

      const embed = new EmbedBuilder()
        .setColor('#ff00ff')
        .setTitle('🎁 Mystery Box!')
        .addFields(
          { name: 'Reward', value: reward },
          { name: 'Bonus', value: '💰 500 coins (always)' }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error with mystery box', ephemeral: true });
    }
  }
};
