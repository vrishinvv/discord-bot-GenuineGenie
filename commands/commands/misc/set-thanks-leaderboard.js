const thanksChannelSchema = require('@schemas/thanks-channel-schema');

module.exports = {
    commands: ['setThanks', 'set-thanks', 'set-thenks', 'set-thanksLeaderBoard'],
    expectedArgs: '<#channel_name>(opt)',
    description: 'set a channel as a `thanks leaderbaord` channel',
    maxArgs: 1,
    callback: async (message, arguments, text, client) => {
        const { guild } = message;

        const guildId = guild.id;
        const channel = message.mentions.channels.first() || message.channel;
        const channelId = channel.id;

        await thanksChannelSchema.findOneAndUpdate(
            {
                guildId,
            },
            {
                guildId,
                channelId,
            },
            {
                upsert: true,
            }
        );

        message.reply('you have set this channel to a `thanks leaderboard channel`!').then((message) => {
            message.delete({
                timeout: 1000 * 5,
            });
        });
        message.delete();
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
};
