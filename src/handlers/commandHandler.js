const fs = require("fs");
const path = require("path");

async function loadCommands(client) {
  const commands = [];
  const commandsPath = path.join(__dirname, "..", "commands");
  const commandFolders = fs.readdirSync(commandsPath);

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);
      if (command.data && command.execute) {
        commands.push(command);
      }
    }
  }

  return commands;
}

async function registerCommands(client) {
  const commands = await loadCommands(client);
  const { Routes } = require("discord.js");
  const rest = new (require("discord.js")).REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    console.log(`Registering ${commands.length} slash commands...`);
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands.map(cmd => cmd.data.toJSON()) }
    );
    console.log("Slash commands registered successfully");
  } catch (error) {
    console.error("Failed to register commands:", error);
  }
}

module.exports = { loadCommands, registerCommands };
