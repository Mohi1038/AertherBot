const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { get } = require('../models/StudyTime');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('View your study time statistics')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('View another user\'s stats')
        .setRequired(false)
    ),
  
  async execute(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    
    try {
      const stats = await get(targetUser.id, interaction.guild.id);
      const totalMinutes = stats?.total_minutes || 0;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`📊 Study Stats for ${targetUser.username}`)
        .setThumbnail(targetUser.displayAvatarURL())
        .addFields(
          { name: 'Total Time', value: `${hours}h ${minutes}m`, inline: true },
          { 
            name: 'Last Updated', 
            value: stats?.last_update ? 
              `<t:${Math.floor(new Date(stats.last_update).getTime()/1000)}:R>` : 
              'Never',
            inline: true 
          }
        );
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Stats command failed:', error);
      await interaction.reply({
        content: '❌ Failed to fetch study statistics',
        ephemeral: true
      });
    }
  }
};