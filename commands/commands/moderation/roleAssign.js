const mongo = require('@root/database/mongo');
const roleclaimSchema = require('@schemas/roleclaim-schema');
const { roleclaimCache } = require('@features/role-claim/role-claim');
const { delFromCache } = require('@features/role-claim/role-claim');
const { addToCache } = require('@features/role-claim/role-claim');

//let { cache } = require('@root/cache/role claim-cache.js');

module.exports = {
    commands: ['roleAssign', 'role-assign'],
    expectedArgs: '<emoji> <role_name>/"del"',
    description: 'assigns a Role name to an emoji - needed for creating a role claim channel',
    callback: async (message, arguments, text, client) => {
        const customEmoji = (emojiName) => {
            emojiName = emojiName.split(':')[1];
            return guild.emojis.cache.find((emoji) => emoji.name === emojiName);
        };

        const { member, channel, guild, content } = message;
        const guildId = guild.id;
        const channelId = roleclaimCache()[guildId][0];

        // checks if role claim channel has been set for this guild
        if (!channelId) {
            message.reply('you need to set up a `role claim channel` before using this command');
            return;
        }

        let emoji = arguments[0];
        const orig = emoji;

        if (customEmoji(emoji)) emoji = customEmoji(emoji).name;

        arguments.shift();
        const roleName = arguments.join(' ');

        if (roleName === 'del') {
            await mongo().then(async (mongoose) => {
                try {
                    const result = await roleclaimSchema.findOne({ guildId });

                    let assigns = JSON.parse(result.emojiRoles);

                    delete assigns[emoji];
                    await roleclaimSchema.findOneAndUpdate(
                        { guildId },
                        { guildId, channelId, emojiRoles: JSON.stringify(assigns) },
                        {}
                    );
                    addToCache(guildId, channelId, assigns);
                } finally {
                }
            });
            message.reply('yup we have deleted that emoji');
            //console.log(roleclaimCache());
            return;
        }
        // check if such a role exists
        const role = guild.roles.cache.find((role) => {
            return role.name === roleName;
        });
        if (!role) {
            message.reply(`There is no role "${roleName}"`);
            return;
        }

        //console.log();
        await mongo().then(async (mongoose) => {
            try {
                const result = await roleclaimSchema.findOne({ guildId });
                console.log(result);
                console.log(JSON.parse(result.emojiRoles));
                let assigns = JSON.parse(result.emojiRoles);

                assigns[emoji] = roleName;
                // console.log(assigns, guildId, channelId);
                await roleclaimSchema.findOneAndUpdate(
                    { guildId },
                    { guildId, channelId, emojiRoles: JSON.stringify(assigns) },
                    {}
                );
                addToCache(guildId, channelId, assigns);
            } finally {
            }
        });

        message.reply(`you have assigned ${orig} for \`${roleName}\``);
    },

    requiredRoles: 'Moderator',
};
