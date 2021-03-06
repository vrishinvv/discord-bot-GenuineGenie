const mongo = require('@root/database/mongo');
const welcomeSchema = require('@schemas/welcome-schema');
const { delFromCache } = require('@features/welcome/welcome');
//let cache = require('@root/cache/welcome-cache.js');

module.exports = {
    commands: ['remWelcome', 'rem-welcome'],
    description: 'removes the current channel from being a `welcome channel`',
    callback: async (message, arguments, text, client) => {
        const { member, channel, guild, content } = message;

        const result = await mongo().then(async (mongoose) => {
            try {
                return await welcomeSchema
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
            message.reply('this channel was not a `welcome channel`, but ok xD');
            return;
        }

        delFromCache(guild.id);
        message.reply('this channel is no longer a `welcome channel`! ');
    },
    permissions: ['ADMINISTRATOR'],
};
