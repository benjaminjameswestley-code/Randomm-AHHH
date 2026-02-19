const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('combine_items')
    .setDescription('Combine two items into a stronger one'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      if (user.items.length < 2) {
        return interaction.reply({ content: 'You need at least 2 items!', ephemeral: true });
      }

      const item1 = user.items[0];
      const item2 = user.items[1];

      user.items.splice(0, 2);

      const combined = {
        itemId: `combined-${Date.now()}`,
        name: `${item1.name} + ${item2.name}`,
        quantity: 1,
        rarity: 'legendary',
        acquiredAt: new Date()
      };

      user.items.push(combined);

      const embed = new EmbedBuilder()
        .setColor('#ff00ff')
        .setTitle('⚗️ Items Combined!')
        .addFields(
          { name: 'Combined', value: combined.name },
          { name: 'Rarity', value: 'Legendary ⭐' }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error combining items', ephemeral: true });
    }
  }
};
