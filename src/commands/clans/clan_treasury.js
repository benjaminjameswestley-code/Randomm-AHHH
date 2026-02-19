const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clan_treasury')
    .setDescription('Manage your clan treasury'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      if (!user.guild || !user.guild.name) {
        return interaction.reply({ content: 'You must be in a clan!' });
      }

      const treasury = user.clanWars.treasuryShare || 5000;

      const embed = new EmbedBuilder()
        .setColor('#ffd700')
        .setTitle('💰 Clan Treasury')
        .addFields(
          { name: 'Clan', value: user.guild.name },
          { name: 'Treasury Balance', value: `💰 ${treasury}` },
          { name: 'Your Share', value: `💰 ${Math.floor(treasury / (user.guild.members?.length || 1))}` }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error accessing treasury', ephemeral: true });
    }
  }
};
