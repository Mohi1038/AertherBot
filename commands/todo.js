const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Todo  = require('../models/Todo');
const User = require('../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('todo')
    .setDescription('Manage your to-do list and reminders')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a new task')
        .addStringOption(option =>
          option.setName('task')
            .setDescription('The task to add')
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName('deadline')
            .setDescription('Optional deadline (YYYY-MM-DD)')
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List your current tasks')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('complete')
        .setDescription('Mark a task as complete')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('reminders')
        .setDescription('Set up study reminders')
        .addStringOption(option =>
          option.setName('frequency')
            .setDescription('How often to remind you')
            .setRequired(true)
            .addChoices(
              { name: 'Daily', value: 'daily' },
              { name: 'Weekly', value: 'weekly' },
              { name: 'Monthly', value: 'monthly' }
            )
        )
        .addStringOption(option =>
          option.setName('time')
            .setDescription('Time of day (HH:MM)')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    
    if (subcommand === 'add') {
      const task = interaction.options.getString('task');
      const deadline = interaction.options.getString('deadline');
      
      await Todo.addTask(userId, guildId, task, deadline);
      await interaction.reply({
        content: '✅ Task added to your to-do list!',
        flags: 64 // 64 = ephemeral flag
      });
      
    } else if (subcommand === 'list') {
      const tasks = await Todo.getTasks(userId, guildId);
      
      if (tasks.length === 0) {
        return interaction.reply({
          content: 'You have no tasks in your to-do list!',
          flags: 64
        });
      }
      
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Your To-Do List')
        .setDescription(tasks.map((task, index) => 
          `**${index + 1}.** ${task.task}${task.deadline ? ` (📅 ${task.deadline})` : ''}`
        ).join('\n'));
      
      await interaction.reply({ embeds: [embed], flags: 64 });
      
    } else if (subcommand === 'complete') {
      const tasks = await Todo.getTasks(userId, guildId);
      
      if (tasks.length === 0) {
        return interaction.reply({
          content: 'You have no tasks to complete!',
          flags: 64
        });
      }
      
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('complete-task')
        .setPlaceholder('Select a task to complete')
        .addOptions(tasks.map(task => ({
          label: task.task.length > 25 ? task.task.substring(0, 22) + '...' : task.task,
          value: task.id.toString()
        })));
      
      const row = new ActionRowBuilder().addComponents(selectMenu);
      
      await interaction.reply({
        content: 'Select a task to mark as complete:',
        components: [row],
        flags: 64
      });
      
    } else if (subcommand === 'reminders') {
      const frequency = interaction.options.getString('frequency');
      const time = interaction.options.getString('time');
      
      await User.update(userId, guildId, { 
        reminder_frequency: frequency,
        reminder_time: time
      });
      
      await interaction.reply({
        content: `✅ Reminders set to ${frequency} at ${time}`,
        flags: 64
      });
    }
  }
};