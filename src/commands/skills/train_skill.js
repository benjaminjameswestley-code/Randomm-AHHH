const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('train_skill')
    .setDescription('Train a specific skill to improve')
    .addStringOption(option =>
      option.setName('skill')
        .setDescription('Skill to train')
        .addChoices(
          { name: 'Combat', value: 'combat' },
          { name: 'Magic', value: 'magic' },
          { name: 'Crafting', value: 'crafting' },
          { name: 'Farming', value: 'farming' },
          { name: 'Fishing', value: 'fishing' }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      const skill = interaction.options.getString('skill');
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      if (!user.skills) user.skills = { skillLevels: {}, talents: [], prestigeLevel: 0 };
      
      user.skills.skillLevels[skill] = (user.skills.skillLevels[skill] || 1) + 1;
      const newLevel = user.skills.skillLevels[skill];

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`⚡ ${skill.charAt(0).toUpperCase() + skill.slice(1)} Training`)
        .addFields(
          { name: 'New Level', value: `${newLevel}`, inline: true },
          { name: 'XP Gained', value: `+100 XP`, inline: true }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error training skill', ephemeral: true });
    }
  }
};
