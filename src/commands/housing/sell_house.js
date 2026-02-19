const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sell_house')
    .setDescription('Sell your house'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      if (user.house.value === 0) {
        return interaction.reply({ content: 'You don\'t own a house!', ephemeral: true });
      }

      const salePrice = Math.floor(user.house.value * 0.8); // 20% loss
      await EconomyManager.addMoney(userId, salePrice);
      user.house.tier = 0;
      user.house.value = 0;
      user.house.decorations = [];

      const embed = new EmbedBuilder()
        .setColor('#aa0000')
        .setTitle('🏚️ House Sold!')
        .addFields(
          { name: 'Sale Price', value: `💰 ${salePrice}`, inline: true },
          { name: 'You Lost', value: `💰 ${user.house.value - salePrice}`, inline: true }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error selling house', ephemeral: true });
    }
  }
};
