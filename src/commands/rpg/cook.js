const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EconomyManager = require('../../utils/EconomyManager');

const RECIPES = [
  { name: 'Simple Stew', ingredients: ['Berries', 'Water'], value: 300, time: 10 },
  { name: 'Herb Bread', ingredients: ['Herbs', 'Flour'], value: 500, time: 15 },
  { name: 'Mushroom Pie', ingredients: ['Mushrooms', 'Dough'], value: 800, time: 20 },
  { name: 'Legendary Feast', ingredients: ['Rare Petals', 'Ancient Spices'], value: 2500, time: 30 }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cook')
    .setDescription('Cook items to earn money!')
    .addNumberOption(option =>
      option.setName('recipe')
        .setDescription('Recipe number (1-4)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(4)
    ),
  async execute(interaction) {
    try {
      const user = await EconomyManager.getOrCreateUser(interaction.user.id, interaction.user.username);
      const recipeNum = Math.floor(interaction.options.getNumber('recipe')) - 1;
      const recipe = RECIPES[recipeNum];

      // Cooldown check (1 cook per 60 seconds)
      if (user.lastCook && Date.now() - user.lastCook < 60000) {
        return await interaction.reply({
          content: `⏳ You're still cooking! Wait before cooking again.`,
          ephemeral: true
        });
      }

      await interaction.reply(`👨‍🍳 Cooking **${recipe.name}**...`);

      // Simulate cooking time
      await new Promise(r => setTimeout(r, recipe.time * 100));

      // 80% success rate
      const success = Math.random() < 0.8;

      if (success) {
        const bonus = Math.floor(Math.random() * recipe.value * 0.2);
        const total = recipe.value + bonus;

        await EconomyManager.addMoney(interaction.user.id, total, 'wallet');
        user.lastCook = new Date();
        await user.save();

        const embed = new EmbedBuilder()
          .setColor('#2ecc71')
          .setTitle('✅ Cooking Success!')
          .setDescription(`You cooked a delicious **${recipe.name}**!`)
          .addFields(
            { name: 'Base Value', value: `$${recipe.value}`, inline: true },
            { name: 'Bonus', value: `$${bonus}`, inline: true },
            { name: 'Total', value: `$${total}`, inline: true }
          )
          .setTimestamp();

        await interaction.followUp({ embeds: [embed] });
      } else {
        user.lastCook = new Date();
        await user.save();

        const embed = new EmbedBuilder()
          .setColor('#e74c3c')
          .setTitle('❌ Cooking Failed')
          .setDescription(`You burned the ${recipe.name}! Better luck next time.`)
          .setTimestamp();

        await interaction.followUp({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while cooking.', ephemeral: true });
    }
  }
};
