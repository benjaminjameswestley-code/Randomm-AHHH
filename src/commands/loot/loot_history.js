const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loot_history')
    .setDescription('View your loot history and statistics'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const totalTreasure = user.loot.treasuresFound * 750;
      const totalFromBoxes = user.loot.lootboxesOpened * 1000;

      const embed = new EmbedBuilder()
        .setColor('#ffd700')
        .setTitle('📊 Loot History')
        .addFields(
          { name: 'Treasures Found', value: `${user.loot.treasuresFound}` },
          { name: 'Loot Boxes Opened', value: `${user.loot.lootboxesOpened}` },
          { name: 'Total From Treasure Hunts', value: `💰 ${totalTreasure}` },
          { name: 'Total From Boxes', value: `💰 ${totalFromBoxes}` },
          { name: 'Combined Total', value: `💰 ${totalTreasure + totalFromBoxes}` }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error fetching loot history', ephemeral: true });
    }
  }
};
