const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create_event")
    .setDescription("Create an attendance event with reminders")
    .addStringOption(option =>
      option.setName("title")
        .setDescription("Event title")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("event_date")
        .setDescription("Event date (YYYY-MM-DD HH:mm)")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("deadline")
        .setDescription("Deadline for marking attendance (YYYY-MM-DD HH:mm)")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("description")
        .setDescription("Event description")
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName("roles")
        .setDescription("Comma-separated role names to target")
        .setRequired(false)
    ),

  async execute(interaction, { data, saveData }) {
    const title = interaction.options.getString("title");
    const eventDate = interaction.options.getString("event_date");
    const deadline = interaction.options.getString("deadline");
    const description = interaction.options.getString("description") || "No description provided";
    const rolesStr = interaction.options.getString("roles") || "";

    const eventTime = new Date(eventDate);
    const deadlineTime = new Date(deadline);
    const now = new Date();

    if (isNaN(eventTime) || isNaN(deadlineTime)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF6B6B")
            .setTitle("Invalid Date Format")
            .setDescription("Please use the format: YYYY-MM-DD HH:mm")
            .setTimestamp()
        ],
        flags: 64,
      });
    }

    const guildId = interaction.guildId;
    if (!data[guildId]) {
      data[guildId] = { events: {} };
    }

    const eventId = Date.now().toString();
    const timeUntilEvent = Math.floor((eventTime - now) / 1000 / 3600);
    
    data[guildId].events[eventId] = {
      id: eventId,
      title,
      description,
      eventDate: eventTime.toISOString(),
      deadline: deadlineTime.toISOString(),
      roles: rolesStr.split(",").map(r => r.trim()).filter(r => r),
      attendance: {},
      createdAt: new Date().toISOString(),
      createdBy: interaction.user.id,
    };

    saveData(data);

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle(title)
      .setDescription(description)
      .addFields(
        { 
          name: "📅 Event Time", 
          value: `<t:${Math.floor(eventTime / 1000)}:F>`, 
          inline: true 
        },
        { 
          name: "⏰ Deadline", 
          value: `<t:${Math.floor(deadlineTime / 1000)}:F>`, 
          inline: true 
        },
        { 
          name: "ID", 
          value: `\`${eventId}\``, 
          inline: true 
        }
      )
      .setFooter({ text: `Created by ${interaction.user.username}` })
      .setTimestamp();

    if (data[guildId].events[eventId].roles.length > 0) {
      embed.addFields({
        name: "👥 Targeted Roles",
        value: data[guildId].events[eventId].roles.join(", "),
        inline: false,
      });
    }

    interaction.reply({ embeds: [embed] });
  },
};
