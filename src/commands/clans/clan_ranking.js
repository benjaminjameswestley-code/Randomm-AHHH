const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clan_ranking')
    .setDescription('View clan rankings and statistics'),
  async execute(interaction) {
    try {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('🏆 Clan Rankings')
        .addFields(
          { name: '1. Dragon Slayers', value: 'Members: 45 | Wars Won: 120' },
          { name: '2. Shadow Knights', value: 'Members: 38 | Wars Won: 115' },
          { name: '3. Phoenix Rising', value: 'Members: 42 | Wars Won: 110' },
          { name: 'Your Rank', value: '#50 - Your Clan' }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error fetching rankings', ephemeral: true });
    }
  }
};
