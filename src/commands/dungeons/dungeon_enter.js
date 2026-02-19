const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dungeon_enter')
    .setDescription('Enter a dungeon and explore'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const currentFloor = user.dungeon.currentFloor;
      const maxFloor = Math.min(10, Math.floor(user.level / 5) + 1);

      if (currentFloor >= maxFloor) {
        return interaction.reply({ content: `You've reached the maximum floor (${maxFloor}) for your level!`, ephemeral: true });
      }

      const rewards = [];
      const loot = Math.random() * 500 + 200;
      rewards.push(Math.floor(loot));

      user.dungeon.currentFloor += 1;

      const embed = new EmbedBuilder()
        .setColor('#7289da')
        .setTitle('🏰 Dungeon Exploration')
        .setDescription(`You venture deeper into the dungeon...`)
        .addFields(
          { name: 'Floor', value: `${user.dungeon.currentFloor}/${maxFloor}`, inline: true },
          { name: 'Loot Found', value: `💰 ${Math.floor(loot)} coins`, inline: true },
          { name: 'Progress', value: `${((user.dungeon.currentFloor / maxFloor) * 100).toFixed(0)}%` }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error entering dungeon', ephemeral: true });
    }
  }
};
