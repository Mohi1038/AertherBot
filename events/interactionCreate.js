module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`, error);
      
      // Check if interaction has already been replied to
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          flags: 64 // 64 = ephemeral flag
        });
      } else {
        // If already replied, try to follow up
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          flags: 64
        });
      }
    }
  }
};