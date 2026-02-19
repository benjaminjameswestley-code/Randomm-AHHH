const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('talent_tree')
    .setDescription('View and manage your talent tree'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('🌳 Talent Tree')
        .addFields(
          { name: 'Combat Branch', value: 'Power Attack ➜ Whirlwind ➜ Berserk' },
          { name: 'Magic Branch', value: 'Fireball ➜ Inferno ➜ Meteor Rain' },
          { name: 'Defense Branch', value: 'Shield ➜ Barrier ➜ Fortress' },
          { name: 'Utility Branch', value: 'Sprint ➜ Dash ➜ Teleport' },
          { name: 'Your Talents', value: `${(user.skills?.talents || []).length} Learned` }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error viewing talent tree', ephemeral: true });
    }
  }
};
