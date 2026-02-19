const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ImageManager = require('../../utils/ImageManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Get a random meme!')
    .addStringOption(option =>
      option.setName('source')
        .setDescription('Where to get the meme from')
        .setRequired(false)
        .addChoices(
          { name: 'Reddit', value: 'reddit' },
          { name: 'Imgflip', value: 'imgflip' }
        )
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const meme = await ImageManager.fetchRandomMeme();

      if (!meme) {
        return await interaction.editReply({ content: 'Failed to fetch meme. Try again later.' });
      }

      const embed = new EmbedBuilder()
        .setColor('#f39c12')
        .setTitle('😂 Random Meme')
        .setImage(meme.url || meme.image_url)
        .setFooter({ text: meme.title || 'Meme' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: 'An error occurred while fetching the meme.' });
    }
  }
};
