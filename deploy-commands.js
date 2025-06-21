const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Load all command definitions
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`[WARNING] The command at ${file} is missing "data" or "execute".`);
  }
}

// Register commands globally
const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    console.log(`🔁 Refreshing ${commands.length} application (/) commands globally...`);

    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands },
    );

    console.log('✅ Successfully registered application (/) commands globally.');
  } catch (error) {
    console.error('❌ Failed to register commands:', error);
  }
})();
