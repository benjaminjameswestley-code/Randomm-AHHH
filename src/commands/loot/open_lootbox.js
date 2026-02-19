const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('open_lootbox')
    .setDescription('Open a mystery loot box'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const loot = Math.floor(Math.random() * 2000) + 100;
      await EconomyManager.addMoney(userId, loot);
      user.loot.lootboxesOpened += 1;

      const embed = new EmbedBuilder()
        .setColor('#ff00ff')
        .setTitle('🎁 Loot Box Opened!')
        .addFields(
          { name: 'Loot', value: `💰 ${loot} coins` },
          { name: 'Boxes Opened', value: `${user.loot.lootboxesOpened}` },
          { name: 'Total From Boxes', value: `💰 ${user.loot.lootboxesOpened * 1000}` }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error opening loot box', ephemeral: true });
    }
  }
};
