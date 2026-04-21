# 🎯 Apollo Attendance Bot - Complete Edition

A professional Discord attendance tracking bot inspired by Apollo with advanced features including recurring events, automatic reminders, custom themes, and MongoDB support. Perfect for servers, teams, and organizations.

## ✨ Features

### Core Features
- **3-Status Attendance**: Yes ✅, Maybe ❓, No ❌ responses
- **Event Management**: Create, edit, delete, and list events
- **Real-time Statistics**: Live attendance counts, percentages, progress bars
- **Professional UI**: Beautiful Discord embeds with custom themes
- **Role Targeting**: Target specific roles for events
- **Detailed Analytics**: View attendee lists and attendance history

### Advanced Features
- **Recurring Events**: Daily, weekly, bi-weekly, monthly patterns (1-52 times)
- **Automatic Reminders**: Scheduled DM reminders before events
- **Custom Themes**: Switch between Default, Dark, and Green themes
- **MongoDB Support**: Production-ready database integration
- **Database Abstraction**: Easy switching between JSON and MongoDB
- **Modular Architecture**: Clean, scalable codebase

## 📂 Project Structure

\`\`\`
F1/
├── src/
│   ├── commands/
│   │   └── attendance/
│   │       ├── create_event.js           # Create events
│   │       ├── edit_event.js             # Edit events
│   │       ├── delete_event.js           # Delete events
│   │       ├── create_recurring_event.js # Recurring events
│   │       ├── mark_attendance.js        # Mark attendance
│   │       ├── list_events.js            # List events
│   │       ├── event_stats.js            # View statistics
│   │       ├── schedule_reminder.js      # Schedule reminders
│   │       └── set_theme.js              # Change theme
│   ├── models/
│   │   └── Event.js                      # MongoDB schema
│   ├── handlers/
│   │   └── commandHandler.js             # Command registration
│   ├── utils/
│   │   ├── dataManager.js                # JSON data handling
│   │   ├── scheduler.js                  # Reminder scheduling
│   │   ├── theme.js                      # Theme management
│   │   └── database.js                   # Database abstraction
│   └── events/
│       ├── ready.js
│       └── interactionCreate.js
├── index.js                              # Main bot file
├── package.json                          # Dependencies
├── config.json                           # Theme configuration
├── railway.json                          # Railway deployment
├── Procfile                              # Heroku deployment
├── .env                                  # Bot token & config
├── .gitignore                            # Git ignore
├── README.md                             # This file
└── DEPLOYMENT.md                         # Deployment guide
\`\`\`

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Discord bot token
- (Optional) MongoDB Atlas account

### Installation

\`\`\`bash
npm install
\`\`\`

### Configuration

Update \`.env\`:
\`\`\`env
TOKEN=your_discord_bot_token
CLIENT_ID=your_client_id
\`\`\`

### Run Bot

\`\`\`bash
npm start
\`\`\`

## 📋 Commands

### Event Management

#### /create_event
Create a single attendance event.

**Options:**
- \`title\` - Event name (required)
- \`event_date\` - Event date YYYY-MM-DD HH:mm (required)
- \`deadline\` - RSVP deadline (required)
- \`description\` - Event details (optional)
- \`roles\` - Comma-separated role names (optional)

#### /create_recurring_event
Create events that repeat automatically.

**Options:**
- \`title\` - Event name (required)
- \`start_date\` - Start date (required)
- \`frequency\` - Daily, Weekly, Bi-weekly, or Monthly (required)
- \`occurrences\` - Number of times (1-52) (required)
- \`deadline_minutes\` - RSVP deadline minutes before (default: 30)
- \`description\` - Event details (optional)

**Example:**
\`\`\`
/create_recurring_event
  title: Team Standup
  start_date: 2026-04-22 10:00
  frequency: daily
  occurrences: 30
\`\`\`

#### /edit_event
Edit event details after creation.

**Options:**
- \`event_id\` - Event to edit (required)
- \`title\` - New title (optional)
- \`description\` - New description (optional)
- \`event_date\` - New event date (optional)
- \`deadline\` - New deadline (optional)

#### /delete_event
Delete an event (creator or admin only).

**Options:**
- \`event_id\` - Event to delete (required)

### Attendance

#### /mark_attendance
Mark your attendance with Yes/Maybe/No buttons.

**Options:**
- \`event_id\` - Specific event (optional, defaults to next upcoming)

#### /list_events
View all upcoming events with live statistics.

Shows:
- Event titles and dates
- Response counts (Yes/Maybe/No)
- Progress bars (attendance percentage)
- Event IDs

#### /event_stats
View detailed statistics for an event.

**Options:**
- \`event_id\` - Event to analyze (required)

Shows:
- Attendance breakdown by status
- Percentages
- Lists of attendees
- Attendance timestamps

### Reminders

#### /schedule_reminder
Automatically send reminders before events.

**Options:**
- \`event_id\` - Event to remind for (required)
- \`minutes_before\` - How long before event (default: 60)

Reminders are sent as private DMs with:
- Event title and description
- Countdown to deadline
- Current response statistics

### Customization

#### /set_theme
Change the bot theme for your server (admin only).

**Themes:**
- **default** - Discord Blue (primary color)
- **dark** - Dark Theme (moody colors)
- **green** - Green Theme (nature inspired)

Each theme includes custom colors and emoji sets.

## 🗄️ Database

### JSON (Default)
- Stored in \`data.json\`
- Perfect for small to medium servers
- No external dependencies

### MongoDB (Production)
- Scalable cloud database
- Automatic backups
- Advanced querying

**To enable MongoDB:**

\`\`\`javascript
// In index.js
const DatabaseManager = require("./src/utils/database");
const db = new DatabaseManager(true);

client.once("ready", async () => {
  await db.connectMongo(process.env.MONGODB_URI);
  // ...
});
\`\`\`

**Get MongoDB URI:**
1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Generate connection string
3. Add to \`.env\`:
   \`\`\`
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
   \`\`\`

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides on:
- **Railway** (recommended, free tier)
- **Heroku** (classic hosting)
- **Render** (modern alternative)
- **Docker** (containerization)

Quick Railway deployment:

\`\`\`bash
git push origin main
\`\`\`

Then configure environment variables in Railway Dashboard.

## 🎨 Customizing Themes

Edit \`config.json\` to create custom themes:

\`\`\`json
{
  "themes": {
    "custom": {
      "name": "My Theme",
      "colors": {
        "primary": "#FF0000",
        "success": "#00FF00",
        "error": "#0000FF",
        "warning": "#FFFF00",
        "info": "#00FFFF"
      },
      "emojis": {
        "attending": "✅",
        "maybe": "❓",
        "not_attending": "❌",
        "calendar": "📅",
        "bell": "⏰",
        "chart": "📊",
        "users": "👥",
        "reminder": "📢"
      }
    }
  }
}
\`\`\`

## 📊 Data Structure

### Event (JSON)
\`\`\`json
{
  "id": "1234567890",
  "title": "Team Meeting",
  "description": "Weekly sync",
  "eventDate": "2026-04-22T14:00:00.000Z",
  "deadline": "2026-04-22T13:30:00.000Z",
  "roles": ["Team Lead", "Developer"],
  "attendance": {
    "userId": {
      "userId": "123456789",
      "username": "JohnDoe",
      "status": "attending",
      "timestamp": "2026-04-22T09:00:00.000Z"
    }
  },
  "createdAt": "2026-04-21T12:00:00.000Z",
  "createdBy": "creatorId",
  "isRecurring": false
}
\`\`\`

## 🔐 Permissions

- **Create Events**: Any user
- **Edit Events**: Event creator or admin
- **Delete Events**: Event creator or admin
- **Change Theme**: Server admin only
- **Mark Attendance**: Any user

## 🛠️ Development

### Add New Commands

1. Create file in \`src/commands/attendance/\`
2. Export \`data\` (SlashCommandBuilder) and \`execute\` function
3. Auto-registers on bot startup

### Example Command

\`\`\`javascript
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("my_command")
    .setDescription("My command description"),
  
  async execute(interaction, { data, saveData, client }) {
    // Your code here
  }
};
\`\`\`

## 📚 Dependencies

- \`discord.js@14\` - Discord bot framework
- \`dotenv@16\` - Environment configuration
- \`node-schedule\` - Job scheduling
- \`mongoose\` - MongoDB object modeling

## 🐛 Troubleshooting

**Bot won't start:**
- Check \`TOKEN\` and \`CLIENT_ID\` in .env
- Verify Node version (16+)
- Check \`npm install\` completed

**Commands not registering:**
- Restart bot
- Verify \`CLIENT_ID\` is correct
- Check bot has \`applications.commands\` scope

**Reminders not sending:**
- Verify event deadline is in future
- Check bot can send DMs to users
- Verify users have DMs enabled

**Theme not changing:**
- Use \`/set_theme\` with valid theme name
- Must be server admin
- Refresh Discord client

## 📄 License

MIT - Feel free to use and modify

---

## 🤝 Contributing

Found a bug? Have a feature request?

1. Fork the repository
2. Create feature branch
3. Submit pull request

---

**Apollo Attendance Bot** - Professional event management for Discord

Built with ❤️ for teams and communities.

Questions? Check [DEPLOYMENT.md](DEPLOYMENT.md) for advanced setup.
