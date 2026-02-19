const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Show bot uptime'),
  async execute(interaction) {
    try {
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      await interaction.reply(`Uptime: ${hours}h ${minutes}m ${seconds}s`);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'Failed to get uptime.', ephemeral: true });
    }
  }
};
