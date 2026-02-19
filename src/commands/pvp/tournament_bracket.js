const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tournament_bracket')
    .setDescription('View the current tournament bracket'),
  async execute(interaction) {
    try {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('🏆 Tournament Bracket')
        .setDescription('Current tournament standings')
        .addFields(
          { name: '1st Place', value: 'Player A - 5000 points' },
          { name: '2nd Place', value: 'Player B - 4500 points' },
          { name: '3rd Place', value: 'Player C - 4000 points' },
          { name: 'Your Rank', value: '#1' }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error fetching bracket', ephemeral: true });
    }
  }
};
