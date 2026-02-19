const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skill_list')
    .setDescription('View all your skills and abilities'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🎓 Your Skills')
        .addFields(
          { name: 'Combat', value: `Level ${user.skills?.skillLevels?.combat || 1}`, inline: true },
          { name: 'Magic', value: `Level ${user.skills?.skillLevels?.magic || 1}`, inline: true },
          { name: 'Crafting', value: `Level ${user.skills?.skillLevels?.crafting || 1}`, inline: true },
          { name: 'Farming', value: `Level ${user.skills?.skillLevels?.farming || 1}`, inline: true },
          { name: 'Fishing', value: `Level ${user.skills?.skillLevels?.fishing || 1}`, inline: true },
          { name: 'Prestige Level', value: `${user.skills?.prestigeLevel || 0}` }
        );

      if (user.skills?.talents && user.skills.talents.length > 0) {
        embed.addFields({
          name: 'Special Abilities',
          value: user.skills.talents.join(', ')
        });
      }

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error fetching skills', ephemeral: true });
    }
  }
};
