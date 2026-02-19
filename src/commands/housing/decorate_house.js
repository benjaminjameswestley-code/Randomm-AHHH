const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('decorate_house')
    .setDescription('Add decorations to your house'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      if (user.house.value === 0) {
        return interaction.reply({ content: 'You must buy a house first!', ephemeral: true });
      }

      const decorations = ['🎨 Painting', '🪴 Plant', '💡 Lamp', '🛋️ Couch', '🛏️ Bed', '🪑 Chair', '📚 Bookcase', '🏺 Vase'];
      const decoration = decorations[Math.floor(Math.random() * decorations.length)];
      
      if (!user.house.decorations) user.house.decorations = [];
      user.house.decorations.push(decoration);

      const embed = new EmbedBuilder()
        .setColor('#ff99ff')
        .setTitle('✨ Decoration Added!')
        .addFields(
          { name: 'Added', value: decoration },
          { name: 'Total Decorations', value: `${user.house.decorations.length}` },
          { name: 'Your Decorations', value: user.house.decorations.join(', ') || 'None' }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error adding decoration', ephemeral: true });
    }
  }
};
