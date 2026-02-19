const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('plant_crops')
    .setDescription('Plant crops on your farm'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const crops = ['Wheat', 'Corn', 'Potatoes', 'Carrots', 'Pumpkins'];
      const crop = crops[Math.floor(Math.random() * crops.length)];
      const growTime = 1800; // 30 minutes in seconds

      if (!user.farmingStats.crops) user.farmingStats.crops = [];
      user.farmingStats.crops.push({
        cropType: crop,
        quantity: Math.floor(Math.random() * 10) + 5,
        plantedAt: new Date(),
        readyAt: new Date(Date.now() + growTime * 1000)
      });

      const embed = new EmbedBuilder()
        .setColor('#00aa00')
        .setTitle('🌾 Crops Planted!')
        .addFields(
          { name: 'Crop', value: crop },
          { name: 'Quantity', value: `${user.farmingStats.crops[user.farmingStats.crops.length - 1].quantity}` },
          { name: 'Ready In', value: '30 minutes' }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error planting crops', ephemeral: true });
    }
  }
};
