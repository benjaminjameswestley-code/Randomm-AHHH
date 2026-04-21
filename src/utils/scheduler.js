const schedule = require("node-schedule");
const { EmbedBuilder } = require("discord.js");

const activeJobs = {};

async function scheduleEventReminder(client, guildId, eventId, eventData, remindMinutesBefore = 60) {
  try {
    const eventTime = new Date(eventData.eventDate);
    const reminderTime = new Date(eventTime.getTime() - remindMinutesBefore * 60000);

    // Only schedule if reminder time is in the future
    if (reminderTime <= new Date()) {
      return;
    }

    const jobKey = `${guildId}-${eventId}`;

    // Cancel existing job if any
    if (activeJobs[jobKey]) {
      activeJobs[jobKey].cancel();
    }

    // Schedule the reminder
    const job = schedule.scheduleJob(reminderTime, async () => {
      await sendEventReminder(client, guildId, eventData);
      delete activeJobs[jobKey];
    });

    activeJobs[jobKey] = job;

    console.log(`📅 Reminder scheduled for ${eventData.title} at ${reminderTime.toLocaleString()}`);
  } catch (error) {
    console.error("Failed to schedule reminder:", error);
  }
}

async function sendEventReminder(client, guildId, eventData) {
  try {
    const guild = await client.guilds.fetch(guildId);
    if (!guild) return;

    const attending = Object.values(eventData.attendance).filter(
      a => a.status === "attending"
    ).length;
    const maybe = Object.values(eventData.attendance).filter(
      a => a.status === "maybe"
    ).length;
    const notAttending = Object.values(eventData.attendance).filter(
      a => a.status === "not_attending"
    ).length;

    const embed = new EmbedBuilder()
      .setColor("#FFA500")
      .setTitle(`⏰ Reminder: ${eventData.title}`)
      .setDescription(eventData.description || "No description")
      .addFields(
        {
          name: "📅 Event Time",
          value: `<t:${Math.floor(new Date(eventData.eventDate) / 1000)}:F>`,
          inline: false,
        },
        {
          name: "📊 Current Responses",
          value: `✅ **${attending}** attending\n❓ **${maybe}** maybe\n❌ **${notAttending}** not attending`,
          inline: false,
        }
      )
      .setFooter({ text: "React to /mark_attendance to respond" })
      .setTimestamp();

    // Send to all members with targeting roles
    for (const member of (await guild.members.fetch()).values()) {
      const hasRole = eventData.roles.length === 0 || 
        member.roles.cache.some(role => eventData.roles.includes(role.name));
      
      if (hasRole && !member.user.bot) {
        try {
          await member.send({ embeds: [embed] });
        } catch (err) {
          console.error(`Failed to DM ${member.user.tag}:`, err.message);
        }
      }
    }

    console.log(`📢 Reminder sent for ${eventData.title}`);
  } catch (error) {
    console.error("Failed to send reminder:", error);
  }
}

function cancelReminder(guildId, eventId) {
  const jobKey = `${guildId}-${eventId}`;
  if (activeJobs[jobKey]) {
    activeJobs[jobKey].cancel();
    delete activeJobs[jobKey];
    console.log(`Cancelled reminder for ${jobKey}`);
  }
}

function getAllActiveReminders() {
  return Object.keys(activeJobs).length;
}

module.exports = { scheduleEventReminder, sendEventReminder, cancelReminder, getAllActiveReminders };
