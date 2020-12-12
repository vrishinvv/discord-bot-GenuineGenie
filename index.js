const Discord = require('discord.js');
const client = new Discord.Client();
client.setMaxListeners(100);

const config = require('./config.json');
const roleClaim = require('./global-listeners/role-claim/role-claim.js');
const welcome = require('./global-listeners/welcome-message/welcome1.js');
const memberCount = require('./global-listeners/memeber-count/member-count.js');
const messageCounter = require('./global-listeners/message-counter/message-counter.js');
const advacnedPolls = require('./advanced-polls.js');
const mongo = require('./mongo');
const loadCommands = require('./commands/load-commands');

console.log('Starting up Discord Client...');
client.on('ready', async () => {
    console.log('Estabished connection with Discord...');
    console.log(`Logged in as ${client.user.tag}!\n`);

    await mongo().then((mongoose) => {
        try {
            console.log('Estabished connection with MongoDB...');
        } finally {
            mongoose.connection.close();
        }
    });

    // Load commands
    loadCommands(client);

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

    //Member Count channel
    memberCount(client);

    //Message Counter
    messageCounter(client);

    //advanced Polls
    advacnedPolls(client);
});

client.login(config.token);
