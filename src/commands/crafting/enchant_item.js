const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('enchant_item')
    .setDescription('Enchant an item to make it stronger'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const cost = 1000;
      if (user.wallet < cost) {
        return interaction.reply({ content: `You need 💰 ${cost}`, ephemeral: true });
      }

      const success = Math.random() > 0.3;
      await EconomyManager.removeMoney(userId, cost);

      const embed = new EmbedBuilder()
        .setColor(success ? '#00ff00' : '#ff0000')
        .setTitle(success ? '✨ Enchantment Successful!' : '❌ Enchantment Failed!')
        .addFields(
          { name: 'Cost', value: `💰 ${cost}` },
          { name: 'Success Rate', value: `70%` }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error enchanting', ephemeral: true });
    }
  }
};
