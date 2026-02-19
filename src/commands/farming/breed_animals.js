const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('breed_animals')
    .setDescription('Breed animals on your farm for resources'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const animals = ['Chickens', 'Cows', 'Sheep', 'Pigs'];
      const animal = animals[Math.floor(Math.random() * animals.length)];
      const count = Math.floor(Math.random() * 5) + 1;

      if (!user.farmingStats.pets) user.farmingStats.pets = [];
      user.farmingStats.pets.push({ type: animal, count, breedDate: new Date() });

      const embed = new EmbedBuilder()
        .setColor('#aa6600')
        .setTitle('🐄 Animals Bred!')
        .addFields(
          { name: 'Animal', value: animal },
          { name: 'Offspring', value: `${count}` },
          { name: 'Total Farm Animals', value: `${user.farmingStats.pets.length}` }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error breeding animals', ephemeral: true });
    }
  }
};
