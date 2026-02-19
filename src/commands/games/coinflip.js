const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin and wager money!')
    .addStringOption(option =>
      option.setName('side')
        .setDescription('Heads or Tails?')
        .setRequired(true)
        .addChoices(
          { name: 'Heads', value: 'heads' },
          { name: 'Tails', value: 'tails' }
        )
    )
    .addNumberOption(option =>
      option.setName('wager')
        .setDescription('Amount to wager')
        .setRequired(true)
        .setMinValue(50)
    ),
  async execute(interaction) {
    try {
      const user = await EconomyManager.getOrCreateUser(interaction.user.id, interaction.user.username);
      const choice = interaction.options.getString('side');
      const wager = Math.floor(interaction.options.getNumber('wager'));

      if (user.wallet < wager) {
        return await interaction.reply({
          content: `❌ You don't have $${EconomyManager.formatMoney(wager)}!`,
          ephemeral: true
        });
      }

      const result = Math.random() < 0.5 ? 'heads' : 'tails';
      const won = choice === result;

      if (won) {
        await EconomyManager.addMoney(interaction.user.id, wager * 2, 'wallet');
      } else {
        await EconomyManager.removeMoney(interaction.user.id, wager, 'wallet');
      }

      const embed = new EmbedBuilder()
        .setColor(won ? '#2ecc71' : '#e74c3c')
        .setTitle('🪙 Coin Flip')
        .addFields(
          { name: 'Your Choice', value: choice.toUpperCase(), inline: true },
          { name: 'Result', value: result.toUpperCase(), inline: true },
          { name: 'Outcome', value: won ? '✅ Won!' : '❌ Lost!', inline: true },
          { name: 'Payout', value: `$${EconomyManager.formatMoney(won ? wager * 2 : 0)}`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred.', ephemeral: true });
    }
  }
};
