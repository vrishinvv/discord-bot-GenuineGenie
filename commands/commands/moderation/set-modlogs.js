const mongo = require('@root/database/mongo');
const modlogsSchema = require('@schemas/modlogs-schema');
const { addToCache } = require('@features/mod-logs/mod-logs');
//let { cache } = require('@root/cache/modlogs-cache.js');

module.exports = {
    commands: ['setModLogs', 'set-modlogs', 'set-mod-logs'],
    description: 'sets a channel to be a `modlogs channel`',
    callback: async (message, arguments, text, client) => {
        const { member, channel, guild, content } = message;

        await mongo().then(async (mongoose) => {
            try {
                await modlogsSchema
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
        message.reply('you have set this channel to a `modlogs channel`!');
    },
    permissions: ['ADMINISTRATOR'],
};
