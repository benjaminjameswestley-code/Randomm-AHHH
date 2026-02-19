const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('duel')
    .setDescription('Challenge another user to a duel for cash!')
    .addUserOption(option =>
      option.setName('opponent')
        .setDescription('User to duel')
        .setRequired(true)
    )
    .addNumberOption(option =>
      option.setName('wager')
        .setDescription('Amount to wager')
        .setRequired(true)
        .setMinValue(100)
    ),
  async execute(interaction) {
    try {
      const opponent = interaction.options.getUser('opponent');
      const wager = Math.floor(interaction.options.getNumber('wager'));

      if (opponent.id === interaction.user.id) {
        return await interaction.reply({
          content: '❌ You cannot duel yourself!',
          ephemeral: true
        });
      }

      if (opponent.bot) {
        return await interaction.reply({
          content: '❌ You cannot duel a bot!',
          ephemeral: true
        });
      }

      const attacker = await EconomyManager.getOrCreateUser(interaction.user.id, interaction.user.username);
      const defender = await EconomyManager.getOrCreateUser(opponent.id, opponent.username);

      // Check both have enough money
      if (attacker.wallet < wager) {
        return await interaction.reply({
          content: `❌ You don't have $${EconomyManager.formatMoney(wager)} to wager!`,
          ephemeral: true
        });
      }

      if (defender.wallet < wager) {
        return await interaction.reply({
          content: `❌ ${opponent.username} doesn't have $${EconomyManager.formatMoney(wager)} to wager!`,
          ephemeral: true
        });
      }

      // Combat system with level advantage
      const attackerStrength = attacker.level * 20 + Math.floor(Math.random() * 100);
      const defenderStrength = defender.level * 20 + Math.floor(Math.random() * 100);

      const attackerWins = attackerStrength > defenderStrength;

      if (attackerWins) {
        await EconomyManager.addMoney(interaction.user.id, wager, 'wallet');
        await EconomyManager.removeMoney(opponent.id, wager, 'wallet');
      } else {
        await EconomyManager.removeMoney(interaction.user.id, wager, 'wallet');
        await EconomyManager.addMoney(opponent.id, wager, 'wallet');
      }

      const winner = attackerWins ? interaction.user : opponent;
      const loser = attackerWins ? opponent : interaction.user;

      const embed = new EmbedBuilder()
        .setColor('#f39c12')
        .setTitle('⚔️💰 Duel Results!')
        .addFields(
          { name: `${interaction.user.username}`, value: `Strength: ${attackerStrength}`, inline: true },
          { name: `${opponent.username}`, value: `Strength: ${defenderStrength}`, inline: true },
          { name: 'Winner', value: winner.username, inline: false },
          { name: 'Prize', value: `$${EconomyManager.formatMoney(wager)}`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred during the duel.', ephemeral: true });
    }
  }
};
