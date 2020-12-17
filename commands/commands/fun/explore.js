const gold = require('@root/replies/gold.js');
const nothing = require('@root/replies/nothing.js');
const items = require('@root/replies/items.js');
const updateCoins = require('@utils/updateCoins');
const updateVault = require('@utils/updateVault');
const getUser = require('@utils/getUser');
const updatetUser = require('@utils/updateUser');

module.exports = {
    commands: ['explore', 'exp'],
    description: 'explores the wilderness ',
    minArgs: 0,
    maxArgs: 0,
    cooldown: 12,
    repeats: 2,
    callback: async (message, arguments, text) => {
        const { memeber, content, guild } = message;
        const name = message.author.username;
        const userId = message.author.id;
        let search_chance = Math.floor(Math.random() * 1000);
        /*  
            1% chance of item
            17% chance of gold
            82% chance of nothing
        */
        let break_item = Math.floor(Math.random() * 10000);
        /*
            5% chance of item break
        */

        // Make's sure the user exist's
        const result = await getUser(name, userId);

        if (0 <= search_chance && search_chance < 10) {
            const rnd = Math.floor(Math.random() * items.length);
            const res = items[rnd];
            const { hunting_bow, fishing_rod } = res;
            result.hunting_bow = hunting_bow;
            result.fishing_rod = fishing_rod;

            await updatetUser(userId, result);
            message.reply(res.description);
        } else if (0 <= search_chance - 10 && search_chance - 10 < 170) {
            const rnd = Math.floor(Math.random() * gold.length);
            const res = gold[rnd];
            const rnd_coins = Math.floor(Math.random() * 900) + 100;
            res.description = res.description.replace('XXX', '**' + String(rnd_coins) + '**');

            await updateCoins(userId, rnd_coins);
            message.reply(res.description);
        } else {
            const rnd = Math.floor(Math.random() * nothing.length);
            const res = nothing[rnd];

            message.reply(res.description);
        }

        if (0 <= break_item && break_item < 200) {
            if (result.hunting_bow) {
                result.hunting_bow = false;
                await updatetUser(userId, result);
                message.reply('Your bow :bow_and_arrow: just snapped into two. What did you two?');
            }
        }
    },
};
