# 🚀 Deployment Guide - Apollo Attendance Bot

This guide covers deploying your bot to **Railway** (recommended) and other platforms.

## 🎯 Prerequisites

- Bot token from Discord Developer Portal
- GitHub account (for Railway)
- MongoDB Atlas account (for cloud database)

## 🚂 Deploy to Railway

Railway is the easiest way to host Discord bots. It's free tier friendly and requires minimal setup.

### Step 1: Prepare Your Repository

1. Initialize Git (if not already done):
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   \`\`\`

2. Create a GitHub repository and push:
   \`\`\`bash
   git remote add origin https://github.com/YOUR_USERNAME/apollo-attendance-bot.git
   git branch -M main
   git push -u origin main
   \`\`\`

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub account and select your bot repository
5. Railway will auto-detect Node.js

### Step 3: Set Environment Variables

In Railway Dashboard:

1. Go to your project
2. Click "Variables"
3. Add:
   - \`TOKEN\` = Your Discord bot token
   - \`CLIENT_ID\` = Your Discord client ID
   - \`MONGODB_URI\` = Your MongoDB connection string (if using DB)

### Step 4: Deploy

Railway auto-deploys on push to \`main\` branch. To trigger:

\`\`\`bash
git push origin main
\`\`\`

Check deployment logs in Railway Dashboard.

---

## 🗄️ MongoDB Atlas Setup (Optional)

For production, use MongoDB Atlas instead of JSON files.

### Step 1: Create MongoDB Atlas Cluster

1. Go to [mongodb.com/cloud](https://www.mongodb.com/cloud)
2. Sign up/login
3. Create a new project
4. Create a free M0 cluster
5. Set up database user (username/password)
6. Whitelist all IPs (0.0.0.0/0)
7. Get connection string

### Step 2: Update index.js

Replace JSON data manager with MongoDB:

\`\`\`javascript
const DatabaseManager = require("./src/utils/database");
const db = new DatabaseManager(true); // Use MongoDB

// On bot ready:
client.once("ready", async () => {
  await db.connectMongo(process.env.MONGODB_URI);
  // ... rest of startup
});
\`\`\`

### Step 3: Update Commands

Replace \`dataManager\` with \`db\` in all commands:

\`\`\`javascript
// Old (JSON):
await command.execute(interaction, { data, saveData });

// New (MongoDB):
const event = await db.getEvent(guildId, eventId);
await db.updateEvent(guildId, eventId, updates);
\`\`\`

---

## 🐳 Docker Deployment

For Heroku or other platforms:

### Create Dockerfile

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
\`\`\`

### Create .dockerignore

\`\`\`
node_modules
.env
.git
data.json
\`\`\`

### Deploy to Heroku

\`\`\`bash
heroku login
heroku create your-bot-name
heroku addons:create mongolab:sandbox
git push heroku main
\`\`\`

---

## 🟢 Render.com Deployment

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create "New +" → "Web Service"
4. Connect GitHub repository
5. Set runtime to Node
6. Add environment variables
7. Deploy

---

## 📊 Monitoring & Logs

### Railway Logs
\`\`\`
Dashboard → Project → Deployments → Logs
\`\`\`

### Local Testing Before Deploy

\`\`\`bash
npm start
\`\`\`

### Enable Debug Logging

Add to index.js:

\`\`\`javascript
if (process.env.DEBUG) {
  client.on("debug", console.log);
}
\`\`\`

Set \`DEBUG=true\` in environment variables.

---

## ✅ Deployment Checklist

- [ ] Bot token is secure (in .env, not in code)
- [ ] package.json has all dependencies
- [ ] Node version is 16+ (set in railway.json if needed)
- [ ] Environment variables set in hosting platform
- [ ] Database connection string correct
- [ ] Bot has proper permissions in Discord
- [ ] Code is pushed to main branch
- [ ] Deployment logs show no errors

---

## 🔧 Troubleshooting

### Bot won\'t start
- Check logs in hosting platform
- Verify environment variables
- Ensure token is correct

### Commands not registering
- Restart bot
- Check CLIENT_ID is correct
- Verify bot has applications.commands scope

### Database errors
- Check MONGODB_URI format
- Verify IP whitelist (Atlas)
- Test connection locally

### Keep-alive for Railway
Railway\'s free tier may sleep. Add to index.js:

\`\`\`javascript
const http = require("http");
http.createServer((req, res) => res.end()).listen(3000);
\`\`\`

---

## 📚 Resources

- [Railway Docs](https://docs.railway.app)
- [Discord.js Guide](https://discordjs.guide)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

---

**Your bot is ready to go live!** 🎉
