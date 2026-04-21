const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create_recurring_event")
    .setDescription("Create a recurring attendance event")
    .addStringOption(option =>
      option.setName("title")
        .setDescription("Event title")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("start_date")
        .setDescription("Start date (YYYY-MM-DD HH:mm)")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("frequency")
        .setDescription("Repeat frequency")
        .setRequired(true)
        .addChoices(
          { name: "Daily", value: "daily" },
          { name: "Weekly", value: "weekly" },
          { name: "Bi-weekly", value: "biweekly" },
          { name: "Monthly", value: "monthly" }
        )
    )
    .addIntegerOption(option =>
      option.setName("occurrences")
        .setDescription("Number of times to repeat (1-52)")
        .setMinValue(1)
        .setMaxValue(52)
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("deadline_minutes")
        .setDescription("Minutes before event to close RSVP (default: 30)")
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName("description")
        .setDescription("Event description")
        .setRequired(false)
    ),

  async execute(interaction, { data, saveData }) {
    const guildId = interaction.guildId;
    const title = interaction.options.getString("title");
    const startDate = interaction.options.getString("start_date");
    const frequency = interaction.options.getString("frequency");
    const occurrences = interaction.options.getInteger("occurrences");
    const deadlineMinutes = interaction.options.getInteger("deadline_minutes") || 30;
    const description = interaction.options.getString("description") || "No description";

    const startTime = new Date(startDate);
    if (isNaN(startTime)) {
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

    if (!data[guildId]) {
      data[guildId] = { events: {} };
    }

    const createdEvents = [];
    const frequencyDays = { daily: 1, weekly: 7, biweekly: 14, monthly: 30 };
    const daysToAdd = frequencyDays[frequency];

    for (let i = 0; i < occurrences; i++) {
      const eventTime = new Date(startTime);
      eventTime.setDate(eventTime.getDate() + daysToAdd * i);

      const deadlineTime = new Date(eventTime);
      deadlineTime.setMinutes(deadlineTime.getMinutes() - deadlineMinutes);

      const eventId = Date.now().toString() + i;

      data[guildId].events[eventId] = {
        id: eventId,
        title: `${title} #${i + 1}`,
        description,
        eventDate: eventTime.toISOString(),
        deadline: deadlineTime.toISOString(),
        roles: [],
        attendance: {},
        createdAt: new Date().toISOString(),
        createdBy: interaction.user.id,
        isRecurring: true,
        recurrencePattern: frequency,
        occurrenceNumber: i + 1,
      };

      createdEvents.push({
        id: eventId,
        date: eventTime,
      });
    }

    saveData(data);

    const eventList = createdEvents
      .slice(0, 5)
      .map((e, i) => `${i + 1}. <t:${Math.floor(e.date / 1000)}:F>`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle(`✅ ${occurrences}x Recurring Event Created`)
      .setDescription(`**${title}** - ${frequency.charAt(0).toUpperCase() + frequency.slice(1)}`)
      .addFields(
        {
          name: "Pattern",
          value: `Every ${frequency === "biweekly" ? "2 weeks" : frequency} for ${occurrences} times`,
          inline: false,
        },
        {
          name: "First 5 Dates",
          value: eventList + (createdEvents.length > 5 ? "\n..." : ""),
          inline: false,
        },
        {
          name: "RSVP Deadline",
          value: `${deadlineMinutes} minutes before each event`,
          inline: true,
        }
      )
      .setFooter({ text: `Total events created: ${occurrences}` })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
