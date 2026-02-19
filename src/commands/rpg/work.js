const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EconomyManager = require('../../utils/EconomyManager');

const JOBS = [
  { name: 'McDonald\'s Employee', reward: 200 },
  { name: 'Software Engineer', reward: 1500 },
  { name: 'Janitor', reward: 150 },
  { name: 'CEO', reward: 5000 },
  { name: 'Teacher', reward: 800 }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work at a job to earn money')
    .addStringOption(option =>
      option.setName('job')
        .setDescription('Job type')
        .setRequired(false)
        .addChoices(
          { name: 'Random', value: 'random' },
          { name: 'Low Wage', value: 'low' },
          { name: 'Medium Wage', value: 'medium' },
          { name: 'High Wage', value: 'high' }
        )
    ),
  async execute(interaction) {
    try {
      const user = await EconomyManager.getOrCreateUser(interaction.user.id, interaction.user.username);
      const jobType = interaction.options.getString('job') || 'random';

      // Cooldown check (1 work per 45 seconds)
      if (user.lastWork && Date.now() - user.lastWork < 45000) {
        return await interaction.reply({
          content: `⏳ You need to rest! You can work again in ${Math.ceil((45000 - (Date.now() - user.lastWork)) / 1000)}s.`,
          ephemeral: true
        });
      }

      let job;
      if (jobType === 'random') {
        job = JOBS[Math.floor(Math.random() * JOBS.length)];
      } else if (jobType === 'low') {
        job = JOBS[Math.floor(Math.random() * 2)]; // Janitor or Employee
      } else if (jobType === 'medium') {
        job = JOBS[2]; // Teacher
      } else {
        job = JOBS[Math.floor(2 + Math.random() * 3)]; // Software Engineer or CEO
      }

      // Simple mini-game: remember the number
      const secretNumber = Math.floor(Math.random() * 100) + 1;

      const embed = new EmbedBuilder()
        .setColor('#f39c12')
        .setTitle(`💼 ${job.name}`)
        .setDescription(`You started working as a **${job.name}**!`)
        .addFields(
          { name: 'Wage', value: `$${job.reward}`, inline: true },
          { name: 'Status', value: 'Working...', inline: true }
        )
        .setFooter({ text: 'Remember a random number for the mini-game to complete your shift!' })
        .setTimestamp();

      // Send initial message
      await interaction.reply({ embeds: [embed] });

      // Simulate work delay
      await new Promise(r => setTimeout(r, Math.random() * 3000 + 2000));

      // 75% success rate
      const success = Math.random() < 0.75;

      if (success) {
        await EconomyManager.addMoney(interaction.user.id, job.reward, 'wallet');
        
        user.workStreak += 1;
        user.level = Math.floor(user.experience / 100) + 1;
        user.experience += 50;
        user.lastWork = new Date();
        await user.save();

        const resultEmbed = new EmbedBuilder()
          .setColor('#2ecc71')
          .setTitle('✅ Shift Complete!')
          .setDescription(`You earned $${job.reward} from your shift!`)
          .addFields(
            { name: 'Work Streak', value: `${user.workStreak}`, inline: true },
            { name: 'Experience', value: `+50 XP`, inline: true }
          )
          .setTimestamp();

        await interaction.followUp({ embeds: [resultEmbed] });
      } else {
        user.workStreak = 0;
        user.lastWork = new Date();
        await user.save();

        const resultEmbed = new EmbedBuilder()
          .setColor('#e74c3c')
          .setTitle('❌ Shift Failed')
          .setDescription(`You were docked for poor performance! No payment this time.`)
          .setTimestamp();

        await interaction.followUp({ embeds: [resultEmbed] });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while working.', ephemeral: true });
    }
  }
};
