const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('boss_info')
    .setDescription('Get information about raid bosses'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const bosses = [
        { name: 'Goblin Minion', hp: 50, reward: 500, difficulty: 1, description: 'A weak boss for beginners' },
        { name: 'Orc Warrior', hp: 100, reward: 1200, difficulty: 2, description: 'A strong green warrior' },
        { name: 'Dragon Lord', hp: 200, reward: 2500, difficulty: 3, description: 'Master of flames' },
        { name: 'Shadow Demon', hp: 350, reward: 4000, difficulty: 4, description: 'Creature of darkness' },
        { name: 'Ancient God', hp: 500, reward: 6000, difficulty: 5, description: 'Ultimate challenge' }
      ];

      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('⚔️ Raid Bosses')
        .setDescription('Available bosses and their rewards');

      bosses.forEach(boss => {
        embed.addFields({
          name: `${boss.name} (Difficulty ${boss.difficulty}/5)`,
          value: `HP: ${boss.hp} | Reward: ${boss.reward * boss.difficulty} coins\n${boss.description}`,
          inline: false
        });
      });

      embed.addFields({
        name: 'Your Stats',
        value: `Bosses Defeated: ${user.dungeon.raidBossDefeats}\nHighest Difficulty: ${user.dungeon.highestFloor}`
      });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error fetching boss info', ephemeral: true });
    }
  }
};
