const mongo = require('@root/database/mongo');
const pollsSchema = require('@schemas/polls-schema');
const { addToCache } = require('@features/advanced-polls/advanced-polls');

//let { cache } = require('@root/cache/polls-cache.js');

module.exports = {
    commands: ['setPolls', 'set-polls'],
    expectedArgs: '<#channel_name>(opt)',
    description: 'sets a channel to a `polls channel. A server can have only one polls channel.`',
    maxArgs: 1,
    callback: async (message, arguments, text, client) => {
        const { member, guild, content } = message;

        const channel = message.mentions.channels.first() || message.channel;

        await mongo().then(async (mongoose) => {
            try {
                await pollsSchema
                    .findOneAndUpdate(
                        {
                            guildId: guild.id,
                        },
                        {
                            guildId: guild.id,
                            channelId: channel.id,
                        },
                        {
                            upsert: true,
                        }
                    )
                    .exec();
            } finally {
                //mongoose.connection.close();
            }
        });

        addToCache(guild.id, channel.id);

        message.reply('you have set this channel to a `polls channel`!');
    },
    permissions: ['ADMINISTRATOR'],
};
