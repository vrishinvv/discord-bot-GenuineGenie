const mongo = require('@root/database/mongo');
const verificationChannelsSchema = require('@schemas/verification-channels-schema');
const { fetch } = require('@features/verification-channel/verification-channel');
//let { cache } = require('@root/cache/verification-channels-cache.js');

module.exports = {
    commands: ['setVerification', 'set-verification', 'set-ver'],
    description:
        'set a channel to a `verification channel`. This will set the previous message in the channel as the message to vefiy with. Please specifiy a role which is lower than the bots role in the server. A server can have only one verification channel.',
    expectedArgs: '<emoji> <role> <#channel_name>(opt)',
    permissionError: '',
    minArgs: 2,
    maxArgs: 3,
    callback: async (message, arguments, text, client) => {
        const seconds = 3;
        const { member, guild, content } = message;
        const channel = message.mentions.channels.first() || message.channel;

        if (message.mentions.channels.first()) {
            arguments.length = arguments.length - 1;
            text = arguments.join(' ');
        }

        let emoji = arguments[0];
        const roleName = arguments[1];
        const role = guild.roles.cache.find((role) => role.name === roleName);
        if (!role) {
            message.reply('That role does not exist').then((message) => {
                setTimeout(() => {
                    // deletes the bots response message
                    message.delete();
                }, seconds * 1000);
            });

            // delete the message the user sent
            message.delete().catch((err) => {
                console.log('cannot delete server owners message', err);
            }); // but if server owner sent this, then it becomes forbidden
            return;
        }

        const roleId = role.id;

        //Custom emojis have this syntax { EmojiName: emojiCode }
        if (emoji.includes(':')) {
            const split = emoji.split(':');
            const emojiName = split[1];
            emoji = guild.emojis.cache.find((emoji) => {
                return emoji.name === emojiName;
            });
        }

        // deleting user's message, which is a command
        message.delete().then(() => {
            channel.messages.fetch({ limit: 1 }).then(async (results) => {
                const firstMessage = results.first();
                if (!firstMessage) {
                    channel.send('There is no message to react to').then((message) => {
                        // deletes the bots response message

                        message.delete({ timeout: seconds * 1000 });
                    });
                }

                // react to latest message with emoji
                firstMessage.react(emoji);

                // update to mongo db
                await mongo().then(async (mongoose) => {
                    try {
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
