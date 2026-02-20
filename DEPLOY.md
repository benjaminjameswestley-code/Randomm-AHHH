# 🚀 Deploy Your Bot 24/7 - Simple Guide

This guide shows you how to run your Discord bot on a server so it stays online all the time.

---

## Option 1: Quick Start (Easiest for Beginners)

### Step 1: Get a Server
- Use **Replit** (free, easiest): https://replit.com
- Or use a paid VPS like **DigitalOcean**, **Linode**, or **AWS**.

### Step 2: Upload Your Bot Code
Clone the repo on the server:
```bash
git clone https://github.com/benjaminjameswestley-code/Randomm-AHHH.git
cd Randomm-AHHH
```

### Step 3: Install Dependencies
```bash
npm install --production
```

### Step 4: Create `.env` File
Create a `.env` file in the root folder with your bot token:
```
DISCORD_TOKEN=your_token_here
MONGODB_URI=mongodb://localhost:27017/dank-bot
NODE_ENV=production
```

### Step 5: Start with PM2 (Keeps Bot Always Running)
```bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
```

### Step 6: Enable Auto-Restart on Server Reboot
```bash
pm2 startup
```

**Done!** Your bot will now stay online 24/7 and restart automatically if it crashes.

---

## Option 2: Use GitHub Actions (Automatic Deployment)

If you want the bot to auto-update when you push code to GitHub:

### Step 1: Set Up Server Secrets on GitHub

Go to your repo → **Settings** → **Secrets and variables** → **Actions**

Add these secrets (ask me if unsure):
- `SSH_HOST`: Your server IP (e.g., `123.45.67.89`)
- `SSH_USER`: SSH username (e.g., `ubuntu` or `root`)
- `SSH_KEY`: Your private SSH key (generate with `ssh-keygen`)
- `DEPLOY_PATH`: Path on server (e.g., `/home/ubuntu/randomm-ahhh`)

### Step 2: Push Your Code
```bash
git add .
git commit -m "update bot"
git push
```

GitHub Actions will automatically SSH to your server and restart the bot.

---

## Useful Commands

### Check Bot Status
```bash
pm2 status
pm2 logs randomm-ahhh
```

### Stop Bot
```bash
pm2 stop randomm-ahhh
```

### Restart Bot
```bash
pm2 restart randomm-ahhh
```

### Update Bot Code (Manual Pull)
```bash
cd /path/to/Randomm-AHHH
git pull
npm install --production
pm2 restart randomm-ahhh
```

### View Live Logs
```bash
pm2 logs randomm-ahhh --lines 100 --follow
```

---

## Troubleshooting

### Bot Won't Start
```bash
pm2 logs randomm-ahhh
# Look for the error, often:
# - Missing .env file
# - Wrong DISCORD_TOKEN
# - MongoDB connection failed
```

### MongoDB Not Found
Use MongoDB Atlas (cloud) instead:
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Copy your connection string
4. Add to `.env`: `MONGODB_URI=mongodb+srv://...`

### Bot Keeps Crashing
```bash
# Increase restart delay
pm2 restart randomm-ahhh
pm2 save

# Check logs for errors
pm2 logs randomm-ahhh --lines 50
```

---

## Questions?

Common issues:
- **"pm2 command not found"**: Run `npm install -g pm2`
- **"permission denied"**: Run commands with `sudo` or ensure user owns the folder
- **"Cannot connect to MongoDB"**: Use MongoDB Atlas cloud version or ensure MongoDB is running

---

**Your bot is now online 24/7! 🎉**
