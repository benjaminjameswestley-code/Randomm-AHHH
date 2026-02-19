const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Rob another user\'s wallet (high risk, high reward!)')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('User to rob')
        .setRequired(true)
    )
    .addNumberOption(option =>
      option.setName('amount')
        .setDescription('Amount to attempt to rob')
        .setRequired(true)
        .setMinValue(100)
    ),
  async execute(interaction) {
    try {
      const targetUser = interaction.options.getUser('target');
      const amount = Math.floor(interaction.options.getNumber('amount'));

      if (targetUser.id === interaction.user.id) {
        return await interaction.reply({
          content: '❌ You cannot rob yourself!',
          ephemeral: true
        });
      }

      if (targetUser.bot) {
        return await interaction.reply({
          content: '❌ You cannot rob a bot!',
          ephemeral: true
        });
      }

      const robber = await EconomyManager.getOrCreateUser(interaction.user.id, interaction.user.username);
      const victim = await EconomyManager.getOrCreateUser(targetUser.id, targetUser.username);

      if (victim.wallet < amount) {
        return await interaction.reply({
          content: `❌ ${targetUser.username} only has $${EconomyManager.formatMoney(victim.wallet)} in their wallet!`,
          ephemeral: true
        });
      }

      // 60% success rate
      const successChance = Math.random();
      const successRate = 0.6;

      if (successChance < successRate) {
        // Success!
        const stolen = amount;
        await EconomyManager.removeMoney(targetUser.id, stolen, 'wallet');
        await EconomyManager.addMoney(interaction.user.id, stolen, 'wallet');

        robber.rob.successCount += 1;
        await robber.save();

        const embed = new EmbedBuilder()
          .setColor('#f39c12')
          .setTitle('💰 Robbery Successful!')
          .setDescription(`You successfully robbed ${targetUser.username}!`)
          .addFields(
            { name: 'Amount Stolen', value: `$${EconomyManager.formatMoney(stolen)}`, inline: true },
            { name: 'Your New Wallet', value: `$${EconomyManager.formatMoney(robber.wallet + stolen)}`, inline: true }
          )
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } else {
        // Failed!
        const penalty = Math.floor(amount * 0.3); // Lose 30% of attempted amount as fine
        await EconomyManager.removeMoney(interaction.user.id, penalty, 'wallet');

        robber.rob.failureCount += 1;
        await robber.save();

        const embed = new EmbedBuilder()
          .setColor('#e74c3c')
          .setTitle('❌ Robbery Failed!')
          .setDescription(`You got caught trying to rob ${targetUser.username}! You were fined $${EconomyManager.formatMoney(penalty)}.`)
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred during the robbery.', ephemeral: true });
    }
  }
};
