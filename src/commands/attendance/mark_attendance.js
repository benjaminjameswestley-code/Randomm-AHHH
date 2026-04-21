const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mark_attendance")
    .setDescription("Mark your attendance for an event")
    .addStringOption(option =>
      option.setName("event_id")
        .setDescription("The event ID to mark attendance for")
        .setRequired(false)
    ),

  async execute(interaction, { data, saveData }) {
    const guildId = interaction.guildId;
    const userId = interaction.user.id;
    const eventIdParam = interaction.options.getString("event_id");

    if (!data[guildId] || !data[guildId].events) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF6B6B")
            .setTitle("No Events Found")
            .setDescription("There are no events in this server.")
            .setTimestamp()
        ],
        flags: 64,
      });
    }

    const now = new Date();
    let targetEvent = null;

    if (eventIdParam) {
      targetEvent = data[guildId].events[eventIdParam];
      if (!targetEvent || new Date(targetEvent.deadline) <= now) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF6B6B")
              .setTitle("Event Not Found or Closed")
              .setDescription("This event either doesn't exist or the deadline has passed.")
              .setTimestamp()
          ],
          flags: 64,
        });
      }
    } else {
      const upcomingEvents = Object.values(data[guildId].events).filter(
        event => new Date(event.deadline) > now
      );
      if (upcomingEvents.length === 0) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF6B6B")
              .setTitle("No Upcoming Events")
              .setDescription("There are no events with open deadlines.")
              .setTimestamp()
          ],
          flags: 64,
        });
      }
      targetEvent = upcomingEvents.sort((a, b) => 
        new Date(a.deadline) - new Date(b.deadline)
      )[0];
    }

    const attending = Object.values(targetEvent.attendance).filter(a => a.status === "attending").length;
    const maybe = Object.values(targetEvent.attendance).filter(a => a.status === "maybe").length;
    const notAttending = Object.values(targetEvent.attendance).filter(a => a.status === "not_attending").length;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`attend_${targetEvent.id}`)
        .setLabel("Yes")
        .setStyle(ButtonStyle.Success)
        .setEmoji("✅"),
      new ButtonBuilder()
        .setCustomId(`maybe_${targetEvent.id}`)
        .setLabel("Maybe")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("❓"),
      new ButtonBuilder()
        .setCustomId(`not_attend_${targetEvent.id}`)
        .setLabel("No")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("❌")
    );

    const deadlineTime = new Date(targetEvent.deadline);
    const eventTime = new Date(targetEvent.eventDate);

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle(targetEvent.title)
      .setDescription(targetEvent.description || "No description")
      .addFields(
        { 
          name: "📅 Event", 
          value: `<t:${Math.floor(eventTime / 1000)}:F>`, 
          inline: true 
        },
        { 
          name: "⏰ Deadline", 
          value: `<t:${Math.floor(deadlineTime / 1000)}:R>`, 
          inline: true 
        },
        { 
          name: "\u200B", 
          value: "\u200B", 
          inline: true 
        },
        {
          name: "📊 Attendance",
          value: `✅ **${attending}** attending\n❓ **${maybe}** maybe\n❌ **${notAttending}** not attending`,
          inline: false
        }
      )
      .setFooter({ text: `Event ID: ${targetEvent.id}` })
      .setTimestamp();

    interaction.reply({ embeds: [embed], components: [row], flags: 64 });
  },
};
