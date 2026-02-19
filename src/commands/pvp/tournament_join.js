const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tournament_join')
    .setDescription('Join a PvP tournament bracket'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      user.tournament.rank = (user.tournament.rank || 0) + 1;

      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('⚔️ Tournament Joined!')
        .addFields(
          { name: 'Your Rank', value: `#${user.tournament.rank}`, inline: true },
          { name: 'Total Points', value: `${user.tournament.totalPoints}`, inline: true }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error joining tournament', ephemeral: true });
    }
  }
};
