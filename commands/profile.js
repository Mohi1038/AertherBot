const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');
const StudyTime = require('../models/StudyTime');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View or edit your profile')
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('View your profile')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('The user to view (leave empty for yourself)')
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('edit')
        .setDescription('Edit your profile')
        .addStringOption(option =>
          option.setName('about')
            .setDescription('Your about me section')
            .setRequired(true)
        )
    ),
  
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === 'view') {
      const user = interaction.options.getUser('user') || interaction.user;
      const member = interaction.guild.members.cache.get(user.id);
      
      const [userData, studyData] = await Promise.all([
        User.get(user.id, interaction.guild.id),
        StudyTime.get(user.id, interaction.guild.id)
      ]);
      
      const totalMinutes = studyData?.total_minutes || 0;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`${member.displayName}'s Profile`)
        .setThumbnail(user.displayAvatarURL())
        .addFields(
          { name: 'About', value: userData?.about || 'No information set yet' },
          { name: 'Study Time', value: `${hours}h ${minutes}m`, inline: true },
          { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true }
        )
        .setFooter({ text: `Member since` })
        .setTimestamp(user.createdTimestamp);
      
      await interaction.reply({ embeds: [embed] });
      
    } else if (subcommand === 'edit') {
      const about = interaction.options.getString('about');
      await User.update(interaction.user.id, interaction.guild.id, { about });
      await interaction.reply({
        content: '✅ Your profile has been updated!',
        ephemeral: true
      });
    }
  }
};