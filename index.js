const path = require('path');
const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');
const roleClaim = require('./role-claim/role-claim.js');
const welcome = require('./welcome-message/welcome.js');

client.setMaxListeners(100);

console.log('Starting up Discord Client...');
client.on('ready', () => {
    console.log('Estabished connection with Discord...');
    console.log(`Logged in as ${client.user.tag}!\n`);

    const baseFile = 'command-base.js';
    const commandBase = require(`./commands/${baseFile}`);

    // Registering all the commands
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

    // Setting bot's status
    client.user.setPresence({
        activity: {
            name: `"${config.prefix} help" for help`,
        },
    });

    // initialising the role-claim chanel
    roleClaim(client);

    //setting up welome
    welcome(client);
});

client.login(config.token);
