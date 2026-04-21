const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete_event")
    .setDescription("Delete an event (creator or admin only)")
    .addStringOption(option =>
      option.setName("event_id")
        .setDescription("The event ID to delete")
        .setRequired(true)
    ),

  async execute(interaction, { data, saveData }) {
    const guildId = interaction.guildId;
    const eventId = interaction.options.getString("event_id");

    if (!data[guildId]?.events?.[eventId]) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF6B6B")
            .setTitle("Event Not Found")
            .setDescription(`Event with ID \`${eventId}\` not found.`)
            .setTimestamp()
        ],
        flags: 64,
      });
    }

    const event = data[guildId].events[eventId];
    const isCreator = event.createdBy === interaction.user.id;
    const isAdmin = interaction.member.permissions.has("ADMINISTRATOR");

    if (!isCreator && !isAdmin) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF6B6B")
            .setTitle("Permission Denied")
            .setDescription("Only the event creator or server admins can delete events.")
            .setTimestamp()
        ],
        flags: 64,
      });
    }

    const eventTitle = event.title;
    delete data[guildId].events[eventId];
    saveData(data);

    const embed = new EmbedBuilder()
      .setColor("#FF6B6B")
      .setTitle("✅ Event Deleted")
      .setDescription(`Deleted event: **${eventTitle}**`)
      .setFooter({ text: `Event ID: ${eventId}` })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
