const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clan_war')
    .setDescription('Start or join a clan war'),
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

      const won = Math.random() > 0.5;
      if (won) user.clanWars.warsWon += 1;
      else user.clanWars.warsLost += 1;

      const embed = new EmbedBuilder()
        .setColor(won ? '#00ff00' : '#ff0000')
        .setTitle(`${won ? '✅ Clan War Won!' : '❌ Clan War Lost!'}`)
        .addFields(
          { name: 'Clan', value: user.guild.name },
          { name: 'Wars Won', value: `${user.clanWars.warsWon}`, inline: true },
          { name: 'Wars Lost', value: `${user.clanWars.warsLost}`, inline: true }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error in clan war', ephemeral: true });
    }
  }
};
