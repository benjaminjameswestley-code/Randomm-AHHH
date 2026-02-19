const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Market = require('../../models/Market');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('market')
    .setDescription('Browse the player marketplace!')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Item to search for')
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      const searchItem = interaction.options.getString('item');

      let query = { expiresAt: { $gt: new Date() } };
      if (searchItem) {
        query.itemName = new RegExp(searchItem, 'i');
      }

      const listings = await Market.find(query).limit(10).sort({ createdAt: -1 });

      if (listings.length === 0) {
        return await interaction.reply({
          content: '🏪 No items listed in the marketplace right now.',
          ephemeral: true
        });
      }

      let description = '';
      listings.forEach((listing, index) => {
        const rarityEmojis = { legendary: '⭐', epic: '💜', rare: '💙', uncommon: '💚', common: '⚪' };
        description += `**${index + 1}. ${listing.itemName}** ${rarityEmojis[listing.rarity] || '❓'}\n`;
        description += `   Qty: ${listing.quantity} | Price: $${listing.pricePerUnit}/ea | Total: $${listing.pricePerUnit * listing.quantity}\n`;
        description += `   Seller: ${listing.sellerUsername}\n\n`;
      });

      const embed = new EmbedBuilder()
        .setColor('#f39c12')
        .setTitle(`🏪 Marketplace${searchItem ? ` - ${searchItem}` : ''}`)
        .setDescription(description || 'No listings found')
        .setFooter({ text: `Showing ${listings.length} listings` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred.', ephemeral: true });
    }
  }
};
