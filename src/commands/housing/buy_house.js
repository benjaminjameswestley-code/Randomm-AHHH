const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy_house')
    .setDescription('Purchase a house'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      if (user.house.value > 0) {
        return interaction.reply({ content: 'You already own a house! Use `/sell_house` first.', ephemeral: true });
      }

      const cost = 10000;
      if (user.wallet < cost) {
        return interaction.reply({ content: `You need 💰 ${cost} to buy a house. You have ${user.wallet}.`, ephemeral: true });
      }

      await EconomyManager.removeMoney(userId, cost);
      user.house.tier = 1;
      user.house.value = cost;
      user.house.decorations = [];

      const embed = new EmbedBuilder()
        .setColor('#00aa00')
        .setTitle('🏠 House Purchased!')
        .setDescription('Welcome to your new home!')
        .addFields(
          { name: 'House Tier', value: '1', inline: true },
          { name: 'Cost', value: `💰 ${cost}`, inline: true },
          { name: 'Property Value', value: `💰 ${user.house.value}`, inline: true }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error buying house', ephemeral: true });
    }
  }
};
