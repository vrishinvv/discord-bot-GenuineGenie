const mongo = require('@root/database/mongo');
const roleclaimSchema = require('@schemas/roleclaim-schema');
const { addToCache, displaySampleMessage } = require('@features/role-claim/role-claim');

//let { cache } = require('@root/cache/roleclaim-cache.js');

module.exports = {
    commands: ['setRoleClaim', 'set-roleclaim', 'set-role-claim'],
    expectedArgs: '<#channel_name>(opt)',
    description:
        'sets a channel to a `role claim channel`. Remember to assign roles to emojis before/after using this command for your purposes. A server can have only one role claim channel.',
    maxArgs: 1,
    callback: async (message, arguments, text, client) => {
        const { member, guild, content } = message;
        const channel = message.mentions.channels.first() || message.channel;
        let query = {};
        const result = await roleclaimSchema.findOne({ guildId });
        if (result) {
            query = JSON.parse(result.emojiRoles);
        }

        await roleclaimSchema
            .findOneAndUpdate(
                {
                    guildId: guild.id,
                },
                {
                    guildId: guild.id,
                    channelId: channel.id,
                    emojiRoles: JSON.stringify(query),
                },
                {
                    upsert: true,
                }
            )
            .exec();

        addToCache(guild.id, channel.id);

        message.reply('you have set this channel to a `role claim channel`!').then(async (message) => {
            message.delete({ timeout: 1000 * 5 });
        });
        message.delete();

        displaySampleMessage(channel, client);
    },
    permissions: ['ADMINISTRATOR'],
};
