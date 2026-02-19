# 🤖 Dank Bot - Economy Discord Bot

A feature-rich Discord bot inspired by **Dank Memer** with a complex global economy, RPG mechanics, games, and meme generation.

## ✨ Features

### 💰 Global Economy System
- **Wallet & Bank**: Users compete to build wealth on global leaderboards
- **/balance**: Check your wallet, bank, and net worth
- **/deposit** & **/withdraw**: Manage your money between wallet and bank
- **/leaderboard**: View top users by net worth, level, or experience
- **/rob**: Steal from another user's wallet (60% success rate, risky!)
- **/bankrob**: High-stakes heist with multiplayer potential

### 🎣 RPG Mechanics
- **/fish**: Catch rare fish at different locations (River, Ocean, Lake, Secret Spot)
- **/hunt**: Hunt animals in various terrains (Forest, Mountain, Plains, Swamp)
- **/work**: Earn money by working at different jobs with mini-games
- **/adventure**: Risk-based adventures with treasure hunting

### 🎮 Games & Gambling
- **/rps**: Rock-Paper-Scissors for cash
- **/trivia**: Answer trivia questions to win
- Wager system with win/lose mechanics

### 😂 Memes & Image Manipulation
- **/meme**: Random memes from various sources
- **/deepfry**: Deep fry images for maximum chaos

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **MongoDB** (local or cloud instance)
- **Discord Bot Token** from [Discord Developer Portal](https://discord.com/developers/applications)

## 🚀 Setup

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
DISCORD_TOKEN=your_bot_token_here
MONGODB_URI=mongodb://localhost:27017/dank-bot
NODE_ENV=development
PREFIX=!
```

**Getting your Discord Token:**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and click "Add Bot"
4. Copy the token and paste it in `.env`

**MongoDB Setup:**
- Local: Install MongoDB and run `mongod`
- Cloud: Use MongoDB Atlas (free tier available)

### 3. Bot Permissions & Setup

In Discord Developer Portal:
1. Go to OAuth2 → URL Generator
2. Select scopes: `bot`
3. Select permissions:
   - Send Messages
   - Embed Links
   - Read Message History
   - Use Slash Commands
4. Copy the generated URL and invite your bot to your server

## 💻 Running the Bot

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## 📊 Command Structure

### Economy Commands
```
/balance [user] - Check wallet and bank balance
/deposit <amount> - Deposit money to bank
/withdraw <amount> - Withdraw from bank
/rob <target> <amount> - Rob another user
/bankrob <amount> - Heist the bank
/leaderboard [type] - View wealth leaderboard
```

### RPG Commands
```
/fish [location] - Fish for items
/hunt [terrain] - Hunt for animals
/work [job] - Work to earn money
/adventure [risk_level] - Go on adventures (1-5)
```

### Games & Gambling
```
/rps <choice> <amount> - Rock-Paper-Scissors for cash
/trivia <wager> - Answer trivia questions
```

### Memes
```
/meme [source] - Random meme
/deepfry <image> - Deep fry an image
```

## 🗄️ Database Schema

### User Model
- **userId**: Discord user ID
- **username**: Discord username
- **wallet**: Cash in pocket (can be stolen)
- **bank**: Secure savings
- **level**: User level based on experience
- **experience**: XP from activities
- **items**: Inventory of collected items
- **fishingStats**: Fishing records
- **farmingStats**: Farming data
- **rob**: Robbery statistics
- **lastWork/Fish/Hunt/Adventure**: Cooldown tracking

### Market Model
- **sellerId**: Seller's user ID
- **itemId**: Item identifier
- **quantity**: Amount listed
- **pricePerUnit**: Price per unit
- **rarity**: Item rarity level
- **expiresAt**: Listing expiration

## 🎯 Success Rates & Mechanics

| Activity | Success Rate | Cooldown |
|----------|--------------|----------|
| Fish | 50-90% (location dependent) | 30 seconds |
| Hunt | 40-70% (terrain dependent) | 60 seconds |
| Rob | 60% | Variable |
| Work | 75% | 45 seconds |
| Adventure | 30-80% (risk dependent) | 60 seconds |

## 💡 Tips for Users

1. **Build your wallet slowly** - Higher bank balance = less to lose when robbed
2. **Fishing is safe** - Lower risk, consistent income
3. **Risk big for big rewards** - Adventures with 5 risk level pay 5x more
4. **Work streaks matter** - Consistent work builds experience faster
5. **Market trading** - Buy low, sell high for profit

## 🔧 Troubleshooting

### Bot won't start
- Check `.env` file has correct DISCORD_TOKEN
- Ensure MongoDB is running
- Check Node.js version: `node --version`

### Commands not appearing
- Invite bot with slash commands scope
- Restart bot: `npm run dev` or `npm start`
- Check bot has "Use Application Commands" permission

### Database connection fails
- Verify MongoDB URI in `.env`
- Check MongoDB service is running
- For Atlas: Whitelist your IP address

## 📈 Future Features

- [ ] Farming system
- [ ] Marketplace with player trading
- [ ] Boss fights and dungeons
- [ ] Guilds/Teams
- [ ] Daily quests and missions
- [ ] Seasonal events
- [ ] Custom item crafting

## 📝 License

MIT License - Feel free to fork and customize!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📞 Support

For issues or questions:
1. Check Discord for server-specific settings
2. Review the troubleshooting section
3. Check bot logs for errors

---

**Enjoy building wealth in the virtual economy! 💰**

## 🚢 Deployment (24/7)

Quick instructions to run this bot on a 24/7 server using PM2 and GitHub Actions.

- Requirements on the server:
   - Node.js 18+ installed
   - SSH access for the deploy user
   - (Optional) `pm2` installed globally or the workflow will install it

- GitHub repository secrets to add (Settings → Security → Secrets → Actions):
   - `SSH_HOST` : server IP or hostname
   - `SSH_USER` : SSH username
   - `SSH_KEY`  : private SSH key for `SSH_USER` (no passphrase) or use a deploy key
   - `DEPLOY_PATH` : full path on server to deploy (e.g., `/home/ubuntu/randomm-ahhh`)
   - `SSH_PORT` : (optional) SSH port if not 22

- Deploy flow (already included):
   - Push to `main` → GitHub Actions will SSH to your server, pull the latest code, run `npm ci`, and start/reload the app via `pm2`.

- Manual server steps:
   1. Install Node.js on the server.
   2. Ensure `SSH_USER` can write to `DEPLOY_PATH`.
   3. (Optional for private repo) Add the server's public key as a deploy key in the GitHub repo.
   4. Add the secrets listed above in GitHub.

- Start the app manually with PM2 (if you prefer not to use the Action):
```bash
cd /path/to/your/app
npm ci --production
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
```

If you want, I can add a `DEPLOY.md` with expanded server setup steps and troubleshooting notes.
