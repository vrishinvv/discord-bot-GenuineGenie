const mongo = require('@root/database/mongo');
const verificationChannelsSchema = require('../../../database/schemas/verification-channels-schema');
const { fetch } = require('@features/verification-channel/verification-channel');
//let { cache } = require('@root/cache/verification-channels-cache.js');

module.exports = {
    commands: ['set-verification', 'set-ver'],
    description: 'creates a `verification channel`',
    expectedArgs: '<emoji> <roleID>',
    permissionError: '',
    minArgs: 2,
    maxArgs: 2,
    callback: async (message, arguments, text, client) => {
        const seconds = 3;
        const { member, channel, guild, content } = message;

        let emoji = arguments[0];
        const roleId = arguments[1];
        console.log(emoji, roleId);

        //Custom emojis have this syntax { EmojiName: emojiCode }
        if (emoji.includes(':')) {
            const split = emoji.split(':');
            const emojiName = split[1];
            emoji = guild.emojis.cache.find((emoji) => {
                return emoji.name === emojiName;
            });
        }

        const role = guild.roles.cache.get(roleId);
        if (!role) {
            message.reply('That role does not exist').then((message) => {
                setTimeout(() => {
                    // deletes the bots response message
                    message.delete();
                }, seconds * 1000);
            });

            // delete the message the user sent
            message.delete();
            return;
        }

        // deleting user's message, which is a command
        message.delete().then(() => {
            channel.messages.fetch({ limit: 1 }).then(async (results) => {
                const firstMessage = results.first();
                if (!firstMessage) {
                    channel.send('There is no message to react to').then((message) => {
                        // deletes the bots response message
                        setTimeout(() => {
                            message.delete();
                        }, seconds * 1000);
                    });
                }

                console.log('REACHED HERE');
                // react to latest message with emoji
                firstMessage.react(emoji);

                // update to mongo db
                await mongo().then(async (mongoose) => {
                    try {
                        console.log('WRITING TO MONGO');
                        await verificationChannelsSchema
                            .findOneAndUpdate(
                                { guildId: guild.id },
                                { guildId: guild.id, channelId: channel.id, roleId },
                                { upsert: true }
                            )
                            .exec();
                    } finally {
                    }
                });

                await fetch(client);
            });
        });
    },
    permissions: ['ADMINISTRATOR'],
};
