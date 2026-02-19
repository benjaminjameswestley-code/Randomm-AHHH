const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EconomyManager = require('../../utils/EconomyManager');

const ITEMS = [
  { name: 'Wild Berries', value: 100, rarity: 'common', emoji: '🫐' },
  { name: 'Mushrooms', value: 250, rarity: 'uncommon', emoji: '🍄' },
  { name: 'Herbs', value: 400, rarity: 'rare', emoji: '🌿' },
  { name: 'Rare Petals', value: 1000, rarity: 'epic', emoji: '🌺' },
  { name: 'Moonflower', value: 3000, rarity: 'legendary', emoji: '🌙' }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('forage')
    .setDescription('Forage for wild items in nature!')
    .addStringOption(option =>
      option.setName('biome')
        .setDescription('Where to forage')
        .setRequired(false)
        .addChoices(
          { name: 'Forest', value: 'forest' },
          { name: 'Meadow', value: 'meadow' },
          { name: 'Mountain', value: 'mountain' }
        )
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const user = await EconomyManager.getOrCreateUser(interaction.user.id, interaction.user.username);
      const biome = interaction.options.getString('biome') || 'forest';

      // Cooldown check (1 forage per 30 seconds)
      if (user.lastForage && Date.now() - user.lastForage < 30000) {
        return await interaction.editReply({
          content: `⏳ You need to rest! Wait before foraging again.`,
          ephemeral: true
        });
      }

      await interaction.editReply('🔍 Foraging...');

      const biomeModifier = {
        forest: 0.7,
        meadow: 0.8,
        mountain: 0.5
      };

      const success = Math.random() < (biomeModifier[biome] || 0.7);

      if (success) {
        const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        const amount = item.value * (0.7 + Math.random() * 0.6);

        await EconomyManager.addMoney(interaction.user.id, Math.floor(amount), 'wallet');
        await EconomyManager.addItem(interaction.user.id, `forage_${item.name.toLowerCase()}`, item.name, 1, item.rarity);

        user.lastForage = new Date();
        await user.save();

        const embed = new EmbedBuilder()
          .setColor('#27ae60')
          .setTitle('🍄 Foraging Success!')
          .setDescription(`You found **${item.name}**! ${item.emoji}`)
          .addFields(
            { name: 'Location', value: biome.toUpperCase(), inline: true },
            { name: 'Value', value: `$${Math.floor(amount)}`, inline: true },
            { name: 'Rarity', value: item.rarity.toUpperCase(), inline: true }
          )
          .setTimestamp();

        await interaction.editReply({ content: null, embeds: [embed] });
      } else {
        user.lastForage = new Date();
        await user.save();

        const embed = new EmbedBuilder()
          .setColor('#e74c3c')
          .setTitle('❌ Nothing Found')
          .setDescription(`No items found in the ${biome} today.`)
          .setTimestamp();

        await interaction.editReply({ content: null, embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: 'An error occurred while foraging.', ephemeral: true });
    }
  }
};
