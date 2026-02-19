const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ranked_match')
    .setDescription('Play a ranked PvP match'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const won = Math.random() > 0.5;
      const pointsGain = Math.floor(Math.random() * 100) + 50;

      if (won) {
        user.tournament.wins += 1;
        user.tournament.totalPoints += pointsGain;
      } else {
        user.tournament.losses += 1;
      }

      const embed = new EmbedBuilder()
        .setColor(won ? '#00ff00' : '#ff0000')
        .setTitle(`${won ? '✅ Victory' : '❌ Defeat'}!`)
        .addFields(
          { name: 'Points', value: won ? `+${pointsGain}` : '-50' },
          { name: 'Total Points', value: `${user.tournament.totalPoints}` },
          { name: 'Record', value: `${user.tournament.wins}W - ${user.tournament.losses}L` }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error playing match', ephemeral: true });
    }
  }
};
