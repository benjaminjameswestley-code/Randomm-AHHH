const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EconomyManager = require('../../utils/EconomyManager');

const FISH_TYPES = [
  { name: 'Common Fish', value: 50, rarity: 'common' },
  { name: 'Bass', value: 200, rarity: 'uncommon' },
  { name: 'Rare Catfish', value: 500, rarity: 'rare' },
  { name: 'Golden Koi', value: 1500, rarity: 'epic' },
  { name: 'Legendary Dragon Fish', value: 5000, rarity: 'legendary' }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fish')
    .setDescription('Go fishing for valuable catches!')
    .addStringOption(option =>
      option.setName('location')
        .setDescription('Where to fish')
        .setRequired(false)
        .addChoices(
          { name: 'River', value: 'river' },
          { name: 'Ocean', value: 'ocean' },
          { name: 'Lake', value: 'lake' },
          { name: 'Secret Spot', value: 'secret' }
        )
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const user = await EconomyManager.getOrCreateUser(interaction.user.id, interaction.user.username);
      const location = interaction.options.getString('location') || 'river';

      // Cooldown check (1 fish per 30 seconds per user)
      if (user.lastFish && Date.now() - user.lastFish < 30000) {
        return await interaction.editReply({
          content: `⏳ You're tired from fishing! Wait a bit before fishing again.`,
          ephemeral: true
        });
      }

      // Simulate fishing with animation
      const messages = ['🎣 Casting line...', '🎣 Waiting for a bite...', '🎣 Something\'s nibbling...'];
      let currentMessage = await interaction.editReply(messages[0]);

      for (let i = 1; i < messages.length; i++) {
        await new Promise(r => setTimeout(r, 1000));
        currentMessage = await currentMessage.edit(messages[i]);
      }

      // Determine what was caught
      const catchChance = Math.random();
      const locationModifier = {
        river: 0.5,
        ocean: 0.7,
        lake: 0.6,
        secret: 0.9
      };

      const isSuccess = catchChance < (locationModifier[location] || 0.5);

      if (isSuccess) {
        const fish = FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)];
        const reward = fish.value;

        await EconomyManager.addMoney(interaction.user.id, reward, 'wallet');
        await EconomyManager.addItem(interaction.user.id, `fish_${fish.name.toLowerCase()}`, fish.name, 1, fish.rarity);

        user.fishingStats.totalCaught += 1;
        user.fishingStats.totalFished += 1;
        user.fishingStats.streak += 1;
        user.lastFish = new Date();
        await user.save();

        const embed = new EmbedBuilder()
          .setColor('#3498db')
          .setTitle('🎣 Great Catch!')
          .setDescription(`You caught a **${fish.name}**!`)
          .addFields(
            { name: 'Rarity', value: fish.rarity.toUpperCase(), inline: true },
            { name: 'Value', value: `$${fish.value}`, inline: true },
            { name: 'Catch Streak', value: `${user.fishingStats.streak}`, inline: true }
          )
          .setTimestamp();

        await currentMessage.edit({ content: null, embeds: [embed] });
      } else {
        user.fishingStats.totalFished += 1;
        user.fishingStats.streak = 0;
        user.lastFish = new Date();
        await user.save();

        const embed = new EmbedBuilder()
          .setColor('#e74c3c')
          .setTitle('❌ Nothing Caught')
          .setDescription(`The fish weren't biting at the ${location}. Maybe try another spot?`)
          .setTimestamp();

        await currentMessage.edit({ content: null, embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: 'An error occurred while fishing.', ephemeral: true });
    }
  }
};
