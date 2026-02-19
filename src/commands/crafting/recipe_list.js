const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('recipe_list')
    .setDescription('View all available recipes'),
  async execute(interaction) {
    try {
      const embed = new EmbedBuilder()
        .setColor('#8b4513')
        .setTitle('📖 Crafting Recipes')
        .addFields(
          { name: 'Iron Sword', value: '500 coins', inline: true },
          { name: 'Steel Blade', value: '750 coins', inline: true },
          { name: 'Golden Armor', value: '1000 coins', inline: true },
          { name: 'Diamond Pickaxe', value: '1500 coins', inline: true },
          { name: 'Enchanted Wand', value: '2000 coins', inline: true },
          { name: 'Legendary Weapon', value: '5000 coins', inline: true }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error fetching recipes', ephemeral: true });
    }
  }
};
