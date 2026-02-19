const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('harvest_crops')
    .setDescription('Harvest ready crops from your farm'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const readyCrops = user.farmingStats.crops.filter(c => c.readyAt <= new Date());
      if (readyCrops.length === 0) {
        return interaction.reply({ content: 'No crops ready to harvest!', ephemeral: true });
      }

      let totalHarvest = 0;
      readyCrops.forEach(crop => {
        totalHarvest += crop.quantity * 25;
      });

      await EconomyManager.addMoney(userId, totalHarvest);
      user.farmingStats.crops = user.farmingStats.crops.filter(c => c.readyAt > new Date());

      const embed = new EmbedBuilder()
        .setColor('#ffaa00')
        .setTitle('🌻 Crops Harvested!')
        .addFields(
          { name: 'Crops Harvested', value: `${readyCrops.length}` },
          { name: 'Total Earnings', value: `💰 ${totalHarvest}` }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error harvesting crops', ephemeral: true });
    }
  }
};
