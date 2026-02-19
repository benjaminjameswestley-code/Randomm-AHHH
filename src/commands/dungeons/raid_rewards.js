const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('raid_rewards')
    .setDescription('Check your raid boss rewards and statistics'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const totalRewards = user.dungeon.raidBossDefeats * 2500; // Average reward
      const embed = new EmbedBuilder()
        .setColor('#ffd700')
        .setTitle('👑 Raid Rewards')
        .setDescription('Your raid boss achievements and rewards')
        .addFields(
          { name: 'Bosses Defeated', value: `${user.dungeon.raidBossDefeats}`, inline: true },
          { name: 'Highest Floor', value: `${user.dungeon.highestFloor}/5`, inline: true },
          { name: 'Total Rewards Earned', value: `💰 ${totalRewards}`, inline: true },
          { name: 'Last Raid', value: user.dungeon.lastRaidAttempt ? `<t:${Math.floor(user.dungeon.lastRaidAttempt.getTime() / 1000)}:R>` : 'Never' }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error fetching rewards', ephemeral: true });
    }
  }
};
