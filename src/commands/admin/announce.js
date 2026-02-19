const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Send an announcement to a channel (admin only)')
    .addChannelOption(option => option.setName('channel').setDescription('Channel to announce in').setRequired(true))
    .addStringOption(option => option.setName('message').setDescription('Announcement message').setRequired(true)),
  async execute(interaction) {
    try {
      if (!interaction.member || !interaction.member.permissions.has('Administrator')) {
        return interaction.reply({ content: 'You do not have permission to run this command.', ephemeral: true });
      }

      const channel = interaction.options.getChannel('channel');
      const text = interaction.options.getString('message');

      const embed = new EmbedBuilder()
        .setTitle('📢 Announcement')
        .setDescription(text)
        .setColor('#2ecc71')
        .setTimestamp();

      await channel.send({ embeds: [embed] });
      await interaction.reply({ content: 'Announcement sent.', ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'Failed to send announcement.', ephemeral: true });
    }
  }
};
