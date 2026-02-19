const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('View detailed statistics!')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to view')
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      const targetUser = interaction.options.getUser('user') || interaction.user;
      const user = await EconomyManager.getOrCreateUser(targetUser.id, targetUser.username);

      const embed = new EmbedBuilder()
        .setColor('#e74c3c')
        .setTitle(`📊 ${user.username}'s Statistics`)
        .setThumbnail(targetUser.displayAvatarURL())
        .addFields(
          { name: '💰 Economy', value: [
            `Wallet: $${EconomyManager.formatMoney(user.wallet)}`,
            `Bank: $${EconomyManager.formatMoney(user.bank)}`,
            `Net Worth: $${EconomyManager.formatMoney(user.wallet + user.bank)}`,
            `Work Streak: ${user.workStreak}`
          ].join('\n'), inline: true },
          { name: '🎣 Fishing', value: [
            `Total Caught: ${user.fishingStats.totalCaught}`,
            `Total Fished: ${user.fishingStats.totalFished}`,
            `Success Rate: ${user.fishingStats.totalFished > 0 ? Math.round((user.fishingStats.totalCaught / user.fishingStats.totalFished) * 100) : 0}%`,
            `Streak: ${user.fishingStats.streak}`
          ].join('\n'), inline: true },
          { name: '🏹 Hunting', value: [
            `Total Hunted: ${user.hunted}`,
            `Level: ${user.level}`
          ].join('\n'), inline: true },
          { name: '💔 Robberies', value: [
            `Success: ${user.rob.successCount}`,
            `Failed: ${user.rob.failureCount}`,
            `Success Rate: ${user.rob.successCount + user.rob.failureCount > 0 ? Math.round((user.rob.successCount / (user.rob.successCount + user.rob.failureCount)) * 100) : 0}%`
          ].join('\n'), inline: true },
          { name: '📦 Items', value: `Collected: ${user.items.length}`, inline: true },
          { name: '🎯 Progression', value: `Level ${user.level} (${user.experience} XP)`, inline: true }
        )
        .setFooter({ text: `Member since ${user.createdAt.toLocaleDateString()}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred.', ephemeral: true });
    }
  }
};
