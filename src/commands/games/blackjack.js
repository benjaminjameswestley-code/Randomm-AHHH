const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EconomyManager = require('../../utils/EconomyManager');

const BLACKJACK_VALUES = {
  'Ace': [1, 11],
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'Jack': 10, 'Queen': 10, 'King': 10
};

function getRandomCard() {
  const cards = Object.keys(BLACKJACK_VALUES);
  return cards[Math.floor(Math.random() * cards.length)];
}

function calculateHand(cards) {
  let total = 0;
  let aces = 0;

  for (const card of cards) {
    const value = BLACKJACK_VALUES[card];
    if (card === 'Ace') {
      aces++;
      total += 11;
    } else {
      total += value;
    }
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blackjack')
    .setDescription('Play blackjack against the dealer!')
    .addNumberOption(option =>
      option.setName('wager')
        .setDescription('Amount to wager')
        .setRequired(true)
        .setMinValue(100)
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

      const playerCards = [getRandomCard(), getRandomCard()];
      const dealerCards = [getRandomCard(), getRandomCard()];

      const playerTotal = calculateHand(playerCards);
      const dealerTotal = calculateHand(dealerCards);

      let playerWon = false;
      let result = '';

      if (playerTotal > 21) {
        result = 'Bust! You lost.';
        await EconomyManager.removeMoney(interaction.user.id, wager, 'wallet');
      } else if (dealerTotal > 21) {
        result = 'Dealer busted! You won!';
        await EconomyManager.addMoney(interaction.user.id, wager * 2, 'wallet');
        playerWon = true;
      } else if (playerTotal > dealerTotal) {
        result = 'You won!';
        await EconomyManager.addMoney(interaction.user.id, wager * 2, 'wallet');
        playerWon = true;
      } else if (dealerTotal > playerTotal) {
        result = 'Dealer won. You lost.';
        await EconomyManager.removeMoney(interaction.user.id, wager, 'wallet');
      } else {
        result = "It's a push!";
      }

      const embed = new EmbedBuilder()
        .setColor(playerWon ? '#2ecc71' : '#e74c3c')
        .setTitle('♠️ Blackjack')
        .addFields(
          { name: 'Your Hand', value: `${playerCards.join(', ')} (${playerTotal})`, inline: true },
          { name: 'Dealer Hand', value: `${dealerCards.join(', ')} (${dealerTotal})`, inline: true },
          { name: 'Result', value: result, inline: false },
          { name: 'Payout', value: `$${EconomyManager.formatMoney(playerWon ? wager * 2 : 0)}`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred.', ephemeral: true });
    }
  }
};
