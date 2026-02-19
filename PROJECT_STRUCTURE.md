project_structure = """
Dank Bot - Complete Project Structure
=====================================

dank-bot/
├── src/
│   ├── index.js                    # Main bot file (loads commands, events, connects DB)
│   ├── commands/
│   │   ├── economy/                # Economy system commands
│   │   │   ├── balance.js          # Check wallet & bank
│   │   │   ├── deposit.js          # Deposit to bank
│   │   │   ├── withdraw.js         # Withdraw from bank
│   │   │   ├── rob.js              # Rob users (60% success)
│   │   │   ├── bankrob.js          # Bank heist (30-80% success)
│   │   │   └── leaderboard.js      # Global wealth leaderboard
│   │   ├── rpg/                    # RPG/Grinding commands
│   │   │   ├── fish.js             # Fishing mini-game
│   │   │   ├── hunt.js             # Hunting for animals
│   │   │   ├── work.js             # Work at jobs
│   │   │   └── adventure.js        # Risk-based adventures
│   │   ├── games/                  # Gambling & games
│   │   │   ├── rps.js              # Rock-Paper-Scissors
│   │   │   └── trivia.js           # Trivia questions
│   │   └── memes/                  # Meme commands
│   │       ├── meme.js             # Random meme
│   │       └── deepfry.js          # Deep fry images
│   ├── events/
│   │   ├── ready.js                # Bot startup event
│   │   └── interactionCreate.js    # Command execution handler
│   ├── models/
│   │   ├── User.js                 # User database schema
│   │   └── Market.js               # Market listing schema
│   ├── utils/
│   │   ├── EconomyManager.js       # Economy functions & helpers
│   │   └── ImageManager.js         # Image manipulation & memes
│   └── config/
│       └── items.js                # Item definitions & recipes
├── package.json                    # Dependencies & scripts
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── README.md                       # Main documentation
├── QUICK_REFERENCE.md              # Command quick reference
└── DEPLOYMENT.md                   # Hosting guide

KEY FILES EXPLAINED:

1. src/index.js
   - Connects to MongoDB
   - Loads all commands from /commands folders
   - Loads all events from /events
   - Registers slash commands on startup
   - Handles bot login

2. src/models/User.js
   - Stores: userId, username, wallet, bank, level, exp
   - Tracks: items, fishing stats, farming stats, rob stats
   - Cooldowns: lastWork, lastFish, lastHunt, lastAdventure

3. src/models/Market.js
   - Stores: sellerId, itemId, quantity, pricePerUnit
   - Expires: 7 days after creation
   - Used for player-to-player trading

4. src/utils/EconomyManager.js
   - getOrCreateUser(): Initialize new users
   - addMoney() / removeMoney(): Update wallet/bank
   - deposit() / withdraw(): Bank transfers
   - getGlobalLeaderboard(): Fetch top users
   - addItem() / removeItem(): Inventory management

5. src/utils/ImageManager.js
   - fetchRandomMeme(): Get memes from APIs
   - deepfryImage(): Image distortion effect
   - createLeaderboardImage(): Canvas-based image generation

COMMAND CATEGORIES:

1. Economy (6 commands)
   - Money management & theft-based competition
   - High-risk/high-reward mechanics

2. RPG (4 commands)  
   - Grinding & progression system
   - Multiple activities with different reward profiles

3. Games (2 commands)
   - Gambling with wager system
   - Trivia & RPS with multipliers

4. Memes (2 commands)
   - Random meme fetching
   - Image manipulation

DATABASE DESIGN:

Users Collection:
- One document per Discord user
- Tracks: money, items, stats, cooldowns
- Indexed on: userId (unique), wallet (for leaderboards)

Market Collection:
- One document per item listing
- Expires automatically after 7 days
- Indexed on: expiresAt, createdAt

COMMAND WORKFLOW:

1. User submits slash command
2. Discord sends interaction to bot
3. interactionCreate.js event triggers
4. Command file located & executed
5. EconomyManager called for DB operations
6. Response sent to user via embed

FLOW EXAMPLE: /balance

User Types: /balance @Someone
    ↓
Bot receives interaction
    ↓
balance.js loads
    ↓
EconomyManager.getOrCreateUser() called
    ↓
MongoDB User collection queried
    ↓
User document returned
    ↓
Embed created with wallet/bank/networth
    ↓
Response sent to Discord

STARTUP SEQUENCE:

1. npm start / npm run dev
2. src/index.js loads
3. dotenv loads .env file
4. MongoDB connects (mongoose)
5. All commands loaded from /commands subdirs
6. All events loaded from /events
7. Bot logs into Discord API
8. 'ready' event fires
9. Slash commands registered with Discord
10. Bot is live and responding to commands!

TECHNOLOGY STACK:

- discord.js v14: Discord API wrapper
- mongoose: MongoDB ODM
- canvas: Image generation
- jimp: Image manipulation  
- axios: HTTP requests
- dotenv: Environment variables

STORAGE:

- MongoDB: User data, market listings
- No file storage needed
- All data persisted in database

This structure ensures:
✓ Clean separation of concerns
✓ Easy to add new commands
✓ Scalable database design
✓ Proper error handling
✓ Environment-based configuration
"""

print(project_structure)
