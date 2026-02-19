const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('restart')
    .setDescription('Restart the bot (admin only)'),
  async execute(interaction) {
    try {
      if (!interaction.member || !interaction.member.permissions.has('Administrator')) {
        return interaction.reply({ content: 'You do not have permission to run this command.', ephemeral: true });
      }

      await interaction.reply('Restarting bot...');
      setTimeout(() => process.exit(0), 1000);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'Failed to restart.', ephemeral: true });
    }
  }
};
