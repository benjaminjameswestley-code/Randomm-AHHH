const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fight')
    .setDescription('Challenge another user to a battle!')
    .addUserOption(option =>
      option.setName('opponent')
        .setDescription('User to fight')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const opponent = interaction.options.getUser('opponent');

      if (opponent.id === interaction.user.id) {
        return await interaction.reply({
          content: '❌ You cannot fight yourself!',
          ephemeral: true
        });
      }

      if (opponent.bot) {
        return await interaction.reply({
          content: '❌ You cannot fight a bot!',
          ephemeral: true
        });
      }

      const attacker = await EconomyManager.getOrCreateUser(interaction.user.id, interaction.user.username);
      const defender = await EconomyManager.getOrCreateUser(opponent.id, opponent.username);

      // Simple combat system
      const attackerStrength = attacker.level * 10 + Math.floor(Math.random() * 50);
      const defenderStrength = defender.level * 10 + Math.floor(Math.random() * 50);

      const attackerWins = attackerStrength > defenderStrength;
      const winner = attackerWins ? interaction.user.username : opponent.username;
      const loser = attackerWins ? opponent.username : interaction.user.username;

      const damage = Math.abs(attackerStrength - defenderStrength);

      const embed = new EmbedBuilder()
        .setColor(attackerWins ? '#2ecc71' : '#e74c3c')
        .setTitle('⚔️ Battle Results!')
        .addFields(
          { name: `${interaction.user.username}`, value: `Strength: ${attackerStrength}`, inline: true },
          { name: `${opponent.username}`, value: `Strength: ${defenderStrength}`, inline: true },
          { name: 'Winner', value: winner, inline: false },
          { name: 'Damage Dealt', value: `${damage}`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred during battle.', ephemeral: true });
    }
  }
};
