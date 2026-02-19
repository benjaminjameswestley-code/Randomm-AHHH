const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dailyreward')
    .setDescription('Claim your daily reward!'),
  async execute(interaction) {
    try {
      const user = await EconomyManager.getOrCreateUser(interaction.user.id, interaction.user.username);

      // Check if user already claimed today
      const lastClaim = user.lastDailyReward || new Date(0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (lastClaim >= today) {
        const nextClaim = new Date(today);
        nextClaim.setDate(nextClaim.getDate() + 1);
        
        return await interaction.reply({
          content: `❌ You already claimed your daily reward! Come back <t:${Math.floor(nextClaim.getTime() / 1000)}:R>`,
          ephemeral: true
        });
      }

      // Award increasing based on streak
      const streak = user.dailyStreak || 0;
      const baseReward = 500;
      const streakBonus = streak * 50;
      const totalReward = baseReward + streakBonus;

      await EconomyManager.addMoney(interaction.user.id, totalReward, 'wallet');

      user.lastDailyReward = new Date();
      user.dailyStreak = streak + 1;
      await user.save();

      const embed = new EmbedBuilder()
        .setColor('#f39c12')
        .setTitle('🎁 Daily Reward!')
        .setDescription(`You claimed your daily reward!`)
        .addFields(
          { name: 'Base Reward', value: `$${baseReward}`, inline: true },
          { name: 'Streak Bonus', value: `$${streakBonus}`, inline: true },
          { name: 'Total', value: `$${totalReward}`, inline: true },
          { name: 'Current Streak', value: `${user.dailyStreak} days 🔥`, inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred.', ephemeral: true });
    }
  }
};
