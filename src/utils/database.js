const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { Event } = require("../models/Event");

class DatabaseManager {
  constructor(useMongoDb = false) {
    this.useMongoDb = useMongoDb;
    this.data = {};
    if (!useMongoDb) {
      this.loadJsonData();
    }
  }

  // ===== JSON Methods =====
  loadJsonData() {
    const dataFile = path.join(__dirname, "..", "..", "data.json");
    if (fs.existsSync(dataFile)) {
      this.data = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    } else {
      this.data = {};
    }
  }

  saveJsonData() {
    const dataFile = path.join(__dirname, "..", "..", "data.json");
    fs.writeFileSync(dataFile, JSON.stringify(this.data, null, 2));
  }

  // ===== MongoDB Methods =====
  async connectMongo(uri) {
    try {
      await mongoose.connect(uri);
      this.useMongoDb = true;
      console.log("✅ Connected to MongoDB");
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error);
      throw error;
    }
  }

  // ===== Unified Interface =====
  async getEvent(guildId, eventId) {
    if (this.useMongoDb) {
      return await Event.findOne({ guildId, id: eventId });
    } else {
      return this.data[guildId]?.events?.[eventId] || null;
    }
  }

  async getAllEvents(guildId) {
    if (this.useMongoDb) {
      return await Event.find({ guildId });
    } else {
      return Object.values(this.data[guildId]?.events || {});
    }
  }

  async createEvent(guildId, eventData) {
    if (this.useMongoDb) {
      const event = new Event({ ...eventData, guildId });
      await event.save();
      return event.toObject();
    } else {
      if (!this.data[guildId]) {
        this.data[guildId] = { events: {} };
      }
      this.data[guildId].events[eventData.id] = eventData;
      this.saveJsonData();
      return eventData;
    }
  }

  async updateEvent(guildId, eventId, updates) {
    if (this.useMongoDb) {
      const event = await Event.findOneAndUpdate(
        { guildId, id: eventId },
        updates,
        { new: true }
      );
      return event?.toObject();
    } else {
      if (this.data[guildId]?.events?.[eventId]) {
        this.data[guildId].events[eventId] = {
          ...this.data[guildId].events[eventId],
          ...updates,
        };
        this.saveJsonData();
        return this.data[guildId].events[eventId];
      }
      return null;
    }
  }

  async deleteEvent(guildId, eventId) {
    if (this.useMongoDb) {
      return await Event.deleteOne({ guildId, id: eventId });
    } else {
      if (this.data[guildId]?.events?.[eventId]) {
        delete this.data[guildId].events[eventId];
        this.saveJsonData();
        return true;
      }
      return false;
    }
  }

  async updateAttendance(guildId, eventId, userId, attendanceData) {
    if (this.useMongoDb) {
      const event = await Event.findOneAndUpdate(
        { guildId, id: eventId },
        { $set: { [`attendance.${userId}`]: attendanceData } },
        { new: true }
      );
      return event?.toObject();
    } else {
      if (this.data[guildId]?.events?.[eventId]) {
        this.data[guildId].events[eventId].attendance[userId] = attendanceData;
        this.saveJsonData();
        return this.data[guildId].events[eventId];
      }
      return null;
    }
  }

  async close() {
    if (this.useMongoDb) {
      await mongoose.disconnect();
      console.log("MongoDB disconnected");
    }
  }
}

module.exports = DatabaseManager;
