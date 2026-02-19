const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('auction_house')
    .setDescription('Browse the player auction house'),
  async execute(interaction) {
    try {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('🛒 Auction House')
        .setDescription('Player listings available for purchase')
        .addFields(
          { name: 'Legendary Sword', value: 'Seller: Player1 | Price: 💰 5000' },
          { name: 'Rare Gem', value: 'Seller: Player2 | Price: 💰 2000' },
          { name: 'Epic Armor', value: 'Seller: Player3 | Price: 💰 3500' },
          { name: 'Magic Scroll', value: 'Seller: Player4 | Price: 💰 1500' }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error accessing auction house', ephemeral: true });
    }
  }
};
