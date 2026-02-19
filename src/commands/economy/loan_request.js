const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loan_request')
    .setDescription('Request a loan from the bank')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Loan amount')
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

      const maxLoan = user.wallet * 2;
      if (amount > maxLoan) {
        return interaction.reply({ content: `Max loan: 💰 ${maxLoan}`, ephemeral: true });
      }

      await EconomyManager.addMoney(userId, amount);
      const interestRate = 1.10; // 10% interest
      const repayAmount = Math.floor(amount * interestRate);

      const embed = new EmbedBuilder()
        .setColor('#ffaa00')
        .setTitle('🏦 Loan Approved!')
        .addFields(
          { name: 'Loan Amount', value: `💰 ${amount}` },
          { name: 'Interest Rate', value: `10%` },
          { name: 'Repay Amount', value: `💰 ${repayAmount}` }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error processing loan', ephemeral: true });
    }
  }
};
