const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('View your item inventory!')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to view')
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      const targetUser = interaction.options.getUser('user') || interaction.user;
      const user = await User.findOne({ userId: targetUser.id });

      if (!user) {
        return await interaction.reply({
          content: '❌ User not found!',
          ephemeral: true
        });
      }

      if (user.items.length === 0) {
        return await interaction.reply({
          content: '📭 Inventory is empty!',
          ephemeral: true
        });
      }

      // Group items by rarity
      const itemsByRarity = {};
      user.items.forEach(item => {
        if (!itemsByRarity[item.rarity]) {
          itemsByRarity[item.rarity] = [];
        }
        itemsByRarity[item.rarity].push(item);
      });

      const rarityEmojis = {
        legendary: '⭐',
        epic: '💜',
        rare: '💙',
        uncommon: '💚',
        common: '⚪'
      };

      let description = '';
      const rarityOrder = ['legendary', 'epic', 'rare', 'uncommon', 'common'];

      rarityOrder.forEach(rarity => {
        if (itemsByRarity[rarity]) {
          description += `\n**${rarityEmojis[rarity]} ${rarity.toUpperCase()}**\n`;
          itemsByRarity[rarity].forEach(item => {
            description += `• ${item.name} x${item.quantity}\n`;
          });
        }
      });

      const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setTitle(`🎒 ${user.username}'s Inventory`)
        .setDescription(description || 'Empty inventory')
        .setFooter({ text: `Total Items: ${user.items.length}` })
        .setThumbnail(targetUser.displayAvatarURL())
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred.', ephemeral: true });
    }
  }
};
