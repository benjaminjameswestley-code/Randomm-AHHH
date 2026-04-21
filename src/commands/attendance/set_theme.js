const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { loadTheme, setTheme, getAllThemes } = require("../../utils/theme");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set_theme")
    .setDescription("Change the bot theme for this server (admin only)")
    .addStringOption(option => {
      const themes = getAllThemes();
      const choices = themes.map(t => ({ name: t, value: t }));
      return option
        .setName("theme")
        .setDescription("Choose a theme")
        .setRequired(true)
        .addChoices(...choices);
    }),

  async execute(interaction) {
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF6B6B")
            .setTitle("Permission Denied")
            .setDescription("Only server admins can change themes.")
            .setTimestamp()
        ],
        flags: 64,
      });
    }

    const themeName = interaction.options.getString("theme");
    const theme = setTheme(interaction.guildId, themeName);

    const embed = new EmbedBuilder()
      .setColor(theme.colors.success)
      .setTitle("✅ Theme Changed")
      .setDescription(`Server theme changed to **${theme.name}**`)
      .addFields(
        {
          name: "Colors",
          value: `Primary: ${theme.colors.primary}\nSuccess: ${theme.colors.success}\nError: ${theme.colors.error}`,
          inline: false,
        },
        {
          name: "Preview",
          value: `${theme.emojis.attending} Attending | ${theme.emojis.maybe} Maybe | ${theme.emojis.not_attending} Not Attending`,
          inline: false,
        }
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
