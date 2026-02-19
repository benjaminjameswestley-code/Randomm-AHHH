const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slots')
    .setDescription('Try your luck at the slot machine!')
    .addNumberOption(option =>
      option.setName('wager')
        .setDescription('Amount to wager')
        .setRequired(true)
        .setMinValue(50)
    ),
  async execute(interaction) {
    try {
      const user = await EconomyManager.getOrCreateUser(interaction.user.id, interaction.user.username);
      const wager = Math.floor(interaction.options.getNumber('wager'));

      if (user.wallet < wager) {
        return await interaction.reply({
          content: `❌ You don't have $${EconomyManager.formatMoney(wager)}!`,
          ephemeral: true
        });
      }

      const symbols = ['🍎', '🍊', '🍋', '🍌', '🍇', '💎'];
      const reels = [symbols[Math.floor(Math.random() * symbols.length)],
                     symbols[Math.floor(Math.random() * symbols.length)],
                     symbols[Math.floor(Math.random() * symbols.length)]];

      const allMatch = reels[0] === reels[1] && reels[1] === reels[2];
      const twoMatch = reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2];

      let multiplier = 0;
      if (allMatch) {
        multiplier = 5; // 5x return
      } else if (twoMatch) {
        multiplier = 2; // 2x return
      }

      const result = multiplier > 0 ? wager * multiplier : 0;

      if (multiplier > 0) {
        await EconomyManager.addMoney(interaction.user.id, result, 'wallet');
      } else {
        await EconomyManager.removeMoney(interaction.user.id, wager, 'wallet');
      }

      const embed = new EmbedBuilder()
        .setColor(multiplier > 0 ? '#2ecc71' : '#e74c3c')
        .setTitle('🎰 Slot Machine')
        .setDescription(`${reels[0]} ${reels[1]} ${reels[2]}`)
        .addFields(
          { name: 'Wager', value: `$${EconomyManager.formatMoney(wager)}`, inline: true },
          { name: 'Result', value: multiplier > 0 ? `Won! ${multiplier}x` : 'Lost!', inline: true },
          { name: 'Payout', value: `$${EconomyManager.formatMoney(result)}`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred.', ephemeral: true });
    }
  }
};
