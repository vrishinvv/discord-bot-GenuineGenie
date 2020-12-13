const mongo = require('@root/database/mongo');
const welcomeSchema = require('@schemas/welcome-schema');

module.exports = {
    commands: ['rem-welcome'],
    description: 'removes the current channel from being a `welcome channel`',
    callback: async (message, arguments, text, client) => {
        const { member, channel, guild, content } = message;

        const result = await mongo().then(async (mongoose) => {
            try {
                return await welcomeSchema
                    .findOneAndDelete({
                        _id: guild.id,
                        channelId: channel.id,
                    })
                    .exec();
            } finally {
                //mongoose.connection.close();
            }
        });

        if (!result) {
            message.reply('this channel was not a `welcome channel`, but ok xD');
            return;
        }

        message.reply('this channel is no longer a `welcome channel`! ');
    },
    permissions: ['ADMINISTRATOR'],
};
