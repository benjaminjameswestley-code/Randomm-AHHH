const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play Rock-Paper-Scissors for cash!')
    .addStringOption(option =>
      option.setName('choice')
        .setDescription('Your choice')
        .setRequired(true)
        .addChoices(
          { name: 'Rock', value: 'rock' },
          { name: 'Paper', value: 'paper' },
          { name: 'Scissors', value: 'scissors' }
        )
    )
    .addNumberOption(option =>
      option.setName('amount')
        .setDescription('Amount to wager')
        .setRequired(true)
        .setMinValue(50)
    ),
  async execute(interaction) {
    try {
      const user = await EconomyManager.getOrCreateUser(interaction.user.id, interaction.user.username);
      const choice = interaction.options.getString('choice');
      const wager = Math.floor(interaction.options.getNumber('amount'));

      if (user.wallet < wager) {
        return await interaction.reply({
          content: `❌ You don't have enough money! You have $${EconomyManager.formatMoney(user.wallet)}.`,
          ephemeral: true
        });
      }

      const choices = ['rock', 'paper', 'scissors'];
      const botChoice = choices[Math.floor(Math.random() * 3)];

      let result = 'draw';
      if (
        (choice === 'rock' && botChoice === 'scissors') ||
        (choice === 'paper' && botChoice === 'rock') ||
        (choice === 'scissors' && botChoice === 'paper')
      ) {
        result = 'win';
      } else if (choice !== botChoice) {
        result = 'lose';
      }

      const embed = new EmbedBuilder()
        .setColor(result === 'win' ? '#2ecc71' : result === 'lose' ? '#e74c3c' : '#f39c12')
        .setTitle('🎮 Rock-Paper-Scissors')
        .addFields(
          { name: 'Your Choice', value: choice.toUpperCase(), inline: true },
          { name: 'Bot Choice', value: botChoice.toUpperCase(), inline: true }
        )
        .setTimestamp();

      if (result === 'win') {
        const winnings = wager * 2;
        await EconomyManager.addMoney(interaction.user.id, wager, 'wallet');

        embed.setDescription(`**You Win!** 🎉 You earned $${EconomyManager.formatMoney(wager)}!`)
          .addField('New Balance', `$${EconomyManager.formatMoney(user.wallet + wager)}`, true);
      } else if (result === 'lose') {
        await EconomyManager.removeMoney(interaction.user.id, wager, 'wallet');

        embed.setDescription(`**You Lose!** 😢 You lost $${EconomyManager.formatMoney(wager)}.`)
          .addField('New Balance', `$${EconomyManager.formatMoney(user.wallet - wager)}`, true);
      } else {
        embed.setDescription(`**It's a Draw!** Your wager is returned.`)
          .addField('Balance', `$${EconomyManager.formatMoney(user.wallet)}`, true);
      }

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred during the game.', ephemeral: true });
    }
  }
};
