const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EconomyManager = require('../../utils/EconomyManager');

const ORES = [
  { name: 'Copper Ore', value: 150, rarity: 'common', emoji: '🥉' },
  { name: 'Iron Ore', value: 300, rarity: 'uncommon', emoji: '⚙️' },
  { name: 'Gold Ore', value: 750, rarity: 'rare', emoji: '⭐' },
  { name: 'Diamond', value: 2000, rarity: 'epic', emoji: '💎' },
  { name: 'Mythril', value: 5000, rarity: 'legendary', emoji: '✨' }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mine')
    .setDescription('Mine ore for money (pickaxe required)!')
    .addStringOption(option =>
      option.setName('depth')
        .setDescription('How deep to mine')
        .setRequired(false)
        .addChoices(
          { name: 'Shallow', value: 'shallow' },
          { name: 'Deep', value: 'deep' },
          { name: 'Very Deep', value: 'verydeep' }
        )
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const user = await EconomyManager.getOrCreateUser(interaction.user.id, interaction.user.username);
      const depth = interaction.options.getString('depth') || 'shallow';

      // Cooldown check (1 mine per 40 seconds)
      if (user.lastMine && Date.now() - user.lastMine < 40000) {
        return await interaction.editReply({
          content: `⏳ You're tired from mining! Wait before mining again.`,
          ephemeral: true
        });
      }

      await interaction.editReply('⛏ Mining...');

      // Depth modifier affects success rate and ore quality
      const depthModifier = {
        shallow: 0.8,  // 80% success, basic ores
        deep: 0.6,     // 60% success, better ores
        verydeep: 0.3  // 30% success, legendary ores
      };

      const successRate = depthModifier[depth] || 0.8;
      const success = Math.random() < successRate;

      if (success) {
        const depthIndex = depth === 'verydeep' ? 4 : depth === 'deep' ? 2 : 1;
        const orePool = ORES.slice(depthIndex, depthIndex + 2);
        const ore = orePool[Math.floor(Math.random() * orePool.length)];
        const amount = ore.value * (0.8 + Math.random() * 0.4); // Variable amounts

        await EconomyManager.addMoney(interaction.user.id, Math.floor(amount), 'wallet');
        await EconomyManager.addItem(interaction.user.id, `ore_${ore.name.toLowerCase()}`, ore.name, 1, ore.rarity);

        user.lastMine = new Date();
        await user.save();

        const embed = new EmbedBuilder()
          .setColor('#f39c12')
          .setTitle('⛏ Successful Mine!')
          .setDescription(`You mined **${ore.name}**! ${ore.emoji}`)
          .addFields(
            { name: 'Depth', value: depth.toUpperCase(), inline: true },
            { name: 'Value', value: `$${Math.floor(amount)}`, inline: true },
            { name: 'Rarity', value: ore.rarity.toUpperCase(), inline: true }
          )
          .setTimestamp();

        await interaction.editReply({ content: null, embeds: [embed] });
      } else {
        user.lastMine = new Date();
        await user.save();

        const embed = new EmbedBuilder()
          .setColor('#e74c3c')
          .setTitle('❌ Mining Failed')
          .setDescription(`Your pickaxe broke! No ore found at ${depth} depth.`)
          .setTimestamp();

        await interaction.editReply({ content: null, embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: 'An error occurred while mining.', ephemeral: true });
    }
  }
};
