const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "..", "..", "config.json");

function loadTheme(guildId) {
  if (!fs.existsSync(configPath)) {
    return getDefaultTheme();
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  
  // Check if guild has custom theme
  if (config.guildThemes && config.guildThemes[guildId]) {
    const themeName = config.guildThemes[guildId];
    return config.themes[themeName] || getDefaultTheme();
  }

  // Use default theme
  const defaultThemeName = config.defaultTheme || "default";
  return config.themes[defaultThemeName] || getDefaultTheme();
}

function getDefaultTheme() {
  return {
    name: "Default (Discord Blue)",
    colors: {
      primary: "#5865F2",
      success: "#26D07C",
      error: "#FF6B6B",
      warning: "#FF9F43",
      info: "#FFA500"
    },
    emojis: {
      attending: "✅",
      maybe: "❓",
      not_attending: "❌",
      calendar: "📅",
      bell: "⏰",
      chart: "📊",
      users: "👥",
      reminder: "📢"
    }
  };
}

function setTheme(guildId, themeName) {
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  
  if (!config.themes[themeName]) {
    throw new Error(`Theme "${themeName}" not found`);
  }

  if (!config.guildThemes) {
    config.guildThemes = {};
  }

  config.guildThemes[guildId] = themeName;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  return config.themes[themeName];
}

function getAllThemes() {
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  return Object.keys(config.themes);
}

module.exports = { loadTheme, setTheme, getAllThemes, getDefaultTheme };
