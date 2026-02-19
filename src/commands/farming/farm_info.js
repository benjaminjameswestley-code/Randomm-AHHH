const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('farm_info')
    .setDescription('Get information about farming'),
  async execute(interaction) {
    try {
      const embed = new EmbedBuilder()
        .setColor('#00aa00')
        .setTitle('🌾 Farming Guide')
        .setDescription('Grow crops and raise animals!')
        .addFields(
          { name: 'Plant Crops', value: 'Use `/plant_crops` to start growing' },
          { name: 'Harvest', value: 'Use `/harvest_crops` when ready' },
          { name: 'Check Status', value: 'Use `/check_farm` to see progress' },
          { name: 'Breed Animals', value: 'Use `/breed_animals` for resources' },
          { name: 'Growth Time', value: '30 minutes per crop' }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error getting farm info', ephemeral: true });
    }
  }
};
