const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bankrob')
    .setDescription('Team up to rob the bank! (Multiplayer heist)')
    .addNumberOption(option =>
      option.setName('amount')
        .setDescription('Amount to attempt to steal')
        .setRequired(true)
        .setMinValue(1000)
    ),
  async execute(interaction) {
    try {
      const amount = Math.floor(interaction.options.getNumber('amount'));

      const robber = await EconomyManager.getOrCreateUser(interaction.user.id, interaction.user.username);

      // Need to have at least 10% of the heist amount in wallet
      const minimumRequired = Math.floor(amount * 0.1);
      if (robber.wallet < minimumRequired) {
        return await interaction.reply({
          content: `❌ You need at least $${EconomyManager.formatMoney(minimumRequired)} to attempt a bank heist!`,
          ephemeral: true
        });
      }

      // Remove the heist fee upfront
      await EconomyManager.removeMoney(interaction.user.id, minimumRequired, 'wallet');

      // Lower success rate with larger amounts (30-80%)
      const successRate = Math.max(0.3, 0.8 - (amount / 100000));
      const successChance = Math.random();

      if (successChance < successRate) {
        // Success!
        const reward = Math.floor(amount * 1.5); // 150% return on successful heist
        await EconomyManager.addMoney(interaction.user.id, reward, 'wallet');

        const embed = new EmbedBuilder()
          .setColor('#2ecc71')
          .setTitle('🏦 Bank Heist Successful!')
          .setDescription(`You successfully robbed the bank and escaped with the loot!`)
          .addFields(
            { name: 'Heist Target', value: `$${EconomyManager.formatMoney(amount)}`, inline: true },
            { name: 'Actual Reward', value: `$${EconomyManager.formatMoney(reward)}`, inline: true },
            { name: 'Heist Fee', value: `$${EconomyManager.formatMoney(minimumRequired)}`, inline: true }
          )
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } else {
        // Failed!
        const totalLoss = minimumRequired * 2; // Lose 2x the heist fee on failure
        await EconomyManager.removeMoney(interaction.user.id, minimumRequired, 'wallet');

        const embed = new EmbedBuilder()
          .setColor('#e74c3c')
          .setTitle('❌ Bank Heist Failed!')
          .setDescription(`You got caught! The authorities seized additional funds as penalty.`)
          .addFields(
            { name: 'Initial Fee Lost', value: `$${EconomyManager.formatMoney(minimumRequired)}`, inline: true },
            { name: 'Penalty Seized', value: `$${EconomyManager.formatMoney(minimumRequired)}`, inline: true },
            { name: 'Total Loss', value: `$${EconomyManager.formatMoney(totalLoss)}`, inline: false }
          )
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred during the bank heist.', ephemeral: true });
    }
  }
};
