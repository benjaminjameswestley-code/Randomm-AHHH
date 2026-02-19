const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View player profile!')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to view')
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      const targetUser = interaction.options.getUser('user') || interaction.user;
      const user = await EconomyManager.getOrCreateUser(targetUser.id, targetUser.username);

      const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setTitle(`👤 ${user.username}'s Profile`)
        .setThumbnail(targetUser.displayAvatarURL())
        .addFields(
          { name: 'Level', value: `${user.level}`, inline: true },
          { name: 'Experience', value: `${user.experience}`, inline: true },
          { name: 'Net Worth', value: `$${EconomyManager.formatMoney(user.wallet + user.bank)}`, inline: true },
          { name: 'Wallet', value: `$${EconomyManager.formatMoney(user.wallet)}`, inline: true },
          { name: 'Bank', value: `$${EconomyManager.formatMoney(user.bank)}`, inline: true },
          { name: 'Items', value: `${user.items.length}`, inline: true },
          { name: 'Fish Caught', value: `${user.fishingStats.totalCaught}`, inline: true },
          { name: 'Hunted', value: `${user.hunted}`, inline: true },
          { name: 'Joined', value: `<t:${Math.floor(user.createdAt.getTime() / 1000)}:R>`, inline: true }
        )
        .setFooter({ text: `ID: ${user.userId}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred.', ephemeral: true });
    }
  }
};
