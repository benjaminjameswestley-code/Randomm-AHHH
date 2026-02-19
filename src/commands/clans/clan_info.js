const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clan_info')
    .setDescription('Get information about your clan'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      if (!user.guild || !user.guild.name) {
        return interaction.reply({ content: 'You\'re not in a clan!' });
      }

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('ℹ️ Clan Information')
        .addFields(
          { name: 'Clan Name', value: user.guild.name },
          { name: 'Leader', value: user.guild.leader || 'Unknown' },
          { name: 'Members', value: `${user.guild.members?.length || 1}` },
          { name: 'Created', value: user.guild.createdAt ? `<t:${Math.floor(user.guild.createdAt.getTime() / 1000)}:f>` : 'Unknown' },
          { name: 'Wars Won', value: `${user.clanWars.warsWon}`, inline: true },
          { name: 'Wars Lost', value: `${user.clanWars.warsLost}`, inline: true }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error fetching clan info', ephemeral: true });
    }
  }
};
