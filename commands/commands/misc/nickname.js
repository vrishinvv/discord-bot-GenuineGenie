const { MessageEmbed } = require('discord.js');
const { version } = require('@root/package.json');

module.exports = {
    commands: ['nickname', 'nick'],
    expectedArgs: "<user's @> <nickname>",
    description: 'change your nickanme',
    callback: async (message, arguments, text, client) => {
        const author = message.author;
        const target = message.mentions.users.first();
        const member = message.guild.members.cache.get(target.id);
        const auth_member = message.guild.members.cache.get(author.id);
        if (author.username !== target.username) {
            if (!auth_member.hasPermission('ADMINISTRATOR')) {
                message.reply('you can only change your nickname');
                return;
            }
        }
        arguments.shift();
        const nickname = arguments.join(' ');
        console.log(nickname);
        member.setNickname(nickname);
        message.reply('you have changed the nickname!');
    },
    permissions: [],
    requiredRoles: [],
};
