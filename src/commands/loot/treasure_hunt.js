const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('treasure_hunt')
    .setDescription('Go on a treasure hunt for riches'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const lastHunt = user.loot.lastTreasureHunt || new Date(0);
      const cooldown = 60 * 60 * 1000; // 1 hour
      if (Date.now() - lastHunt.getTime() < cooldown) {
        return interaction.reply({ content: `⏰ Please wait before hunting again`, ephemeral: true });
      }

      const found = Math.random() > 0.3;
      const treasure = Math.floor(Math.random() * 1000) + 500;

      if (found) {
        await EconomyManager.addMoney(userId, treasure);
        user.loot.treasuresFound += 1;
      }

      const embed = new EmbedBuilder()
        .setColor(found ? '#ffd700' : '#808080')
        .setTitle(found ? '🗺️ Treasure Found!' : '😢 No Treasure Found')
        .addFields(
          { name: 'Result', value: found ? `💰 ${treasure} coins!` : 'Better luck next time!' },
          { name: 'Treasures Found', value: `${user.loot.treasuresFound}` }
        );

      user.loot.lastTreasureHunt = new Date();
      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error on treasure hunt', ephemeral: true });
    }
  }
};
