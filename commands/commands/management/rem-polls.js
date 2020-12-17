const mongo = require('@root/database/mongo');
const pollsSchema = require('@schemas/polls-schema');
const { delFromCache } = require('@features/advanced-polls/advanced-polls');

module.exports = {
    commands: ['remPolls', 'rem-polls'],
    description: 'removes the current channel from being a `polls channel`',
    callback: async (message, arguments, text, client) => {
        const { member, channel, guild, content } = message;

        const result = await mongo().then(async (mongoose) => {
            try {
                return await pollsSchema
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
            message.reply('this channel was not a `polls channel`, but ok xD');
            return;
        }

        delFromCache(guild.id);

        message.reply('this channel is no longer a `polls channel`! ');
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
};
