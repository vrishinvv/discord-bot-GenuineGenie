const updateVault = require('@utils/updateVault');
const getUser = require('@utils/getUser');

module.exports = {
    commands: ['with', 'wit', 'withdraw'],
    description: 'withdraws coins into from vault',
    expectedArgs: '<coins> -or- <max>',
    minArgs: 1,
    maxArgs: 1,
    //cooldown: 3,
    //repeats: 7,
    callback: async (message, arguments, text) => {
        const name = message.author.username;
        const userId = message.author.id;

        const result = await getUser(name, userId);

        if (result.vault_coins === 0) {
            message.reply('Your vault is empty  !');
            return;
        }

        if (arguments[0] === 'max') {
            let delta = result.vault_coins;
            await updateVault(userId, -delta);
            message.reply(`Transferred **${delta}** :coin: to your coin pouch.`);
        } else if (!isNaN(Number(arguments[0]))) {
            let delta = Number(arguments[0]);
            if (delta < 0) {
                message.reply('-.- what is negative cash?');
            } else if (delta > result.vault_coins) {
                message.reply('You dont have that much to withdraw!');
            } else {
                await updateVault(userId, -delta);
                message.reply(`Transferred **${delta}** :coin: to your coin pouch.`);
            }
        }
    },
};
