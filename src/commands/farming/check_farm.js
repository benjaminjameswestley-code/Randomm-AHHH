const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('check_farm')
    .setDescription('Check the status of your farm'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setColor('#00aa00')
        .setTitle('🌾 Farm Status')
        .addFields(
          { name: 'Farm Level', value: `${user.farmingStats.level || 1}` },
          { name: 'Active Crops', value: `${user.farmingStats.crops?.length || 0}` },
          { name: 'Ready to Harvest', value: `${user.farmingStats.crops?.filter(c => c.readyAt <= new Date()).length || 0}` }
        );

      if (user.farmingStats.crops && user.farmingStats.crops.length > 0) {
        let cropsInfo = '';
        user.farmingStats.crops.forEach((crop, i) => {
          const ready = crop.readyAt <= new Date() ? '✅ Ready' : `⏳ ${Math.ceil((crop.readyAt - new Date()) / 60000)}m`;
          cropsInfo += `\n${i + 1}. ${crop.cropType} (${crop.quantity}) - ${ready}`;
        });
        embed.addFields({ name: 'Crops', value: cropsInfo });
      }

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error checking farm', ephemeral: true });
    }
  }
};
