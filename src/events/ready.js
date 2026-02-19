module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`✅ Bot logged in as ${client.user.tag}`);
    console.log(`📊 Ready to serve ${client.guilds.cache.size} servers`);
    
    // Set activity/status
    client.user.setActivity('/work | /balance | /adventure', { type: 'WATCHING' });
  }
};
