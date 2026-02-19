const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EconomyManager = require('../../utils/EconomyManager');

const TRIVIA_QUESTIONS = [
  { question: 'What is the capital of France?', answer: 'paris', options: ['London', 'Berlin', 'Paris', 'Madrid'] },
  { question: 'What is 2 + 2?', answer: '4', options: ['3', '4', '5', '6'] },
  { question: 'What planet is closest to the Sun?', answer: 'mercury', options: ['Venus', 'Mercury', 'Earth', 'Mars'] },
  { question: 'What color is the sky on a clear day?', answer: 'blue', options: ['Red', 'Blue', 'Green', 'Yellow'] },
  { question: 'Which element has the atomic number 1?', answer: 'hydrogen', options: ['Oxygen', 'Hydrogen', 'Carbon', 'Nitrogen'] }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('Answer trivia questions to win cash!')
    .addNumberOption(option =>
      option.setName('wager')
        .setDescription('Amount to wager')
        .setRequired(true)
        .setMinValue(50)
    ),
  async execute(interaction) {
    try {
      const user = await EconomyManager.getOrCreateUser(interaction.user.id, interaction.user.username);
      const wager = Math.floor(interaction.options.getNumber('wager'));

      if (user.wallet < wager) {
        return await interaction.reply({
          content: `❌ You don't have enough money! You have $${EconomyManager.formatMoney(user.wallet)}.`,
          ephemeral: true
        });
      }

      const trivia = TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)];

      const embed = new EmbedBuilder()
        .setColor('#9b59b6')
        .setTitle('❓ Trivia Question')
        .setDescription(trivia.question)
        .addFields(
          { name: 'Options', value: trivia.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n') },
          { name: 'Wager', value: `$${EconomyManager.formatMoney(wager)}` }
        )
        .setFooter({ text: 'Respond with the number of your answer in the next message!' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

      // Collect response
      const filter = m => m.author.id === interaction.user.id;
      const collected = await interaction.channel.awaitMessages({ filter, time: 15000, max: 1 });

      if (collected.size === 0) {
        return await interaction.followUp({
          content: `⏰ Time's up! You lost $${EconomyManager.formatMoney(wager)}.`,
          ephemeral: true
        });
      }

      const answer = collected.first().content.trim();
      const answerIndex = parseInt(answer) - 1;

      if (isNaN(answerIndex) || answerIndex < 0 || answerIndex >= trivia.options.length) {
        return await interaction.followUp({
          content: `❌ Invalid answer! You lost $${EconomyManager.formatMoney(wager)}.`,
          ephemeral: true
        });
      }

      const isCorrect = trivia.options[answerIndex].toLowerCase().includes(trivia.answer);

      if (isCorrect) {
        await EconomyManager.addMoney(interaction.user.id, wager * 2, 'wallet');

        const resultEmbed = new EmbedBuilder()
          .setColor('#2ecc71')
          .setTitle('✅ Correct!')
          .setDescription(`You won $${EconomyManager.formatMoney(wager * 2)}!`)
          .setTimestamp();

        await interaction.followUp({ embeds: [resultEmbed] });
      } else {
        await EconomyManager.removeMoney(interaction.user.id, wager, 'wallet');

        const resultEmbed = new EmbedBuilder()
          .setColor('#e74c3c')
          .setTitle('❌ Wrong Answer')
          .setDescription(`The correct answer was **${trivia.answer}**. You lost $${EconomyManager.formatMoney(wager)}.`)
          .setTimestamp();

        await interaction.followUp({ embeds: [resultEmbed] });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred during the trivia game.', ephemeral: true });
    }
  }
};
