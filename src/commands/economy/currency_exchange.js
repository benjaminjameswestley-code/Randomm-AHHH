const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('currency_exchange')
    .setDescription('Exchange between different currencies'),
  async execute(interaction) {
    try {
      const embed = new EmbedBuilder()
        .setColor('#00ffff')
        .setTitle('💹 Currency Exchange')
        .addFields(
          { name: 'Gold to Coins', value: '1 Gold = 100 Coins' },
          { name: 'Gems to Coins', value: '1 Gem = 250 Coins' },
          { name: 'Tokens to Coins', value: '1 Token = 50 Coins' },
          { name: 'Your Wallet', value: '💰 [User Balance]' }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error accessing exchange', ephemeral: true });
    }
  }
};
