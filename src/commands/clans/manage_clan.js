const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('manage_clan')
    .setDescription('Manage your clan settings'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      if (!user.guild || !user.guild.name) {
        return interaction.reply({ content: 'You must be a clan leader!' });
      }

      if (user.guild.leader !== userId) {
        return interaction.reply({ content: 'Only the clan leader can manage the clan!' });
      }

      const embed = new EmbedBuilder()
        .setColor('#ff00ff')
        .setTitle('⚙️ Clan Management')
        .setDescription(`Managing ${user.guild.name}`)
        .addFields(
          { name: 'Members', value: `${user.guild.members?.length || 1}/50` },
          { name: 'Treasury', value: `💰 ${user.clanWars.treasuryShare || 5000}` },
          { name: 'War Record', value: `${user.clanWars.warsWon}W - ${user.clanWars.warsLost}L` },
          { name: 'Options', value: 'Invite • Kick • Disband • Upgrade' }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error managing clan', ephemeral: true });
    }
  }
};
