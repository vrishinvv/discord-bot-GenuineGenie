const mongo = require('@root/database/mongo');
const modlogsSchema = require('@schemas/modlogs-schema');
const { delFromCache } = require('@features/mod-logs/mod-logs');

//let { cache } = require('@root/cache/modlogs-cache.js');

module.exports = {
    commands: ['remModLogs', 'rem-modlogs', 'rem-mod-logs'],
    description: 'removes the current channel from being a `modlogs channel`',
    callback: async (message, arguments, text, client) => {
        const { member, channel, guild, content } = message;

        const result = await mongo().then(async (mongoose) => {
            try {
                return await modlogsSchema
                    .findOneAndDelete(
                        {
                            guildId: guild.id,
                            channelId: channel.id,
                        },
                        {
                            new: false,
                        }
                    )
                    .exec();
            } finally {
                //mongoose.connection.close();
            }
        });

        if (!result) {
            message.reply('this channel was not a `modlogs channel`, but ok xD');
            return;
        }

        delFromCache(guild.id);

        message.reply('this channel is no longer a `modlogs channel`! ');
    },
    permissions: ['ADMINISTRATOR'],
};
