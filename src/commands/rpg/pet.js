const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pet')
    .setDescription('Own and care for a pet!')
    .addSubcommand(subcommand =>
      subcommand
        .setName('adopt')
        .setDescription('Adopt a pet')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('status')
        .setDescription('Check your pet status')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('feed')
        .setDescription('Feed your pet')
        .addNumberOption(option =>
          option.setName('amount')
            .setDescription('Food amount')
            .setRequired(true)
            .setMinValue(1)
        )
    ),
  async execute(interaction) {
    try {
      const subcommand = interaction.options.getSubcommand();
      const user = await User.findOne({ userId: interaction.user.id });

      if (subcommand === 'adopt') {
        if (user && user.pet) {
          return await interaction.reply({
            content: '❌ You already have a pet!',
            ephemeral: true
          });
        }

        const petTypes = ['🐱 Cat', '🐶 Dog', '🦜 Parrot', '🐰 Rabbit', '🦊 Fox'];
        const pet = petTypes[Math.floor(Math.random() * petTypes.length)];

        if (!user) {
          await new User({
            userId: interaction.user.id,
            username: interaction.user.username,
            pet: { type: pet, hunger: 50, happiness: 50 }
          }).save();
        } else {
          user.pet = { type: pet, hunger: 50, happiness: 50 };
          await user.save();
        }

        const embed = new EmbedBuilder()
          .setColor('#3498db')
          .setTitle('🐾 Pet Adopted!')
          .setDescription(`You adopted a **${pet}**!`)
          .addFields(
            { name: 'Hunger', value: '50%', inline: true },
            { name: 'Happiness', value: '50%', inline: true }
          )
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } else if (subcommand === 'status') {
        if (!user || !user.pet) {
          return await interaction.reply({
            content: '❌ You don\'t have a pet! Use `/pet adopt` to get one.',
            ephemeral: true
          });
        }

        const embed = new EmbedBuilder()
          .setColor('#9b59b6')
          .setTitle('🐾 Pet Status')
          .setDescription(`Your **${user.pet.type}**`)
          .addFields(
            { name: 'Hunger', value: `${'█'.repeat(Math.floor(user.pet.hunger / 10))}${'░'.repeat(10 - Math.floor(user.pet.hunger / 10))} ${user.pet.hunger}%`, inline: false },
            { name: 'Happiness', value: `${'█'.repeat(Math.floor(user.pet.happiness / 10))}${'░'.repeat(10 - Math.floor(user.pet.happiness / 10))} ${user.pet.happiness}%`, inline: false }
          )
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } else if (subcommand === 'feed') {
        if (!user || !user.pet) {
          return await interaction.reply({
            content: '❌ You don\'t have a pet!',
            ephemeral: true
          });
        }

        const amount = Math.floor(interaction.options.getNumber('amount'));
        user.pet.hunger = Math.max(0, user.pet.hunger - amount);
        user.pet.happiness = Math.min(100, user.pet.happiness + 5);
        await user.save();

        const embed = new EmbedBuilder()
          .setColor('#2ecc71')
          .setTitle('🍖 Pet Fed!')
          .setDescription(`Your **${user.pet.type}** is happy!`)
          .addFields(
            { name: 'Hunger', value: `${user.pet.hunger}%`, inline: true },
            { name: 'Happiness', value: `${user.pet.happiness}%`, inline: true }
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
