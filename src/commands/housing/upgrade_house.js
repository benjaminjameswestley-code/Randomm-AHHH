const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('upgrade_house')
    .setDescription('Upgrade your house to the next tier'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      if (user.house.value === 0) {
        return interaction.reply({ content: 'You must buy a house first!', ephemeral: true });
      }

      if (user.house.tier >= 5) {
        return interaction.reply({ content: 'Your house is already at maximum tier!', ephemeral: true });
      }

      const upgradeCost = 5000 * user.house.tier;
      if (user.wallet < upgradeCost) {
        return interaction.reply({ content: `You need 💰 ${upgradeCost} to upgrade. You have ${user.wallet}.`, ephemeral: true });
      }

      await EconomyManager.removeMoney(userId, upgradeCost);
      user.house.tier += 1;
      user.house.value += upgradeCost;

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🏡 House Upgraded!')
        .addFields(
          { name: 'New Tier', value: `${user.house.tier}/5`, inline: true },
          { name: 'Upgrade Cost', value: `💰 ${upgradeCost}`, inline: true },
          { name: 'Property Value', value: `💰 ${user.house.value}`, inline: true }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error upgrading house', ephemeral: true });
    }
  }
};
