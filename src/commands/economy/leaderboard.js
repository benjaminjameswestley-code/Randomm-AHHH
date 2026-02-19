const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the global wealth leaderboard')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Leaderboard type')
        .setRequired(false)
        .addChoices(
          { name: 'Net Worth', value: 'networth' },
          { name: 'Wallet', value: 'wallet' },
          { name: 'Bank', value: 'bank' },
          { name: 'Level', value: 'level' }
        )
    ),
  async execute(interaction) {
    try {
      const type = interaction.options.getString('type') || 'networth';
      const leaderboard = await EconomyManager.getGlobalLeaderboard(type, 10);

      let description = '';
      leaderboard.forEach((user, index) => {
        const rank = index + 1;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}️⃣`;
        
        let value;
        if (type === 'networth') {
          value = `$${EconomyManager.formatMoney(user.wallet + user.bank)}`;
        } else if (type === 'wallet') {
          value = `$${EconomyManager.formatMoney(user.wallet)}`;
        } else if (type === 'bank') {
          value = `$${EconomyManager.formatMoney(user.bank)}`;
        } else if (type === 'level') {
          value = `Level ${user.level}`;
        }

        description += `${medal} **${user.username}** - ${value}\n`;
      });

      const embed = new EmbedBuilder()
        .setColor('#9b59b6')
        .setTitle(`📊 ${type.charAt(0).toUpperCase() + type.slice(1)} Leaderboard`)
        .setDescription(description)
        .setFooter({ text: 'Top 10 Users' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while fetching the leaderboard.', ephemeral: true });
    }
  }
};
