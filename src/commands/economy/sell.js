const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sell')
    .setDescription('Sell items from your inventory!')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Item name to sell')
        .setRequired(true)
    )
    .addNumberOption(option =>
      option.setName('quantity')
        .setDescription('How many to sell')
        .setRequired(true)
        .setMinValue(1)
    ),
  async execute(interaction) {
    try {
      const user = await User.findOne({ userId: interaction.user.id });
      const itemName = interaction.options.getString('item').toLowerCase();
      const quantity = Math.floor(interaction.options.getNumber('quantity'));

      if (!user) {
        return await interaction.reply({
          content: '❌ User not found!',
          ephemeral: true
        });
      }

      const item = user.items.find(i => i.name.toLowerCase() === itemName);

      if (!item) {
        return await interaction.reply({
          content: `❌ Item "${itemName}" not found in inventory!`,
          ephemeral: true
        });
      }

      if (item.quantity < quantity) {
        return await interaction.reply({
          content: `❌ You only have ${item.quantity} ${item.name}!`,
          ephemeral: true
        });
      }

      // Calculate base value
      const rarityMultiplier = {
        legendary: 1000,
        epic: 500,
        rare: 100,
        uncommon: 50,
        common: 10
      };

      const baseValue = rarityMultiplier[item.rarity] || 10;
      const totalValue = baseValue * quantity;

      // Remove items
      await EconomyManager.removeItem(interaction.user.id, item.itemId, quantity);

      // Add money
      await EconomyManager.addMoney(interaction.user.id, totalValue, 'wallet');

      const embed = new EmbedBuilder()
        .setColor('#2ecc71')
        .setTitle('💳 Items Sold!')
        .setDescription(`You sold **${quantity}x ${item.name}**!`)
        .addFields(
          { name: 'Price per Item', value: `$${baseValue}`, inline: true },
          { name: 'Total', value: `$${totalValue}`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred.', ephemeral: true });
    }
  }
};
