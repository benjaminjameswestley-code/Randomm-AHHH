const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guild')
    .setDescription('Manage your guild / team!')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Create a new guild')
        .addStringOption(option =>
          option.setName('name')
            .setDescription('Guild name')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('invite')
        .setDescription('Invite someone to your guild')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('User to invite')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('leave')
        .setDescription('Leave your current guild')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('info')
        .setDescription('View guild info')
        .addStringOption(option =>
          option.setName('guild_name')
            .setDescription('Guild to view')
            .setRequired(false)
        )
    ),
  async execute(interaction) {
    try {
      const subcommand = interaction.options.getSubcommand();
      const user = await User.findOne({ userId: interaction.user.id });

      if (!user) {
        return await interaction.reply({
          content: '❌ User not found!',
          ephemeral: true
        });
      }

      if (subcommand === 'create') {
        if (user.guild) {
          return await interaction.reply({
            content: '❌ You already have a guild! Leave it first.',
            ephemeral: true
          });
        }

        const guildName = interaction.options.getString('name');

        user.guild = {
          name: guildName,
          leader: interaction.user.id,
          members: [interaction.user.id],
          createdAt: new Date()
        };

        await user.save();

        const embed = new EmbedBuilder()
          .setColor('#2ecc71')
          .setTitle('🏰 Guild Created!')
          .setDescription(`You created **${guildName}**!`)
          .addFields(
            { name: 'Members', value: '1', inline: true },
            { name: 'Your Role', value: 'Leader', inline: true }
          )
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } else if (subcommand === 'invite') {
        if (!user.guild) {
          return await interaction.reply({
            content: '❌ You don\'t have a guild!',
            ephemeral: true
          });
        }

        if (user.guild.leader !== interaction.user.id) {
          return await interaction.reply({
            content: '❌ Only the guild leader can invite members!',
            ephemeral: true
          });
        }

        const invitee = interaction.options.getUser('user');
        const inviteeData = await User.findOne({ userId: invitee.id });

        if (inviteeData && inviteeData.guild) {
          return await interaction.reply({
            content: `❌ ${invitee.username} is already in a guild!`,
            ephemeral: true
          });
        }

        user.guild.members.push(invitee.id);
        await user.save();

        if (inviteeData) {
          inviteeData.guild = user.guild;
          await inviteeData.save();
        }

        const embed = new EmbedBuilder()
          .setColor('#3498db')
          .setTitle('👥 Member Invited!')
          .setDescription(`${invitee.username} joined **${user.guild.name}**!`)
          .addFields(
            { name: 'Total Members', value: `${user.guild.members.length}`, inline: true }
          )
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } else if (subcommand === 'leave') {
        if (!user.guild) {
          return await interaction.reply({
            content: '❌ You\'re not in a guild!',
            ephemeral: true
          });
        }

        const guildName = user.guild.name;

        if (user.guild.leader === interaction.user.id) {
          return await interaction.reply({
            content: '❌ Guild leader cannot leave! Disband or transfer leadership first.',
            ephemeral: true
          });
        }

        user.guild.members = user.guild.members.filter(m => m !== interaction.user.id);
        user.guild = null;
        await user.save();

        const embed = new EmbedBuilder()
          .setColor('#e74c3c')
          .setTitle('👋 Left Guild')
          .setDescription(`You left **${guildName}**!`)
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } else if (subcommand === 'info') {
        if (!user.guild) {
          return await interaction.reply({
            content: '❌ You\'re not in a guild!',
            ephemeral: true
          });
        }

        const embed = new EmbedBuilder()
          .setColor('#9b59b6')
          .setTitle(`🏰 ${user.guild.name}`)
          .addFields(
            { name: 'Leader', value: `<@${user.guild.leader}>`, inline: true },
            { name: 'Members', value: `${user.guild.members.length}`, inline: true },
            { name: 'Created', value: `<t:${Math.floor(user.guild.createdAt.getTime() / 1000)}:R>`, inline: false }
          )
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred.', ephemeral: true });
    }
  }
};
