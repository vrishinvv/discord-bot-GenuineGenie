const getUser = require('../../helper-snips/getUser');
const updateCoins = require('../../helper-snips/updateCoins');

module.exports = {
    commands: ['greater-give'],
    description: 'admin/role specific - donates said amount to someone else',
    expectedArgs: "<user's @> <coins>",
    permissionError: '',
    minArgs: 2,
    maxArgs: 2,
    /* cooldown: 5,
    repeats: 3, */
    callback: async (message, arguments, text) => {
        const target = message.mentions.users.first();
        if (!target) {
            message.reply('No such user exists');
            return;
        }

        arguments.shift();

        const targetName = target.username;
        const targetId = target.id;
        const dummy = await getUser(targetName, targetId);

        const delta = +arguments[0];
        if (isNaN(delta)) {
            message.reply('please provide a valid amount of coins to give');
            return;
        }

        await updateCoins(targetId, +delta);
        message.channel.send(
            `<@${targetId}>, the god's favour you! you were instantly given **${delta}** :coin: to <@${targetId}>.`
        );
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
};
