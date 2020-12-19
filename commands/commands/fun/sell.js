const getUser = require('@utils/getUser');
const updateCoins = require('@utils/updateCoins');
const profileSchema = require('@schemas/profile-schema');
module.exports = {
    commands: ['sell'],
    description: 'sell an item in the market',
    expectedArgs: `<item_name>`,
    permissionError: '',
    minArgs: 1,
    /* cooldown: 5,
    repeats: 3, */
    callback: async (message, arguments, text, client) => {
        const userName = message.author.username;
        const userId = message.author.id;
        let result = await getUser(userName, userId);

        let inventory = JSON.parse(result.items);

        let item = arguments.join(' ');
        if (typeof item !== 'string') {
            message.reply('please enter a valid name');
            return;
        }
        item.toLowerCase();

        if (!inventory[item]) {
            message.reply('you do not own this item!');
            return;
        }

        message.reply('how many?');
        const filter = (m) => m.author.id === message.author.id;
        let collected = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 5000,
            error: ['you are so slow, the merchants went away'],
        });

        if (collected.size === 0) {
            message.reply('since you took too long, the merchants went away');
            return;
        }

        let quantity = collected.first().content;
        if (quantity === 'max') {
            quantity = inventory[item].count;
        }
        quantity = +quantity;
        if (isNaN(quantity) || quantity < 0) {
            message.reply('please provide a valid amount to sell');
            return;
        }
        if (quantity > inventory[item].count) {
            message.reply('you dont have that many to sell');
            return;
        }

        const status = inventory[item].status;
        const cash = {
            LEGENDARY: 500000,
            EPIC: 50000,
            'SUPER RARE': 10000,
            RARE: 2000,
            COMMON: 300,
        };

        if (!cash[status]) {
            message.reply('this item cannot be sold at the moment');
            return;
        }

        const total = quantity * cash[status];
        message.reply(
            `you have earned **${total.toLocaleString()}** coins by selling \n**x${quantity.toLocaleString()}** ${
                inventory[item].emoji
            }\`${item}\` - [**${status}**] `
        );

        inventory[item].count -= quantity;
        if (inventory[item].count === 0) {
            delete inventory[item];
        }
        result.items = JSON.stringify(inventory);
        result.inventoryCount -= quantity;
        result.coins += quantity * cash[status];
        await profileSchema.findOneAndUpdate({ userId }, result);
    },
    permissions: [],
    requiredRoles: [],
};
