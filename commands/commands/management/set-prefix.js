const mongo = require('@root/database/mongo');
const prefixSchema = require('@schemas/prefix-schema');
const { loadPrefixes } = require('../../command-base');
module.exports = {
    commands: ['set-prefix', 'set-pre', 'prefix', 'pre'],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<the new pefix>',
    callback: async (message, arguments, text, client) => {
        const guildId = message.guild.id;
        const prefix = arguments[0];
        await mongo().then(async (mongoose) => {
            try {
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
            } finally {
            }
        });

        loadPrefixes(client, guildId);
        message.reply(`you have set the new command to prefix \`${prefix}\``);
    },
    permissions: ['ADMINISTRATOR'],
};
