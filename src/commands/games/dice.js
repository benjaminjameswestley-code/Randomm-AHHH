const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Roll the dice!')
    .addNumberOption(option =>
      option.setName('prediction')
        .setDescription('Predict the number (1-6)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(6)
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
      const prediction = Math.floor(interaction.options.getNumber('prediction'));
      const wager = Math.floor(interaction.options.getNumber('wager'));

      if (user.wallet < wager) {
        return await interaction.reply({
          content: `❌ You don't have $${EconomyManager.formatMoney(wager)}!`,
          ephemeral: true
        });
      }

      const roll = Math.floor(Math.random() * 6) + 1;
      const won = prediction === roll;

      if (won) {
        await EconomyManager.addMoney(interaction.user.id, wager * 3, 'wallet');
      } else {
        await EconomyManager.removeMoney(interaction.user.id, wager, 'wallet');
      }

      const embed = new EmbedBuilder()
        .setColor(won ? '#2ecc71' : '#e74c3c')
        .setTitle('🎲 Dice Roll')
        .addFields(
          { name: 'Your Prediction', value: `${prediction}`, inline: true },
          { name: 'Roll Result', value: `${roll}`, inline: true },
          { name: 'Outcome', value: won ? '✅ Correct!' : '❌ Wrong!', inline: true },
          { name: 'Payout', value: `$${EconomyManager.formatMoney(won ? wager * 3 : 0)}`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred.', ephemeral: true });
    }
  }
};
