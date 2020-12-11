const path = require('path');
const fs = require('fs');
const config = require('./config.json');
const Discord = require('discord.js');

const client = new Discord.Client();

console.log('Starting up Discord Client...');
client.on('ready', () => {
    console.log('Estabished connection with Discord...');
    console.log(`Logged in as ${client.user.tag}!\n`);

    const baseFile = 'command-base.js';
    const commandBase = require(`./commands/${baseFile}`);

    const readCommands = (dir) => {
        const files = fs.readdirSync(path.join(__dirname, dir));
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file));
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file));
            } else if (file !== baseFile) {
                const options = require(path.join(__dirname, dir, file));
                commandBase(client, options);
            }
        }
    };
    readCommands('commands');

    client.user.setPresence({
        activity: {
            name: `"${config.prefix} help" for help`,
        },
    });
});

client.login(config.token);
