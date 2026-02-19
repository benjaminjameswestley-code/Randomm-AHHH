# 🚀 Deployment Guide

This guide covers multiple options for hosting your Dank Bot 24/7.

## Option 1: Railway (⭐ Recommended - Free Tier)

### Setup
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project → Deploy from GitHub
4. Select this repository
5. Add environment variables from `.env`:
   - `DISCORD_TOKEN`
   - `MONGODB_URI`
   - `NODE_ENV=production`

### Database
- Railway offers free PostgreSQL/MongoDB
- Or use MongoDB Atlas (free tier: 512MB storage)

### Cost
- **Free**: 500 hours/month (covers 1 bot on 24/7)
- **Pro**: $5/month as you scale

---

## Option 2: Heroku (Requires Credit Card)

### Setup
1. Sign up at [heroku.com](https://heroku.com)
2. Install Heroku CLI
3. Run:
```bash
heroku login
heroku create your-app-name
git push heroku main
heroku config:set DISCORD_TOKEN=your_token
heroku config:set MONGODB_URI=your_mongodb_uri
```

### Database
- MongoDB Atlas (free tier: 512MB)

### Cost
- **Free**: Removed (as of Nov 2022)
- **Hobby**: $7/month

---

## Option 3: Replit (Good for Testing)

### Setup
1. Go to [replit.com](https://replit.com)
2. Import from GitHub
3. Set environment variables in `.env`
4. Click "Run"

### Limitations
- Limited free compute hours
- Bot goes offline when inactive
- Best for testing, not production

---

## Option 4: VPS (Full Control)

### Providers
- **DigitalOcean** ($5/month basic droplet)
- **Linode** ($5/month)
- **AWS EC2** (free tier 12 months)

### Setup
1. Create Ubuntu 20.04 Droplet/Droplet
2. SSH into server:
```bash
ssh root@your_ip
```

3. Install dependencies:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb-server
```

4. Clone repository:
```bash
git clone your-repo-url
cd your-repo
npm install
```

5. Create `.env` file with your tokens

6. Start bot with PM2 (process manager):
```bash
npm install -g pm2
pm2 start src/index.js --name "dank-bot"
pm2 startup
pm2 save
```

7. Bot will now restart automatically on reboot!

### Monitoring
```bash
pm2 logs dank-bot          # View logs
pm2 monit                   # Monitor resources
pm2 list                    # See all processes
```

---

## MongoDB Options

### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (free tier available)
4. Get connection string
5. Add to `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dank-bot
```

### Option B: Self-Hosted MongoDB
```bash
# On your VPS
sudo service mongodb start
mongod --logpath /var/log/mongodb.log --fork

# Connection string
MONGODB_URI=mongodb://localhost:27017/dank-bot
```

---

## Environment Setup Checklist

For any platform, ensure you have:

```env
✓ DISCORD_TOKEN=your_token_here
✓ MONGODB_URI=your_mongodb_connection
✓ NODE_ENV=production
✓ PREFIX=! (optional)
```

---

## Performance Tips

### Reducing Memory Usage
```bash
# In package.json scripts
"start": "NODE_OPTIONS=--max_old_space_size=256 node src/index.js"
```

### Database Indexing
Add indexes to frequently queried fields in MongoDB:
```javascript
// In your User model
userSchema.index({ userId: 1 });
userSchema.index({ wallet: -1 }); // For leaderboards
```

### Caching
Consider implementing Redis for:
- Leaderboard caching
- Cooldown tracking
- Session storage

---

## Monitoring & Logging

### Services
- **Uptime Robot**: Free 24/7 monitoring
- **Better Stack**: Uptime monitoring + alerting
- **Discord Webhooks**: Send bot logs to Discord

### Error Tracking
Add to your bot for Discord notifications:
```javascript
client.on('error', error => {
  // Send to Discord logging channel
  console.error('Bot error:', error);
});
```

---

## Scaling (When Bot Grows)

| Users | Recommendation |
|-------|-----------------|
| <1000 | Railway/Heroku |
| 1000-10000 | VPS + Redis |
| 10000+ | Distributed system |

---

## Troubleshooting

**Bot keeps crashing?**
- Check logs: `pm2 logs` or platform logs
- Ensure DISCORD_TOKEN is valid
- Check MongoDB connection

**High memory usage?**
- Implement caching
- Set NODE_OPTIONS memory limit
- Use clustering (advanced)

**Commands slow?**
- Add database indexes
- Implement response caching
- Consider Redis

---

## Final Checklist

- [ ] Bot token saved securely
- [ ] MongoDB instance running
- [ ] Environment variables set
- [ ] Bot invited to server with permissions
- [ ] Slash commands registered
- [ ] Multiple commands tested
- [ ] Error handling enabled
- [ ] Monitoring/logging set up
- [ ] Backup strategy planned

---

🎉 **You're ready to deploy!**
