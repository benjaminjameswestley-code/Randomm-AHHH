const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "..", "..", "data.json");

function loadData() {
  if (fs.existsSync(dataFile)) {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  }
  return {};
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function parseDateTime(value) {
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

module.exports = { loadData, saveData, parseDateTime, dataFile };
