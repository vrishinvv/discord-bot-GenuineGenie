const thanksChannelSchema = require('@schemas/thanks-channel-schema');
const { updateLeaderBoard } = require('@features/thanks/thanks-lb');
module.exports = {
    commands: ['setThanks', 'set-thanks', 'set-thenks', 'set-thanksLeaderBoard'],
    expectedArgs: '<#channel_name>(opt)',
    description:
        'set a channel as a `thanks leaderbaord` channel. Make sure the server is empty befoer running this command.  A server can have only one thanks leaderboard channel.',
    maxArgs: 1,
    callback: async (message, arguments, text, client) => {
        const { guild } = message;

        const guildId = guild.id;
        const channel = message.mentions.channels.first() || message.channel;
        const channelId = channel.id;

        const collected = await channel.messages.fetch();
        if (collected.size > 1) {
            await message.reply('channel must be empty when you run this command').then((message) => {
                message.delete({ timeout: 5 * 1000 });
            });
            message.delete();
            return;
        }
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

        await message.delete();
        /* await message.reply('you have set this channel to a `thanks leaderboard channel`!').then((message) => {
            message.delete({
                timeout: 1000 * 5,
            });
        }); */
        updateLeaderBoard(client, guild, channel);
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
};
