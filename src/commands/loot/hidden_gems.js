const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hidden_gems')
    .setDescription('Search for hidden gems and valuables'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const gems = ['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Topaz'];
      const gem = gems[Math.floor(Math.random() * gems.length)];
      const value = Math.floor(Math.random() * 3000) + 500;

      await EconomyManager.addMoney(userId, value);

      const embed = new EmbedBuilder()
        .setColor('#00ffff')
        .setTitle('💎 Hidden Gem Found!')
        .addFields(
          { name: 'Gem', value: gem },
          { name: 'Value', value: `💰 ${value} coins` }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error searching for gems', ephemeral: true });
    }
  }
};
