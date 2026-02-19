const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stock_market')
    .setDescription('Buy and sell stocks'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const stocks = [
        { symbol: 'DRAX', price: 100, trend: '+5%' },
        { symbol: 'MEME', price: 50, trend: '-2%' },
        { symbol: 'GOLD', price: 250, trend: '+10%' },
        { symbol: 'TECH', price: 150, trend: '+3%' },
        { symbol: 'MAGIC', price: 200, trend: '-5%' }
      ];

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('📈 Stock Market')
        .setDescription('Trading opportunities');

      stocks.forEach(stock => {
        const color = stock.trend.includes('+') ? '📈' : '📉';
        embed.addFields({
          name: `${stock.symbol}`,
          value: `Price: 💰${stock.price} ${color} ${stock.trend}`,
          inline: true
        });
      });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error accessing stock market', ephemeral: true });
    }
  }
};
