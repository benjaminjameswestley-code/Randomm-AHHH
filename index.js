const { Client, GatewayIntentBits, Routes, REST } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { loadData, saveData } = require("./src/utils/dataManager");
const { loadCommands, registerCommands } = require("./src/handlers/commandHandler");
const { scheduleEventReminder, getAllActiveReminders } = require("./src/utils/scheduler");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages],
});

let data = loadData();

// Load and register slash commands on ready
client.once("ready", async () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  await registerCommands(client);
  client.user.setActivity("attendance events", { type: "WATCHING" });

  // Schedule reminders for upcoming events
  scheduleAllReminders();
});

// Schedule reminders for all events
async function scheduleAllReminders() {
  let scheduledCount = 0;
  for (const guildId in data) {
    for (const eventId in data[guildId].events) {
      const event = data[guildId].events[eventId];
      const eventTime = new Date(event.eventDate);
      
      // Schedule reminder 1 hour before event if it's in the future
      if (eventTime > new Date()) {
        await scheduleEventReminder(client, guildId, eventId, event, 60);
        scheduledCount++;
      }
    }
  }
  console.log(`📅 Scheduled reminders for ${scheduledCount} events`);
}

// Handle command interactions
client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const commandsPath = path.join(__dirname, "src", "commands");
    const commandFolders = fs.readdirSync(commandsPath);

    let command;
    for (const folder of commandFolders) {
      const folderPath = path.join(commandsPath, folder);
      const filePath = path.join(folderPath, `${interaction.commandName}.js`);
      if (fs.existsSync(filePath)) {
        command = require(filePath);
        break;
      }
    }

    if (!command) return;

    try {
      await command.execute(interaction, { data, saveData, client });
    } catch (error) {
      console.error("❌ Error executing command:", error);
      if (!interaction.replied) {
        const { EmbedBuilder } = require("discord.js");
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF6B6B")
              .setTitle("Error")
              .setDescription("There was an error executing this command!")
              .setTimestamp()
          ],
          flags: 64,
        });
      }
    }
  } else if (interaction.isButton()) {
    // Handle button interactions for attendance
    const [action, eventId] = interaction.customId.split("_");

    if (action === "attend" || action === "maybe" || action === "not_attend") {
      const guildId = interaction.guildId;
      const userId = interaction.user.id;
      const statusMap = {
        attend: "attending",
        maybe: "maybe",
        not_attend: "not_attending"
      };
      const status = statusMap[action];

      if (!data[guildId]?.events?.[eventId]) {
        return interaction.reply({
          content: "Event not found",
          flags: 64,
        });
      }

      data[guildId].events[eventId].attendance[userId] = {
        userId,
        username: interaction.user.username,
        status,
        timestamp: new Date().toISOString(),
      };

      saveData(data);

      const statusEmoji = { attending: "✅", maybe: "❓", not_attending: "❌" };
      const statusText = { attending: "attending", maybe: "unsure about", not_attending: "not attending" };

      const { EmbedBuilder } = require("discord.js");
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("Attendance Updated")
            .setDescription(`${statusEmoji[status]} You are ${statusText[status]} this event`)
            .setTimestamp()
        ],
        flags: 64,
      });
    }
  }
});

// CLI reminder function
async function sendReminderToEvent(guildId, eventId) {
  if (!guildId || !eventId) {
    throw new Error("Usage: npm run remind -- <guildId> <eventId>");
  }

  const event = data[guildId]?.events?.[eventId];
  if (!event) {
    throw new Error(`Event not found: ${eventId}`);
  }

  const guild = await client.guilds.fetch(guildId);
  const { EmbedBuilder } = require("discord.js");

  const attending = Object.values(event.attendance).filter(a => a.status === "attending").length;
  const maybe = Object.values(event.attendance).filter(a => a.status === "maybe").length;
  const notAttending = Object.values(event.attendance).filter(a => a.status === "not_attending").length;

  const embed = new EmbedBuilder()
    .setColor("#5865F2")
    .setTitle(`📢 Reminder: ${event.title}`)
    .setDescription(event.description || "No description")
    .addFields(
      { 
        name: "⏰ Deadline", 
        value: `<t:${Math.floor(new Date(event.deadline) / 1000)}:R>`, 
        inline: false 
      },
      {
        name: "📊 Current Responses",
        value: `✅ **${attending}** attending\n❓ **${maybe}** maybe\n❌ **${notAttending}** not attending`,
        inline: false
      }
    )
    .setTimestamp();

  // Send DMs to users with appropriate roles
  for (const member of (await guild.members.fetch()).values()) {
    const hasRole = event.roles.length === 0 || member.roles.cache.some(role => event.roles.includes(role.name));
    if (hasRole) {
      try {
        await member.send({ embeds: [embed] });
      } catch (err) {
        console.error(`Failed to DM ${member.user.tag}`, err.message);
      }
    }
  }
}

if (process.argv[2] === "remind") {
  client.once("ready", () => {
    sendReminderToEvent(process.argv[3], process.argv[4])
      .then(() => {
        console.log(`✅ Reminder sent for event ${process.argv[4]}`);
        process.exit(0);
      })
      .catch(error => {
        console.error("❌ Error:", error.message);
        process.exit(1);
      });
  });
}

client.login(process.env.TOKEN);
