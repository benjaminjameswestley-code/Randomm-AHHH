const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("event_stats")
    .setDescription("View detailed statistics for an event")
    .addStringOption(option =>
      option.setName("event_id")
        .setDescription("The event ID to view stats for")
        .setRequired(true)
    ),

  async execute(interaction, { data }) {
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
    const attendanceData = event.attendance;

    const attending = Object.values(attendanceData).filter(a => a.status === "attending");
    const maybe = Object.values(attendanceData).filter(a => a.status === "maybe");
    const notAttending = Object.values(attendanceData).filter(a => a.status === "not_attending");
    const total = attending.length + maybe.length + notAttending.length;

    const eventTime = new Date(event.eventDate);
    const createdTime = new Date(event.createdAt);

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle(event.title)
      .setDescription(event.description || "No description")
      .addFields(
        {
          name: "📊 Summary",
          value: `Total Responses: **${total}**\n✅ Attending: **${attending.length}** (${total > 0 ? Math.round((attending.length / total) * 100) : 0}%)\n❓ Maybe: **${maybe.length}** (${total > 0 ? Math.round((maybe.length / total) * 100) : 0}%)\n❌ Not Attending: **${notAttending.length}** (${total > 0 ? Math.round((notAttending.length / total) * 100) : 0}%)`,
          inline: false,
        },
        {
          name: "📅 Dates",
          value: `**Event:** <t:${Math.floor(eventTime / 1000)}:F>\n**Created:** <t:${Math.floor(createdTime / 1000)}:R>`,
          inline: false,
        }
      );

    if (attending.length > 0) {
      const attendeeList = attending
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .slice(0, 10)
        .map((a, i) => `${i + 1}. **${a.username}**`)
        .join("\n");

      embed.addFields({
        name: `✅ Attending (${attending.length})`,
        value: attendeeList + (attending.length > 10 ? `\n...and ${attending.length - 10} more` : ""),
        inline: true,
      });
    }

    if (maybe.length > 0) {
      const maybeList = maybe
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .slice(0, 10)
        .map((a, i) => `${i + 1}. **${a.username}**`)
        .join("\n");

      embed.addFields({
        name: `❓ Maybe (${maybe.length})`,
        value: maybeList + (maybe.length > 10 ? `\n...and ${maybe.length - 10} more` : ""),
        inline: true,
      });
    }

    if (notAttending.length > 0) {
      const notAttendList = notAttending
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .slice(0, 10)
        .map((a, i) => `${i + 1}. **${a.username}**`)
        .join("\n");

      embed.addFields({
        name: `❌ Not Attending (${notAttending.length})`,
        value: notAttendList + (notAttending.length > 10 ? `\n...and ${notAttending.length - 10} more` : ""),
        inline: true,
      });
    }

    embed.setFooter({ text: `Event ID: ${event.id}` }).setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
