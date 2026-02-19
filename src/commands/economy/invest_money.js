const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invest_money')
    .setDescription('Invest your money for returns')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount to invest')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      const amount = interaction.options.getInteger('amount');
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      if (user.wallet < amount) {
        return interaction.reply({ content: `You don't have 💰 ${amount}`, ephemeral: true });
      }

      await EconomyManager.removeMoney(userId, amount);
      const returnRate = 1.15; // 15% return

      if (!user.stocks.investments) user.stocks.investments = [];
      user.stocks.investments.push({
        investmentId: `inv-${Date.now()}`,
        amount,
        returnRate,
        startDate: new Date()
      });

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('💼 Investment Made!')
        .addFields(
          { name: 'Amount Invested', value: `💰 ${amount}` },
          { name: 'Expected Return', value: `💰 ${Math.floor(amount * returnRate)}` },
          { name: 'Return Rate', value: `+15%` }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error making investment', ephemeral: true });
    }
  }
};
