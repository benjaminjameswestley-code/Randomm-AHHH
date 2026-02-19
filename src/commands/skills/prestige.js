const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prestige')
    .setDescription('Prestige to reset skills and gain rewards'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      if (!user.skills || !user.skills.skillLevels || Object.values(user.skills.skillLevels).every(l => l < 10)) {
        return interaction.reply({ content: 'Your skills are not high enough to prestige!', ephemeral: true });
      }

      user.skills.prestigeLevel = (user.skills.prestigeLevel || 0) + 1;
      Object.keys(user.skills.skillLevels).forEach(skill => {
        user.skills.skillLevels[skill] = 1;
      });

      const bonus = user.skills.prestigeLevel * 1000;

      const embed = new EmbedBuilder()
        .setColor('#ffaa00')
        .setTitle('👑 Prestige Achieved!')
        .addFields(
          { name: 'New Prestige Level', value: `${user.skills.prestigeLevel}` },
          { name: 'Bonus Reward', value: `💰 ${bonus}` },
          { name: 'Skills Reset', value: 'All skills reset to 1' }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error with prestige', ephemeral: true });
    }
  }
};
