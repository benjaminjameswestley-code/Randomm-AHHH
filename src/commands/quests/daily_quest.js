const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily_quest')
    .setDescription('Get a new daily quest'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const questTypes = [
        { name: 'Fish 5 times', target: 5, reward: 500, type: 'fishing' },
        { name: 'Mine 3 times', target: 3, reward: 400, type: 'mining' },
        { name: 'Work 4 times', target: 4, reward: 450, type: 'working' },
        { name: 'Hunt 2 times', target: 2, reward: 350, type: 'hunting' },
        { name: 'Earn 1000 coins', target: 1000, reward: 800, type: 'earning' }
      ];

      const quest = questTypes[Math.floor(Math.random() * questTypes.length)];
      if (!user.quests) user.quests = { activeQuests: [], completedQuests: [], totalCompleted: 0 };

      user.quests.activeQuests.push({
        questId: `${userId}-${Date.now()}`,
        name: quest.name,
        description: `Complete the ${quest.type} task`,
        progress: 0,
        target: quest.target,
        reward: quest.reward,
        startedAt: new Date()
      });

      const embed = new EmbedBuilder()
        .setColor('#ffaa00')
        .setTitle('📜 New Quest Available!')
        .addFields(
          { name: 'Quest', value: quest.name },
          { name: 'Target', value: `${quest.target}` },
          { name: 'Reward', value: `💰 ${quest.reward}` }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error getting quest', ephemeral: true });
    }
  }
};
