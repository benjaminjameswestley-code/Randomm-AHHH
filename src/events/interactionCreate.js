const fs = require("fs");
const path = require("path");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const commandsPath = path.join(__dirname, "..", "commands");
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

      if (!command) {
        return;
      }

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error("Error executing command:", error);
        if (!interaction.replied) {
          interaction.reply({ content: "There was an error executing this command!", flags: 64 });
        }
      }
    } else if (interaction.isButton()) {
      // Handle button interactions
      const [action, eventId] = interaction.customId.split("_");
      const client_data = interaction.client.botData;

      if (action === "attend" || action === "not_attend") {
        const guildId = interaction.guildId;
        const userId = interaction.user.id;
        const status = action === "attend" ? "attending" : "not_attending";

        if (client_data[guildId]?.events?.[eventId]) {
          return interaction.reply({ content: "Event not found", flags: 64 });
        }

        client_data[guildId].events[eventId].attendance[userId] = {
          userId,
          username: interaction.user.username,
          status,
          timestamp: new Date().toISOString(),
        };

        client_data.saveData();

        const statusMsg = status === "attending" ? "marked as attending" : "marked as not attending";
        interaction.reply({ content: `You have ${statusMsg}`, flags: 64 });
      }
    }
  },
};
