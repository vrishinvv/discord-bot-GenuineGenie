const Commando = require('discord.js-commando');

module.exports = class kickCommand extends (
    Commando.Command
) {
    constructor(client) {
        super(client, {
            name: 'kick',
            group: 'moderation',
            memberName: 'kick',
            description: 'Kicks a member from the discord server',
            clientPermissions: ['KICK_MEMBERS'], // perimsiion for the bot
            userPermissions: ['KICK_MEMBERS'], // perimsiion for the user            argsType: 'multiple',
        });
    }

    async run(message) {
        const target = message.mentions.users.first();
        if (!target) {
            message.reply('Please specify a correct username');
            return;
        }

        const { guild } = message;
        const member = guild.members.cache.get(target.id);
        if (member.kickable) {
            member.kick();
            message.reply('that user has been kicked');
        } else {
            message.reply('hat user cannot be kicked');
        }
    }
};
