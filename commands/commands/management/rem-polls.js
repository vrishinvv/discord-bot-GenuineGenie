const mongo = require('@root/database/mongo');
const pollsSchema = require('@schemas/polls-schema');
//let { cache } = require('@root/cache/polls-cache.js');

module.exports = {
    commands: ['rem-polls'],
    description: 'removes the current channel from being a `polls channel`',
    callback: async (message, arguments, text, client) => {
        const { member, channel, guild, content } = message;

        const result = await mongo().then(async (mongoose) => {
            try {
                return await pollsSchema
                    .findOneAndDelete(
                        {
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
            message.reply('this channel was not a `polls channel`, but ok xD');
            return;
        }

        message.reply('this channel is no longer a `polls channel`! ');
    },
    permissions: ['ADMINISTRATOR'],
};