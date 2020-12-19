const mongo = require('@root/database/mongo');
const prefixSchema = require('@schemas/prefix-schema');
const { loadPrefixes, updatePrefix } = require('../../command-base');
module.exports = {
    commands: ['setPrefix', 'set-prefix', 'set-pre', 'prefix', 'pre'],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<the new pefix>',
    callback: async (message, arguments, text, client) => {
        const guildId = message.guild.id;
        const prefix = arguments[0];

        await prefixSchema
            .findOneAndUpdate(
                {
                    guildId,
                },
                {
                    guildId,
                    prefix,
                },
                {
                    upsert: true,
                }
            )
            .exec();

        loadPrefixes(client, guildId);
        updatePrefix(guildId, prefix);
        message.reply(`you have set the new command to prefix \`${prefix}\``);
    },
    permissions: ['ADMINISTRATOR'],
};
