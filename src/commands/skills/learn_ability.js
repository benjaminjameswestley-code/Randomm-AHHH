const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('learn_ability')
    .setDescription('Learn a new special ability'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const abilities = ['Fireball', 'Ice Storm', 'Lightning Strike', 'Heal', 'Teleport', 'Shield Bash'];
      const ability = abilities[Math.floor(Math.random() * abilities.length)];

      if (!user.skills) user.skills = { skillLevels: {}, talents: [], prestigeLevel: 0 };
      if (!user.skills.talents) user.skills.talents = [];

      if (user.skills.talents.includes(ability)) {
        return interaction.reply({ content: `You already know ${ability}!`, ephemeral: true });
      }

      user.skills.talents.push(ability);

      const embed = new EmbedBuilder()
        .setColor('#ff00ff')
        .setTitle('✨ New Ability Learned!')
        .addFields(
          { name: 'Ability', value: ability },
          { name: 'Total Abilities', value: `${user.skills.talents.length}` }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error learning ability', ephemeral: true });
    }
  }
};
