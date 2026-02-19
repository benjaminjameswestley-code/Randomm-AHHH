const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('battlepass')
    .setDescription('Check your battle pass progress'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const progress = Math.floor((user.tournament.totalPoints / 10000) * 100);

      const embed = new EmbedBuilder()
        .setColor('#aa00ff')
        .setTitle('📊 Battle Pass')
        .addFields(
          { name: 'Progress', value: `${progress}/100%` },
          { name: 'Level', value: `${Math.floor(progress / 10)}` },
          { name: 'Points to Next Level', value: `${(10000 - (user.tournament.totalPoints % 10000))}`},
          { name: 'Total Points', value: `${user.tournament.totalPoints}` }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error fetching battle pass', ephemeral: true });
    }
  }
};
