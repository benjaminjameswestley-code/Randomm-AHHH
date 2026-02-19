const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset_skills')
    .setDescription('Reset your skills (costly operation)'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const cost = 5000;
      if (user.wallet < cost) {
        return interaction.reply({ content: `You need 💰 ${cost} to reset skills!`, ephemeral: true });
      }

      user.wallet -= cost;
      if (!user.skills) user.skills = { skillLevels: {}, talents: [], prestigeLevel: 0 };
      
      Object.keys(user.skills.skillLevels).forEach(skill => {
        user.skills.skillLevels[skill] = 1;
      });

      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('🔄 Skills Reset!')
        .addFields(
          { name: 'Reset Cost', value: `💰 ${cost}` },
          { name: 'All Skills', value: 'Reset to Level 1' }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error resetting skills', ephemeral: true });
    }
  }
};
