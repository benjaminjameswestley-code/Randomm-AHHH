const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clan_perks')
    .setDescription('View clan perks and bonuses'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      if (!user.guild || !user.guild.name) {
        return interaction.reply({ content: 'You must be in a clan!' });
      }

      const embed = new EmbedBuilder()
        .setColor('#aa00ff')
        .setTitle('🎁 Clan Perks')
        .setDescription(`${user.guild.name} Clan Benefits`)
        .addFields(
          { name: 'XP Bonus', value: '+10% to all activities' },
          { name: 'Treasury Earnings', value: '+15% weekly income' },
          { name: 'War Bonuses', value: '+25% damage in clan wars' },
          { name: 'Member Limit', value: `${user.guild.members?.length || 1}/50 members` }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error fetching perks', ephemeral: true });
    }
  }
};
