const mongo = require('@root/database/mongo');
const suggestionsSchema = require('@schemas/suggestions-schema');
const { fetchSuggestionsChannels } = require('@features/suggestions/suggestions');

module.exports = {
    commands: ['set-suggestions', 'setSuggestions'],
    expectedArgs: '<#channel_name>(opt)',
    description: 'set the current channel into a suggestions channel. A server can have only one sugestions channel.',
    maxArgs: 1,
    permissionError: '',
    callback: async (message, arguments, text, client) => {
        //console.log('im in');
        const channel = message.mentions.channels.first() || message.channel;
        const {
            guild: { id: guildId },
        } = message;

        const { id: channelId } = channel;

        await mongo().then(async (mongoose) => {
            try {
                await suggestionsSchema
                    .findOneAndUpdate(
                        {
                            guildId,
                        },
                        {
                            guildId,
                            channelId,
                        },
                        {
                            new: true,
                            upsert: true,
                        }
                    )
                    .exec();

                message.reply(`you have set ${channel} as the \`suggestions channel\`!`);

                fetchSuggestionsChannels(guildId);
            } finally {
            }
        });
    },
    permissions: ['ADMINISTRATOR'],
};
