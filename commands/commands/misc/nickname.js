const { MessageEmbed } = require('discord.js');
const { version } = require('@root/package.json');

module.exports = {
    commands: ['nickname', 'nick'],
    expectedArgs: "<user's @> <nickname>",
    description: 'change your nickanme',
    minArgs: 1,
    maxArgs: 2,
    callback: async (message, arguments, text, client) => {
        const author = message.author;
        const target = message.mentions.users.first() || message.author;
        //console.log(target);
        if (!target) {
            message.reply("Please provide a valid user's @");
            return;
        }

        if (message.mentions.users.size !== 0) arguments.shift();

        const member = message.guild.members.cache.get(target.id);
        const auth_member = message.guild.members.cache.get(author.id);
        if (author.username !== target.username) {
            if (!auth_member.hasPermission('ADMINISTRATOR')) {
                message.reply('you can only change your nickname');
                return;
            }
        }
        const nickname = arguments.join(' ');

        let exit = 0;
        await member.setNickname(nickname).catch((err) => {
            message.reply('woah the bot cannot mess with this user it seems!');
            exit = 1;
        });
        if (exit) return;
        message.reply('you have changed the nickname!');
    },
    permissions: [],
    requiredRoles: [],
};
