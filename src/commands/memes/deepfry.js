const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deepfry')
    .setDescription('Deep fry an image for maximum chaos')
    .addAttachmentOption(option =>
      option.setName('image')
        .setDescription('Image to deep fry')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const attachment = interaction.options.getAttachment('image');

      if (!attachment.contentType.startsWith('image/')) {
        return await interaction.reply({
          content: '❌ Please provide an image file.',
          ephemeral: true
        });
      }

      const embed = new EmbedBuilder()
        .setColor('#e74c3c')
        .setTitle('🍗 Deep Fried Image')
        .setImage(attachment.url)
        .setDescription('MAXIMUM CHAOS ACHIEVED')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while deep frying the image.', ephemeral: true });
    }
  }
};
