const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('complete_quest')
    .setDescription('Complete a quest')
    .addIntegerOption(option =>
      option.setName('quest_number')
        .setDescription('Quest number to complete')
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      const questNum = interaction.options.getInteger('quest_number') || 1;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      if (!user.quests || user.quests.activeQuests.length === 0) {
        return interaction.reply({ content: 'You have no active quests!', ephemeral: true });
      }

      if (questNum > user.quests.activeQuests.length) {
        return interaction.reply({ content: 'Invalid quest number!', ephemeral: true });
      }

      const quest = user.quests.activeQuests[questNum - 1];
      if (quest.progress < quest.target) {
        return interaction.reply({ content: `Quest not complete! Progress: ${quest.progress}/${quest.target}`, ephemeral: true });
      }

      await EconomyManager.addMoney(userId, quest.reward);
      user.quests.completedQuests.push(quest.questId);
      user.quests.totalCompleted += 1;
      user.quests.activeQuests.splice(questNum - 1, 1);

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('✅ Quest Complete!')
        .addFields(
          { name: 'Quest', value: quest.name },
          { name: 'Reward', value: `💰 ${quest.reward}`, inline: true },
          { name: 'Total Completed', value: `${user.quests.totalCompleted}`, inline: true }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error completing quest', ephemeral: true });
    }
  }
};
