const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('forge_weapon')
    .setDescription('Forge a powerful weapon'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const cost = 2000;
      if (user.wallet < cost) {
        return interaction.reply({ content: `You need 💰 ${cost}`, ephemeral: true });
      }

      const weapons = ['Iron Sword', 'Steel Blade', 'Diamond Pickaxe', 'Golden Axe'];
      const weapon = weapons[Math.floor(Math.random() * weapons.length)];

      await EconomyManager.removeMoney(userId, cost);
      
      const embed = new EmbedBuilder()
        .setColor('#ff8800')
        .setTitle('⚒️ Weapon Forged!')
        .addFields(
          { name: 'Weapon', value: weapon },
          { name: 'Cost', value: `💰 ${cost}` },
          { name: 'Crafting Level', value: `${user.crafting.level}` }
        );

      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error forging weapon', ephemeral: true });
    }
  }
};
