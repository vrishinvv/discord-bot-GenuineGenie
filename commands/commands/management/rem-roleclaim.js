const mongo = require('@root/database/mongo');
const roleclaimSchema = require('@schemas/roleclaim-schema');
const { delFromCache } = require('@features/role-claim/role-claim');

//let { cache } = require('@root/cache/roleclaim-cache.js');

module.exports = {
    commands: ['remRoleClaim', 'rem-roleClaim', 'rem-role-claim'],
    description: 'removes the current channel from being a `role claim channel`',
    callback: async (message, arguments, text, client) => {
        const { member, channel, guild, content } = message;

        const result = await mongo().then(async (mongoose) => {
            try {
                return await roleclaimSchema
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
            message.reply('this channel was not a `role claim channel`, but ok xD');
            return;
        }

        delFromCache(guild.id);

        message.reply('this channel is no longer a `roleclaim channel`! ');
    },
    permissions: ['ADMINISTRATOR'],
};
