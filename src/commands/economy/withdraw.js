const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('withdraw')
    .setDescription('Withdraw money from your bank')
    .addNumberOption(option =>
      option.setName('amount')
        .setDescription('Amount to withdraw')
        .setRequired(true)
        .setMinValue(1)
    ),
  async execute(interaction) {
    try {
      const amount = Math.floor(interaction.options.getNumber('amount'));
      const user = await EconomyManager.getOrCreateUser(interaction.user.id, interaction.user.username);

      if (user.bank < amount) {
        return await interaction.reply({
          content: `❌ You only have $${EconomyManager.formatMoney(user.bank)} in your bank!`,
          ephemeral: true
        });
      }

      await EconomyManager.withdraw(interaction.user.id, amount);

      const embed = new EmbedBuilder()
        .setColor('#2ecc71')
        .setTitle('✅ Withdrawal Successful')
        .setDescription(`You withdrew $${EconomyManager.formatMoney(amount)} from your bank!`)
        .addFields(
          { name: 'New Wallet', value: `$${EconomyManager.formatMoney(user.wallet + amount)}`, inline: true },
          { name: 'New Bank', value: `$${EconomyManager.formatMoney(user.bank - amount)}`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred during withdrawal.', ephemeral: true });
    }
  }
};
