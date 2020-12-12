const updateVault = require('../../helper-snips/updateVault');
const getUser = require('../../helper-snips/getUser');

module.exports = {
    commands: ['dep', 'deposit'],
    expectedArgs: '<coins> -or- <max>',
    minArgs: 1,
    maxArgs: 1,
    //cooldown: 3,
    //repeats: 7,
    callback: async (message, arguments, text) => {
        const name = message.author.username;
        const userId = message.author.id;

        const result = await getUser(name, userId);

        const available = result.vault_size - result.vault_coins;
        if (available === 0) {
            message.reply('Your vault is already full!');
            return;
        }
        if (arguments[0] === 'max') {
            await updateVault(userId, available);
            message.reply(`Transferred **${available}** :coin: to vault.`);
        } else {
            let delta = +arguments[0];
            if (delta < 0) {
                message.reply('-.- what is negative cash?');
            } else if (delta > result.coins) {
                message.reply('You dont have that much to deposit!');
            } else if (delta > available) {
                message.reply('Your vault will break if you deposit more than it can hold!');
            } else {
                await updateVault(userId, delta);
                message.reply(`Transferred **${delta}** :coin: to vault.`);
            }
        }
    },
};
