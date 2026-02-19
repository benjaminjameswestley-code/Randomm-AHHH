# 🎯 Installation & Setup Checklist

Follow these steps to get your Dank Bot up and running!

---

## ✅ Phase 1: Pre-Installation (5 minutes)

- [ ] Node.js 18+ installed ([nodejs.org](https://nodejs.org))
   ```bash
   node --version  # Should show v18.0.0 or higher
   ```

- [ ] Git installed ([git-scm.com](https://git-scm.com))
   ```bash
   git --version
   ```

- [ ] Discord Developer Portal Account ([discord.com/developers](https://discord.com/developers))

- [ ] Discord Server for testing (or create new one)

---

## ✅ Phase 2: Create Discord Bot (5 minutes)

1. [ ] Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. [ ] Click "New Application" and name it "Dank Bot"
3. [ ] Go to "Bot" section → Click "Add Bot"
4. [ ] Under "TOKEN" section:
   - [ ] Click "Copy" to copy bot token
   - [ ] **Keep this secret!** Never share it
5. [ ] Go to "OAuth2" → "URL Generator":
   - [ ] Check "bot" under Scopes
   - [ ] Check these permissions:
     - [ ] Send Messages
     - [ ] Send Messages in Threads
     - [ ] Embed Links
     - [ ] Read Message History
     - [ ] Use Application Commands (important!)
   - [ ] Copy generated URL and open in browser
   - [ ] Select your test server
   - [ ] Authorize bot

**Result**: Bot should now appear in your server!

---

## ✅ Phase 3: Environment Setup (10 minutes)

1. [ ] Open terminal in project directory:
   ```bash
   cd "c:\Users\Benja\Downloads\Randomm AHHH"
   ```

2. [ ] Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

3. [ ] Edit `.env` with your values:
   ```env
   DISCORD_TOKEN=paste_your_bot_token_here
   MONGODB_URI=mongodb://localhost:27017/dank-bot
   NODE_ENV=development
   PREFIX=!
   ```

4. [ ] Save `.env` file

---

## ✅ Phase 4: MongoDB Setup (Choose One)

### Option A: MongoDB Atlas (Cloud) ⭐ Recommended

1. [ ] Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. [ ] Sign up with email
3. [ ] Create first cluster (free tier available)
4. [ ] Create database user:
   - [ ] Go to "Database Access"
   - [ ] Create username & password
5. [ ] Get connection string:
   - [ ] Click "Connect" on cluster
   - [ ] Choose "Connect with MongoDB Shell"
   - [ ] Copy connection string
6. [ ] Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dank-bot
   ```
7. [ ] Test connection (next phase)

### Option B: Local MongoDB

**Windows:**
1. [ ] Download MongoDB from [mongodb.com/try/download/community](https://mongodb.com/try/download/community)
2. [ ] Run installer (follow default options)
3. [ ] MongoDB should auto-start
4. [ ] Update `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/dank-bot
   ```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

---

## ✅ Phase 5: Install Dependencies (5 minutes)

1. [ ] In terminal, run:
   ```bash
   npm install
   ```

2. [ ] Wait for all packages to install (should see "added XX packages")

3. [ ] Verify installation:
   ```bash
   npm list discord.js mongoose canvas
   ```

---

## ✅ Phase 6: Test Bot Startup (5 minutes)

1. [ ] Run in development mode:
   ```bash
   npm run dev
   ```

2. [ ] Look for these messages:
   ```
   ✅ Connected to MongoDB
   ✅ Loaded XX commands
   ✅ Loaded X events
   ✅ Bot logged in as DankBot#1234
   ```

3. [ ] If you see these, **bot is running!** 🎉

4. [ ] Stop bot (press `Ctrl+C`)

---

## ✅ Phase 7: Test Commands (10 minutes)

1. [ ] Start bot again:
   ```bash
   npm run dev
   ```

2. [ ] In Discord, try these commands in order:

   **Test 1: Basic Command**
   ```
   /balance
   ```
   Expected: Shows wallet ($1000), bank ($0), net worth ($1000)

   **Test 2: Earning Money**
   ```
   /work
   ```
   Expected: You earn money, see result

   **Test 3: Leaderboard**
   ```
   /leaderboard
   ```
   Expected: Shows you at top (since you're only user)

   **Test 4: RPG**
   ```
   /fish
   ```
   Expected: Fishing animation then result

   **Test 5: Games**
   ```
   /rps rock 100
   ```
   Expected: Rock-Paper-Scissors game with wager

3. [ ] If all tests pass, **bot is working!** 🚀

---

## ✅ Phase 8: Production Setup (Optional)

Choose hosting platform:

- [ ] **Railway** (Recommended): Follow DEPLOYMENT.md → Railway section
- [ ] **Heroku**: Follow DEPLOYMENT.md → Heroku section  
- [ ] **VPS**: Follow DEPLOYMENT.md → VPS section

**For now, skip this if just testing locally**

---

## 🆘 Troubleshooting

### "Command not found: npm"
**Solution**: Install Node.js from [nodejs.org](https://nodejs.org)

### "Invalid token" Error
**Solution**: 
- [ ] Get new token from Developer Portal
- [ ] Paste in `.env` with no extra spaces
- [ ] Ensure quotes are correct: `DISCORD_TOKEN=your_token_here`

### "Cannot connect to MongoDB"
**Solution**:
- [ ] Check MongoDB is running:
  ```bash
  mongod  # for local
  ```
- [ ] Verify connection string in `.env`
- [ ] For Atlas: check IP whitelist

### "Commands not showing up in Discord"
**Solution**:
- [ ] Restart bot
- [ ] Check bot has "Use Application Commands" permission
- [ ] Reload Discord (Ctrl+R)
- [ ] Ensure bot is in server

### "error: [ERR_MODULE_NOT_FOUND]"
**Solution**:
- [ ] Run `npm install` again
- [ ] Delete `node_modules` folder and reinstall:
  ```bash
  rm -r node_modules
  npm install
  ```

### Bot won't start / keeps crashing
**Solution**:
- [ ] Check Discord token is valid
- [ ] Check MongoDB connection string
- [ ] Check port isn't in use
- [ ] Check for typos in `.env`

---

## 📊 Post-Installation

Once bot is working:

1. [ ] Read [README.md](README.md) for full feature list
2. [ ] Read [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for command guide
3. [ ] Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) to understand code
4. [ ] Customize commands (see README.md → Customization)
5. [ ] Deploy to production (see [DEPLOYMENT.md](DEPLOYMENT.md))

---

## 🎮 First User Guide

Share this with server members:

1. **Start**: Type `/balance` to check starting $1000
2. **Earn**: Use `/work`, `/fish`, or `/hunt` to make money
3. **Compete**: Check `/leaderboard` to see rankings
4. **Risk**: Try `/rob` or `/bankrob` for big rewards (risky!)
5. **Have Fun**: Play `/rps` or `/trivia` games

---

## ✅ Final Checklist

Before considering bot "done":

- [ ] Bot starts without errors
- [ ] All 14 commands work
- [ ] User data saves to MongoDB
- [ ] Leaderboard shows users
- [ ] No console errors
- [ ] Bot responds to all interactions
- [ ] Image commands work (meme, deepfry)
- [ ] Cooldowns are enforced
- [ ] Error messages are user-friendly

---

## 🎉 Success!

Your Dank Bot is now ready to use! 

**Next Steps:**
1. Invite more users to test
2. Customize commands as needed
3. Set up 24/7 hosting (Railway/Heroku/VPS)
4. Monitor bot for issues
5. Add new features or balance adjustments

**Happy bot building! 💰🚀**

---

**Need help?** Check the troubleshooting section or review code comments!
