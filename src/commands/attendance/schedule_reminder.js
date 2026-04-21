const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("schedule_reminder")
    .setDescription("Schedule automatic reminders for an event")
    .addStringOption(option =>
      option.setName("event_id")
        .setDescription("The event ID")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("minutes_before")
        .setDescription("Minutes before event to send reminder (default: 60)")
        .setMinValue(5)
        .setMaxValue(1440)
        .setRequired(false)
    ),

  async execute(interaction, { data, client }) {
    const guildId = interaction.guildId;
    const eventId = interaction.options.getString("event_id");
    const minutesBefore = interaction.options.getInteger("minutes_before") || 60;

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
    const eventTime = new Date(event.eventDate);
    const reminderTime = new Date(eventTime.getTime() - minutesBefore * 60000);

    if (reminderTime <= new Date()) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF6B6B")
            .setTitle("Invalid Reminder Time")
            .setDescription("Reminder time must be in the future.")
            .setTimestamp()
        ],
        flags: 64,
      });
    }

    // Schedule the reminder using the scheduler utility
    const { scheduleEventReminder } = require("../../utils/scheduler");
    await scheduleEventReminder(client, guildId, eventId, event, minutesBefore);

    const embed = new EmbedBuilder()
      .setColor("#26D07C")
      .setTitle("✅ Reminder Scheduled")
      .setDescription(`Reminder scheduled for **${event.title}**`)
      .addFields(
        {
          name: "Event Time",
          value: `<t:${Math.floor(eventTime / 1000)}:F>`,
          inline: true,
        },
        {
          name: "Reminder Time",
          value: `<t:${Math.floor(reminderTime / 1000)}:F>`,
          inline: true,
        },
        {
          name: "Time Until Reminder",
          value: `<t:${Math.floor(reminderTime / 1000)}:R>`,
          inline: false,
        }
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
