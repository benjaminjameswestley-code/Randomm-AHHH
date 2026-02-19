const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trade')
    .setDescription('Trade items with another user!')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to trade with')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('give_item')
        .setDescription('Item you\'re giving')
        .setRequired(true)
    )
    .addNumberOption(option =>
      option.setName('give_quantity')
        .setDescription('Quantity of item you\'re giving')
        .setRequired(true)
        .setMinValue(1)
    )
    .addStringOption(option =>
      option.setName('want_item')
        .setDescription('Item you want in return')
        .setRequired(true)
    )
    .addNumberOption(option =>
      option.setName('want_quantity')
        .setDescription('Quantity of item you want')
        .setRequired(true)
        .setMinValue(1)
    ),
  async execute(interaction) {
    try {
      const trader = interaction.options.getUser('user');
      const giveItem = interaction.options.getString('give_item');
      const giveQty = Math.floor(interaction.options.getNumber('give_quantity'));
      const wantItem = interaction.options.getString('want_item');
      const wantQty = Math.floor(interaction.options.getNumber('want_quantity'));

      if (trader.id === interaction.user.id) {
        return await interaction.reply({
          content: '❌ You cannot trade with yourself!',
          ephemeral: true
        });
      }

      const sender = await User.findOne({ userId: interaction.user.id });
      const recipient = await User.findOne({ userId: trader.id });

      if (!sender || !recipient) {
        return await interaction.reply({
          content: '❌ User not found!',
          ephemeral: true
        });
      }

      // Check sender has items
      const senderItem = sender.items.find(i => i.name.toLowerCase() === giveItem.toLowerCase());
      if (!senderItem || senderItem.quantity < giveQty) {
        return await interaction.reply({
          content: `❌ You don't have enough ${giveItem}!`,
          ephemeral: true
        });
      }

      // Check recipient has items
      const recipientItem = recipient.items.find(i => i.name.toLowerCase() === wantItem.toLowerCase());
      if (!recipientItem || recipientItem.quantity < wantQty) {
        return await interaction.reply({
          content: `❌ ${trader.username} doesn't have enough ${wantItem}!`,
          ephemeral: true
        });
      }

      // Trade! (simplified - no approval system for now)
      await EconomyManager.removeItem(interaction.user.id, senderItem.itemId, giveQty);
      await EconomyManager.removeItem(trader.id, recipientItem.itemId, wantQty);
      await EconomyManager.addItem(interaction.user.id, recipientItem.itemId, recipientItem.name, wantQty, recipientItem.rarity);
      await EconomyManager.addItem(trader.id, senderItem.itemId, senderItem.name, giveQty, senderItem.rarity);

      const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setTitle('🤝 Trade Complete!')
        .addFields(
          { name: 'You Gave', value: `${giveQty}x ${senderItem.name}`, inline: true },
          { name: 'You Received', value: `${wantQty}x ${recipientItem.name}`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred.', ephemeral: true });
    }
  }
};
