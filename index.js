require('module-alias/register');

const Discord = require('discord.js');
const client = new Discord.Client();
client.setMaxListeners(100);

const config = require('@root/config.json');
const loadCommands = require('@root/commands/load-commands');
const loadFeatures = require('@root/features/load-features');

console.log('Starting up Discord Client...');
client.on('ready', async () => {
    console.log('Estabished connection with Discord...');
    console.log(`Logged in as ${client.user.tag}!\n`);

    // Load commands
    loadCommands(client);

    // Load features
    loadFeatures(client);

    // Setting bot's status
    client.user.setPresence({
        activity: {
            name: `"${config.prefix} help" for help`,
        },
    });
});

client.login(config.token);
