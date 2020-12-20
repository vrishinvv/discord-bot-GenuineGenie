const thanksSchema = require('@schemas/thanks-schema');
const thanksChannelSchema = require('@schemas/thanks-channel-schema');

module.exports = {
    commands: ['thanks', 'thx', 'thenks', 'thank'],
    expectedArgs: "<user's @>",
    description: 'thank a user for helping you',
    permissionError: '',
    minArgs: 1,
    maxArgs: 1,
    callback: async (message, arguments, text, client) => {
        const target = message.mentions.users.first();
        if (!target) {
            message.reply('Please specify someone to thank');
            return;
        }

        const { guild } = message;
        const targetId = target.id;
        const guildId = guild.id;
        const authorId = message.author.id;
        const now = new Date();

        if (targetId === authorId) {
            message.reply('You cannot thank yourself :)');
            return;
        }

        const authorData = await thanksSchema.findOne({
            userId: authorId,
            guildId,
        });

        if (authorData && authorData.lastGave) {
            const then = new Date(authorData.lastGave);
            const diff = now.getTime() - then.getTime();

            const diffHours = Math.round(diff / (1000 * 60 * 60));
            const hours = 1;
            if (diffHours < hours) {
                message.reply(`you have already thanked someone within the last \`${hours}hr(s)\``);
                return;
            }
        }

        // Update the "lastGave" property
        await thanksSchema.findOneAndUpdate(
            {
                userId: authorId,
                guildId,
            },
            { userId: authorId, guildId, lastGave: now },
            { upsert: true }
        );

        // Increase how many thanks the target user had
        const result = await thanksSchema.findOneAndUpdate(
            {
                userId: targetId,
                guildId,
            },
            { userId: targetId, guildId, $inc: { received: 1 } },
            { upsert: true, new: true }
        );
        const amount = result.received;
        const { channelId: channelId2 } = await thanksChannelSchema.findOne({ guildId });
        message.reply(
            `You have thanked <@${targetId}>, they now have \`${amount}\` thanks. Check out <#${channelId2}>`
        );
    },
    permissions: [],
    requiredRoles: [],
};
