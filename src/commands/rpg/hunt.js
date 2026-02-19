const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EconomyManager = require('../../utils/EconomyManager');

const ANIMALS = [
  { name: 'Rabbit', value: 100, rarity: 'common' },
  { name: 'Deer', value: 300, rarity: 'uncommon' },
  { name: 'Bear', value: 800, rarity: 'rare' },
  { name: 'Tiger', value: 2000, rarity: 'epic' },
  { name: 'Phoenix', value: 10000, rarity: 'legendary' }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hunt')
    .setDescription('Go hunting for rare animals!')
    .addStringOption(option =>
      option.setName('terrain')
        .setDescription('Where to hunt')
        .setRequired(false)
        .addChoices(
          { name: 'Forest', value: 'forest' },
          { name: 'Mountain', value: 'mountain' },
          { name: 'Plains', value: 'plains' },
          { name: 'Swamp', value: 'swamp' }
        )
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const user = await EconomyManager.getOrCreateUser(interaction.user.id, interaction.user.username);
      const terrain = interaction.options.getString('terrain') || 'forest';

      // Cooldown check (1 hunt per 60 seconds)
      if (user.lastHunt && Date.now() - user.lastHunt < 60000) {
        return await interaction.editReply({
          content: `⏳ You're exhausted from hunting! Wait before hunting again.`,
          ephemeral: true
        });
      }

      await interaction.editReply('🏹 Tracking prey...');

      // Terrain modifiers
      const terrainModifier = {
        forest: 0.6,
        mountain: 0.4,
        plains: 0.7,
        swamp: 0.5
      };

      const huntSuccess = Math.random() < (terrainModifier[terrain] || 0.5);

      if (huntSuccess) {
        const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
        const reward = animal.value;

        await EconomyManager.addMoney(interaction.user.id, reward, 'wallet');
        await EconomyManager.addItem(interaction.user.id, `animal_${animal.name.toLowerCase()}`, animal.name, 1, animal.rarity);

        user.hunted += 1;
        user.lastHunt = new Date();
        await user.save();

        const embed = new EmbedBuilder()
          .setColor('#27ae60')
          .setTitle('🏹 Successful Hunt!')
          .setDescription(`You hunted a **${animal.name}**!`)
          .addFields(
            { name: 'Rarity', value: animal.rarity.toUpperCase(), inline: true },
            { name: 'Value', value: `$${animal.value}`, inline: true },
            { name: 'Total Hunted', value: `${user.hunted}`, inline: true }
          )
          .setTimestamp();

        await interaction.editReply({ content: null, embeds: [embed] });
      } else {
        user.lastHunt = new Date();
        await user.save();

        const embed = new EmbedBuilder()
          .setColor('#e74c3c')
          .setTitle('❌ Hunt Failed')
          .setDescription(`No animals found in the ${terrain}. Your presence scared them away!`)
          .setTimestamp();

        await interaction.editReply({ content: null, embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: 'An error occurred while hunting.', ephemeral: true });
    }
  }
};
