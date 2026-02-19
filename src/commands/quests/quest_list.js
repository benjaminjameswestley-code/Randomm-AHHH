const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quest_list')
    .setDescription('View your active quests'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      if (!user.quests || user.quests.activeQuests.length === 0) {
        return interaction.reply({ content: 'You have no active quests! Use `/daily_quest`', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setColor('#aa00ff')
        .setTitle('📋 Your Quests')
        .setDescription(`You have ${user.quests.activeQuests.length} active quest(s)`);

      user.quests.activeQuests.forEach((quest, i) => {
        const progress = Math.floor((quest.progress / quest.target) * 100);
        embed.addFields({
          name: `${i + 1}. ${quest.name}`,
          value: `Progress: ${progress}% (${quest.progress}/${quest.target})\nReward: 💰 ${quest.reward}`,
          inline: false
        });
      });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error fetching quests', ephemeral: true });
    }
  }
};
