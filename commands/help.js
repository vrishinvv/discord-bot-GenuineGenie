const Discord = require('discord.js');
const { prefix } = require('../config.json');
module.exports = {
    commands: ['help'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text) => {
        message.channel.send(
            `**${prefix} ping** - replies with pong
**${prefix} add <num1> <num2>** - adds 2 numbers
**${prefix} create-vc <vc_name>** - creates a voice channel
**${prefix} create-tc <tc_name>** - creates a text channel
**${prefix} give-role <user's@> <role>** - gives a role to a user
**${prefix} remove-role <user's@> <role>** - removes a role from a user
**${prefix} server-info** - displays server info`
        );
    },
};
