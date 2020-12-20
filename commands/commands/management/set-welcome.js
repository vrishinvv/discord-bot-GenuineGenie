const mongo = require('@root/database/mongo');
const welcomeSchema = require('@schemas/welcome-schema');
const { addToCache } = require('@features/welcome/welcome.js');

module.exports = {
    commands: ['setWelcome', 'set-welcome'],
    expectedArgs: '<channel<welcome_text>',
    description: 'sets a channel to a `welcome channel.  A server can have only one welcome channel.`',
    maxArgs: null,
    callback: async (message, arguments, text, client) => {
        const { member, guild, content } = message;
        const channel = message.mentions.channels.last() || message.channel;

        if (message.mentions.channels.first()) {
            arguments.length = arguments.length - 1;
        }
        //console.log(arguments);
        text = arguments.join(' ');
        //console.log(arguments);
        //console.log(channel.id);
        if (text === '') {
            //console.log(message.mentions.channel.first().id, message.channel.id);
            message.reply('Cannot set welcome message to empty string');
            return;
        }

        await welcomeSchema
            .findOneAndUpdate(
                {
                    guildId: guild.id,
                },
                {
                    guildId: guild.id,
                    channelId: channel.id,
                    text,
                },
                {
                    upsert: true,
                }
            )
            .exec();

        addToCache(guild.id, channel.id, text);
        message.reply(`you have set <#${channel.id}> to a \`welcome channel\`!`);
    },
    permissions: ['ADMINISTRATOR'],
};
