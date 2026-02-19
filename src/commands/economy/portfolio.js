const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('portfolio')
    .setDescription('View your investment portfolio'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      let user = await User.findOne({ userId });
      if (!user) {
        return interaction.reply({ content: 'Create a profile first with `/balance`', ephemeral: true });
      }

      const totalInvested = (user.stocks.investments || []).reduce((sum, inv) => sum + inv.amount, 0);
      const expectedReturn = Math.floor(totalInvested * 1.15);

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('📊 Investment Portfolio')
        .addFields(
          { name: 'Total Invested', value: `💰 ${totalInvested}` },
          { name: 'Expected Return', value: `💰 ${expectedReturn}` },
          { name: 'Profit', value: `💰 ${expectedReturn - totalInvested}` },
          { name: 'Active Investments', value: `${(user.stocks.investments || []).length}` },
          { name: 'Stocks Owned', value: `${(user.stocks.owned || []).length}` }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Error fetching portfolio', ephemeral: true });
    }
  }
};
