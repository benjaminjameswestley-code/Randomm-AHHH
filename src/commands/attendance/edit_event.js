const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("edit_event")
    .setDescription("Edit an existing event")
    .addStringOption(option =>
      option.setName("event_id")
        .setDescription("The event ID to edit")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("title")
        .setDescription("New event title")
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName("description")
        .setDescription("New event description")
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName("event_date")
        .setDescription("New event date (YYYY-MM-DD HH:mm)")
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName("deadline")
        .setDescription("New deadline (YYYY-MM-DD HH:mm)")
        .setRequired(false)
    ),

  async execute(interaction, { data, saveData }) {
    const guildId = interaction.guildId;
    const eventId = interaction.options.getString("event_id");
    const newTitle = interaction.options.getString("title");
    const newDescription = interaction.options.getString("description");
    const newEventDate = interaction.options.getString("event_date");
    const newDeadline = interaction.options.getString("deadline");

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
    const changedFields = [];

    if (newTitle && newTitle !== event.title) {
      event.title = newTitle;
      changedFields.push(`**Title:** ${newTitle}`);
    }

    if (newDescription && newDescription !== event.description) {
      event.description = newDescription;
      changedFields.push(`**Description:** ${newDescription}`);
    }

    if (newEventDate) {
      const eventTime = new Date(newEventDate);
      if (isNaN(eventTime)) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF6B6B")
              .setTitle("Invalid Date Format")
              .setDescription("Use format: YYYY-MM-DD HH:mm")
              .setTimestamp()
          ],
          flags: 64,
        });
      }
      event.eventDate = eventTime.toISOString();
      changedFields.push(`**Event Date:** <t:${Math.floor(eventTime / 1000)}:F>`);
    }

    if (newDeadline) {
      const deadlineTime = new Date(newDeadline);
      if (isNaN(deadlineTime)) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF6B6B")
              .setTitle("Invalid Date Format")
              .setDescription("Use format: YYYY-MM-DD HH:mm")
              .setTimestamp()
          ],
          flags: 64,
        });
      }
      event.deadline = deadlineTime.toISOString();
      changedFields.push(`**Deadline:** <t:${Math.floor(deadlineTime / 1000)}:F>`);
    }

    if (changedFields.length === 0) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF9F43")
            .setTitle("No Changes")
            .setDescription("You must provide at least one field to edit.")
            .setTimestamp()
        ],
        flags: 64,
      });
    }

    saveData(data);

    const embed = new EmbedBuilder()
      .setColor("#26D07C")
      .setTitle("✅ Event Updated")
      .setDescription(`Updated event: **${event.title}**`)
      .addFields(
        { name: "Changes", value: changedFields.join("\n"), inline: false },
        { name: "Event ID", value: `\`${eventId}\``, inline: true }
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
