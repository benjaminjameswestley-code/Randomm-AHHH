const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quest_info')
    .setDescription('Get information about the questing system'),
  async execute(interaction) {
    try {
      const embed = new EmbedBuilder()
        .setColor('#aa00ff')
        .setTitle('📜 Quest System Information')
        .setDescription('Complete quests to earn rewards!')
        .addFields(
          { name: 'Getting Started', value: 'Use `/daily_quest` to get a new quest' },
          { name: 'View Quests', value: 'Use `/quest_list` to see your active quests' },
          { name: 'Complete Quest', value: 'Use `/complete_quest` when you finish a quest' },
          { name: 'Quest Types', value: 'Fishing, Mining, Working, Hunting, Earning' },
          { name: 'Rewards', value: 'Each quest gives 🪙 coins as reward' }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error fetching quest info', ephemeral: true });
    }
  }
};
