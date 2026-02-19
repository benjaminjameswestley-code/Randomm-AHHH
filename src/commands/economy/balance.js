const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your wallet and bank balance')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to check balance for')
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      const targetUser = interaction.options.getUser('user') || interaction.user;
      const user = await EconomyManager.getOrCreateUser(targetUser.id, targetUser.username);

      const networth = user.wallet + user.bank;

      const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setTitle(`💰 ${user.username}'s Balance`)
        .addFields(
          { name: 'Wallet', value: `$${EconomyManager.formatMoney(user.wallet)}`, inline: true },
          { name: 'Bank', value: `$${EconomyManager.formatMoney(user.bank)}`, inline: true },
          { name: 'Net Worth', value: `$${EconomyManager.formatMoney(networth)}`, inline: false },
          { name: 'Level', value: `${user.level}`, inline: true },
          { name: 'Experience', value: `${user.experience}`, inline: true }
        )
        .setThumbnail(targetUser.displayAvatarURL())
        .setFooter({ text: `Requested by ${interaction.user.username}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while checking balance.', ephemeral: true });
    }
  }
};
