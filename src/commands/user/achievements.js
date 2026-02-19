const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

const ACHIEVEMENTS = [
  { id: 'first_job', name: 'First Shift', description: 'Complete your first work job', icon: '💼' },
  { id: 'millionaire', name: 'Millionaire', description: 'Reach $1,000,000 net worth', icon: '💰' },
  { id: 'fisher', name: 'Master Fisher', description: 'Catch 50 fish', icon: '🎣' },
  { id: 'hunter', name: 'Great Hunter', description: 'Hunt 50 animals', icon: '🏹' },
  { id: 'gambler', name: 'High Roller', description: 'Win a game with $1000+ wager', icon: '🎰' },
  { id: 'lucky', name: 'Lucky', description: 'Win 10 games in a row', icon: '🍀' },
  { id: 'thief', name: 'Master Thief', description: 'Successfully rob 20 users', icon: '🕵️' }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('achievements')
    .setDescription('View achievements!')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to view')
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      const targetUser = interaction.options.getUser('user') || interaction.user;
      const user = await User.findOne({ userId: targetUser.id });

      if (!user) {
        return await interaction.reply({
          content: '❌ User not found!',
          ephemeral: true
        });
      }

      const userAchievements = user.achievements || [];

      let description = '';
      ACHIEVEMENTS.forEach(achievement => {
        const hasAchievement = userAchievements.includes(achievement.id);
        const status = hasAchievement ? `${achievement.icon} ✅` : `⬜`;
        description += `${status} **${achievement.name}** - ${achievement.description}\n`;
      });

      const embed = new EmbedBuilder()
        .setColor('#9b59b6')
        .setTitle(`🏆 ${user.username}'s Achievements`)
        .setDescription(description)
        .addField('Progress', `${userAchievements.length}/${ACHIEVEMENTS.length}`, true)
        .setThumbnail(targetUser.displayAvatarURL())
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred.', ephemeral: true });
    }
  }
};
