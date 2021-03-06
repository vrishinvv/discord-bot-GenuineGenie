const updateVault = require('@utils/updateVault');
const getUser = require('@utils/getUser');

module.exports = {
    commands: ['dep', 'deposit'],
    expectedArgs: '<coins> -or- <max>',
    description: 'deposits coins into your vault',
    minArgs: 1,
    maxArgs: 1,
    //cooldown: 3,
    //repeats: 7,
    callback: async (message, arguments, text) => {
        const name = message.author.username;
        const userId = message.author.id;

        const result = await getUser(name, userId);

        const available_space_in_vault = result.vault_size - result.vault_coins;
        if (available_space_in_vault === 0) {
            message.reply('Your vault is already full!');
            return;
        }
        if (arguments[0] === 'max') {
            const toDeposit = Math.min(available_space_in_vault, result.coins);
            await updateVault(userId, toDeposit);
            message.reply(`Transferred **${toDeposit}** :coin: to vault.`);
        } else {
            let delta = +arguments[0];
            if (delta < 0) {
                message.reply('-.- what is negative cash?');
            } else if (delta > result.coins) {
                message.reply('You dont have that much to deposit!');
            } else if (delta > available_space_in_vault) {
                message.reply('Your vault will break if you deposit more than it can hold!');
            } else {
                await updateVault(userId, delta);
                message.reply(`Transferred **${delta}** :coin: to vault.`);
            }
        }
    },
};
