const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pvp_rewards')
    .setDescription('Claim your PvP rewards'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const rewardAmount = user.tournament.totalPoints * 2;
      await EconomyManager.addMoney(userId, rewardAmount);

      const embed = new EmbedBuilder()
        .setColor('#ffd700')
        .setTitle('🏆 PvP Rewards Claimed!')
        .addFields(
          { name: 'Reward', value: `💰 ${rewardAmount}` },
          { name: 'Total Earned', value: `${user.tournament.totalPoints * 2}` }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error claiming rewards', ephemeral: true });
    }
  }
};
