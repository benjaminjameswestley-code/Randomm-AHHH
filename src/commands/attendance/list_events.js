const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list_events")
    .setDescription("List all upcoming attendance events"),

  async execute(interaction, { data }) {
    const guildId = interaction.guildId;

    if (!data[guildId] || !data[guildId].events || Object.keys(data[guildId].events).length === 0) {
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
    const events = Object.values(data[guildId].events)
      .filter(event => new Date(event.deadline) > now)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    if (events.length === 0) {
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

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle("📅 Upcoming Events")
      .setDescription(`Showing ${events.length} event(s)`);

    events.forEach((event, idx) => {
      const attending = Object.values(event.attendance).filter(a => a.status === "attending").length;
      const maybe = Object.values(event.attendance).filter(a => a.status === "maybe").length;
      const notAttending = Object.values(event.attendance).filter(a => a.status === "not_attending").length;
      const total = attending + maybe + notAttending;

      const eventTime = new Date(event.eventDate);
      const deadlineTime = new Date(event.deadline);
      const timeLeft = deadlineTime - now;
      const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));

      const progressBar = generateProgressBar(attending, total);

      embed.addFields({
        name: `${idx + 1}. ${event.title}`,
        value: `**Event:** <t:${Math.floor(eventTime / 1000)}:f>\n**Deadline:** <t:${Math.floor(deadlineTime / 1000)}:R>\n\n${progressBar}\n✅ ${attending} | ❓ ${maybe} | ❌ ${notAttending}\n\`ID: ${event.id}\``,
        inline: false,
      });
    });

    embed.setFooter({ text: `Last updated: ${new Date().toLocaleTimeString()}` }).setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};

function generateProgressBar(attending, total) {
  if (total === 0) return "▫️▫️▫️▫️▫️ 0%";
  const percentage = Math.round((attending / total) * 100);
  const filled = Math.floor(percentage / 20);
  const empty = 5 - filled;
  const bar = "🟦".repeat(filled) + "▫️".repeat(empty);
  return `${bar} ${percentage}%`;
}
