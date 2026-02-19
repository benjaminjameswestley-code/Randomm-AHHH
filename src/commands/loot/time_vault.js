const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('time_vault')
    .setDescription('Open a time vault with delayed rewards'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const reward = Math.floor(Math.random() * 5000) + 1000;
      const timeDelay = Math.floor(Math.random() * 4) + 1; // 1-4 hours

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('⏰ Time Vault Opened!')
        .addFields(
          { name: 'Reward Amount', value: `💰 ${reward}` },
          { name: 'Available In', value: `${timeDelay} hour(s)` },
          { name: 'Status', value: '⏳ Locked (Opening...)' }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error with time vault', ephemeral: true });
    }
  }
};
