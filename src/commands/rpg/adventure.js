const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EconomyManager = require('../../utils/EconomyManager');

const ADVENTURES = [
  {
    title: 'Dragon\'s Lair',
    options: [
      { choice: 'Fight the dragon', reward: 3000, rarity: 'epic' },
      { choice: 'Sneak past it', reward: 1500, rarity: 'rare' },
      { choice: 'Run away', reward: 200, rarity: 'common' }
    ]
  },
  {
    title: 'Mysterious Cave',
    options: [
      { choice: 'Go deeper', reward: 2000, rarity: 'rare' },
      { choice: 'Turn back', reward: 500, rarity: 'common' },
      { choice: 'Look for treasure', reward: 5000, rarity: 'legendary' }
    ]
  },
  {
    title: 'Haunted Mansion',
    options: [
      { choice: 'Enter the main hall', reward: 1000, rarity: 'uncommon' },
      { choice: 'Search the cellar', reward: 4000, rarity: 'epic' },
      { choice: 'Flee immediately', reward: 0, rarity: 'common' }
    ]
  }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('adventure')
    .setDescription('Embark on a risky adventure to find treasure!')
    .addNumberOption(option =>
      option.setName('risk_level')
        .setDescription('Risk level (1-5, higher = more reward but more risk)')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(5)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const user = await EconomyManager.getOrCreateUser(interaction.user.id, interaction.user.username);
      const riskLevel = interaction.options.getNumber('risk_level') || 3;

      // Cooldown check
      if (user.lastAdventure && Date.now() - user.lastAdventure < 60000) {
        return await interaction.editReply({
          content: `⏳ You need to recover from your last adventure! Wait a bit.`,
          ephemeral: true
        });
      }

      const adventure = ADVENTURES[Math.floor(Math.random() * ADVENTURES.length)];

      const embed = new EmbedBuilder()
        .setColor('#9b59b6')
        .setTitle(`⚔️ ${adventure.title}`)
        .setDescription('Choose your path wisely...')
        .addFields(
          { name: 'Risk Level', value: `${'⭐'.repeat(riskLevel)}`, inline: false }
        );

      // Create buttons or choices for adventure
      const randomChoice = adventure.options[Math.floor(Math.random() * adventure.options.length)];
      const baseReward = randomChoice.reward;
      const finalReward = Math.floor(baseReward * (1 + (riskLevel / 10))); // Risk level increases reward

      // Success chance based on risk level
      const successChance = Math.max(0.3, 1 - (riskLevel / 10));
      const success = Math.random() < successChance;

      if (success) {
        await EconomyManager.addMoney(interaction.user.id, finalReward, 'wallet');
        await EconomyManager.addItem(interaction.user.id, `item_${adventure.title.toLowerCase()}`, `${adventure.title} Loot`, 1, randomChoice.rarity);

        user.level = Math.floor(user.experience / 100) + 1;
        user.experience += 100;
        user.lastAdventure = new Date();
        await user.save();

        const resultEmbed = new EmbedBuilder()
          .setColor('#2ecc71')
          .setTitle('✅ Adventure Successful!')
          .setDescription(`You chose to **${randomChoice.choice}** and it paid off!`)
          .addFields(
            { name: 'You Found', value: `$${finalReward}`, inline: true },
            { name: 'Rarity', value: randomChoice.rarity.toUpperCase(), inline: true },
            { name: 'Level', value: `${user.level}`, inline: true }
          )
          .setTimestamp();

        await interaction.editReply({ embeds: [resultEmbed] });
      } else {
        const loss = Math.floor(user.wallet * 0.1); // Lose 10% of wallet on failure
        if (loss > 0) {
          await EconomyManager.removeMoney(interaction.user.id, loss, 'wallet');
        }

        user.lastAdventure = new Date();
        await user.save();

        const resultEmbed = new EmbedBuilder()
          .setColor('#e74c3c')
          .setTitle('❌ Adventure Failed!')
          .setDescription(`Your choice to **${randomChoice.choice}** did not go as planned...`)
          .addFields(
            { name: 'You Lost', value: `$${loss}`, inline: true }
          )
          .setTimestamp();

        await interaction.editReply({ embeds: [resultEmbed] });
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: 'An error occurred during the adventure.', ephemeral: true });
    }
  }
};
