const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quest_rewards')
    .setDescription('View your quest rewards summary'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const totalRewards = (user.quests?.completedQuests.length || 0) * 600; // Average reward

      const embed = new EmbedBuilder()
        .setColor('#ffd700')
        .setTitle('👑 Quest Rewards')
        .addFields(
          { name: 'Quests Completed', value: `${user.quests?.totalCompleted || 0}`, inline: true },
          { name: 'Active Quests', value: `${user.quests?.activeQuests.length || 0}`, inline: true },
          { name: 'Total Rewards Earned', value: `💰 ${totalRewards}`, inline: true }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error fetching quest rewards', ephemeral: true });
    }
  }
};
