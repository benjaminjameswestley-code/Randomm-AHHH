const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('craft_item')
    .setDescription('Craft an item using your skills'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const cost = 500;
      if (user.wallet < cost) {
        return interaction.reply({ content: `You need 💰 ${cost}`, ephemeral: true });
      }

      const items = ['Sword', 'Shield', 'Armor', 'Bow', 'Staff', 'Wand'];
      const item = items[Math.floor(Math.random() * items.length)];

      await EconomyManager.removeMoney(userId, cost);
      user.crafting.craftXP += 50;
      
      if (user.crafting.craftXP >= 1000) {
        user.crafting.level += 1;
        user.crafting.craftXP = 0;
      }

      const embed = new EmbedBuilder()
        .setColor('#8b4513')
        .setTitle('🔨 Item Crafted!')
        .addFields(
          { name: 'Item', value: item },
          { name: 'Crafting Level', value: `${user.crafting.level}` },
          { name: 'XP', value: `${user.crafting.craftXP}/1000` }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error crafting item', ephemeral: true });
    }
  }
};
