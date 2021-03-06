const getUser = require('@utils/getUser');
const updateCoins = require('@utils/updateCoins');

module.exports = {
    commands: ['give'],
    description: 'donates said amount to someone else',
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

        if (target.id === message.author.id) {
            message.reply('Funny you thought that will work xD');
            return;
        }

        arguments.shift();
        const delta = +arguments[0];
        if (isNaN(delta)) {
            message.reply('please provide a valid amount of coins to give');
            return;
        }

        const userName = message.author.username;
        const userId = message.author.id;

        const targetName = target.username;
        const targetId = target.id;

        const result = await getUser(userName, userId);
        const dummy = await getUser(targetName, targetId);

        const available = result.coins;
        if (available === 0) {
            message.reply('you dont have coins in the first place. Think about donating later');
            return;
        }

        console.log(target);
        if (arguments[0] === 'max') {
            await updateCoins(userId, -available);
            await updateCoins(targetId, +available);
            message.channel.send(`<@${userId}>, What a samaritan! you gave **${available}** :coin: to <@${targetId}>.`);
        } else {
            let delta = +arguments[0];
            if (delta < 0) {
                message.reply('-.- what is negative cash?');
            } else if (delta > result.coins) {
                message.reply('You dont have that much to throw around!');
            } else {
                await updateCoins(userId, -delta);
                await updateCoins(targetId, +delta);
                message.channel.send(`<@${userId}>, What a samaritan! you gave **${delta}** :coin: to <@${targetId}>.`);
            }
        }
    },
    permissions: [],
    requiredRoles: [],
};
