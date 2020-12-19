const updateCoins = require('@utils/updateCoins');
const getUser = require('@utils/getUser');

module.exports = {
    commands: ['gamble'],
    description: '50% chance of winning or losing the cash you bet',
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
            message.reply('Hello, please gamble with what you have xD');
        } else if (+arguments[0] < 400) {
            message.reply('Need atleast **400** :coin: to gamble');
        } else {
            const delta = +arguments[0];
            if (isNaN(delta)) {
                message.reply('please provide a valid amount of coins to give');
                return;
            }
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
