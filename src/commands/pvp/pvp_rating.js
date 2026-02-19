const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pvp_rating')
    .setDescription('Check your PvP rating and stats'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const winRate = user.tournament.wins + user.tournament.losses > 0 
        ? Math.round((user.tournament.wins / (user.tournament.wins + user.tournament.losses)) * 100)
        : 0;

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('⚡ PvP Rating')
        .addFields(
          { name: 'Total Points', value: `${user.tournament.totalPoints}` },
          { name: 'Wins', value: `${user.tournament.wins}`, inline: true },
          { name: 'Losses', value: `${user.tournament.losses}`, inline: true },
          { name: 'Win Rate', value: `${winRate}%`, inline: true },
          { name: 'Rank', value: `#${user.tournament.rank || 0}` }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error fetching rating', ephemeral: true });
    }
  }
};
