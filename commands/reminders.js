const { SlashCommandBuilder } = require('discord.js');
const ms = require('ms'); // convert 30m/2h/1d to milliseconds

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reminder')
    .setDescription('Remind a user after a certain time')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to remind')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('Time after which to remind (e.g. 30m, 2h)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const duration = interaction.options.getString('duration');

    const msDuration = ms(duration);
    if (!msDuration || msDuration > 24 * 60 * 60 * 1000) {
      return await interaction.reply({
        content: '❌ Please provide a valid duration (e.g. 30m, 2h), less than 24h.',
        flags: 64 // 64 = ephemeral flag
      });
    }

    await interaction.reply({
      content: `⏳ Reminder set! I'll ping ${user} in ${duration}.`,
      flags: 64
    });

    setTimeout(() => {
      interaction.channel.send(`⏰ Hey ${user}, time's up! ⏳`);
    }, msDuration);
  }
};
