const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const EconomyManager = require('../../utils/EconomyManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('raid_boss')
    .setDescription('Fight a raid boss with other players')
    .addIntegerOption(option =>
      option.setName('difficulty')
        .setDescription('Boss difficulty level (1-5)')
        .setMinValue(1)
        .setMaxValue(5)
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      const difficulty = interaction.options.getInteger('difficulty');
      
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const lastRaid = user.dungeon.lastRaidAttempt || new Date(0);
      const cooldown = 30 * 60 * 1000; // 30 minutes
      if (Date.now() - lastRaid.getTime() < cooldown) {
        return interaction.reply({ content: `⏰ Please wait before raiding again`, ephemeral: true });
      }

      const bosses = [
        { name: 'Goblin Minion', hp: 50, reward: 500, difficulty: 1 },
        { name: 'Orc Warrior', hp: 100, reward: 1200, difficulty: 2 },
        { name: 'Dragon Lord', hp: 200, reward: 2500, difficulty: 3 },
        { name: 'Shadow Demon', hp: 350, reward: 4000, difficulty: 4 },
        { name: 'Ancient God', hp: 500, reward: 6000, difficulty: 5 }
      ];

      const boss = bosses[difficulty - 1];
      const damage = Math.floor(Math.random() * 50) + 20;
      const playerHp = 100 + (user.level * 10);
      const bossHp = boss.hp;

      let currentBossHp = bossHp;
      let victory = false;
      let damageDealt = 0;

      // Simulate raid battle
      for (let i = 0; i < 5; i++) {
        damageDealt += damage;
        currentBossHp -= damage;
        if (currentBossHp <= 0) {
          victory = true;
          break;
        }
      }

      const embed = new EmbedBuilder()
        .setColor(victory ? '#00ff00' : '#ff0000')
        .setTitle(`⚔️ Raid Boss Battle: ${boss.name}`)
        .addFields(
          { name: 'Difficulty', value: `${difficulty}/5`, inline: true },
          { name: 'Boss HP', value: `${Math.max(0, currentBossHp)}/${bossHp}`, inline: true },
          { name: 'Your Damage', value: `${damageDealt}`, inline: true }
        );

      if (victory) {
        const reward = boss.reward * difficulty;
        await EconomyManager.addMoney(userId, reward);
        user.dungeon.raidBossDefeats += 1;
        user.dungeon.highestFloor = Math.max(user.dungeon.highestFloor, difficulty);
        embed.setDescription(`✅ **Victory!** You defeated ${boss.name}!\n\n💰 Reward: **${reward}** coins`);
      } else {
        embed.setDescription(`❌ **Defeat!** The boss was too strong...\n\nYou dealt ${damageDealt} damage.`);
      }

      user.dungeon.lastRaidAttempt = new Date();
      await user.save();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error during raid', ephemeral: true });
    }
  }
};
