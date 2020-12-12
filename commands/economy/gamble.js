const updateCoins = require('../../helper-snips/updateCoins');
const getUser = require('../../helper-snips/getUser');

module.exports = {
    commands: ['gamble'],
    expectedArgs: '<coins>',
    minArgs: 1,
    maxArgs: 1,
    cooldown: 10,
    repeats: 1,
    callback: async (message, arguments, text) => {
        const name = message.author.username;
        const userId = message.author.id;

        const result = await getUser(name, userId);

        if (result.coins < Number(arguments[0])) {
            message.reply('Insufficient :coin: to Gamble');
        } else if (+arguments[0] < 400) {
            message.reply('Need atleast **400** :coin: to gamble');
        } else {
            const flip = Math.random() * 2;
            if (flip >= 1) {
                const new_coins = Math.floor(Number(arguments[0]) * (Math.random() * 1.5 + 1));
                await updateCoins(userId, new_coins);
                message.reply(`you WON! you got **${new_coins}** :coin:`);
            } else {
                const new_coins = Math.floor(Number(arguments[0]) * (Math.random() * 1)) + 75;
                await updateCoins(userId, -new_coins);
                message.reply(`you LOST! there goes a **${new_coins}** :coin:`);
            }
        }
    },
};
