const getUser = require('@utils/getUser');
const updateCoins = require('@utils/updateCoins');
const profileSchema = require('@schemas/profile-schema');
const { items } = require('@root/replies/shop');

module.exports = {
    commands: ['buy'],
    description: 'buys an item from the shop',
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

        const temp = [];
        for (const [emoji, name, info, cost] of items) {
            temp[name] = [cost, emoji];
        }

        let item = arguments.join(' ');
        if (typeof item !== 'string') {
            message.reply('please enter a valid name');
            return;
        }
        item.toLowerCase();

        if (!temp[item]) {
            message.reply('there is no such item to buy!');
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

        let quantity = +collected.first().content;

        if (isNaN(quantity) || quantity < 0) {
            message.reply('please provide a valid amount to buy');
            return;
        }

        if (quantity * temp[item][0] > result.coins) {
            message.reply('you dont have that much coins to buy');
            return;
        }

        let exit = 0;
        const handleItem = (item) => {
            switch (item) {
                case 'shamshir daggers':
                    result.atk += 2 * quantity;
                    break;

                case 'goliath armor':
                    result.def += 2 * quantity;
                    break;

                case 'trusted role':
                    const role = message.guild.roles.cache.find((role) => role.name === 'Trusted');
                    if (!role) {
                        message.reply('sorry it seems like your server owner hasnt made this a role');
                        exit = 1;
                    } else {
                        const member = message.guild.members.cache.get(message.author.id);
                        member.roles.add(role);
                        message.reply('you now have the `Trusted` role');
                    }
                    break;

                case 'hunting bow':
                    message.reply('you can now use the `hunt` command');
                    break;

                case 'fishing pole':
                    message.reply('you can now use the `fish` command');
                    break;
                default:
                    break;
            }
        };

        if (exit) return;

        result.coins -= quantity * temp[item][0];
        result.inventoryCount += quantity;
        if (!inventory[item]) {
            inventory[item] = {
                emoji: temp[item][1],
                count: quantity,
            };
        } else {
            inventory[item].count += quantity;
        }
        handleItem(item);
        result.items = JSON.stringify(inventory);
        await profileSchema.findOneAndUpdate({ userId }, result);

        const total = quantity * temp[item][0];
        message.reply(
            `you have bought \n**x${quantity.toLocaleString()}** ${
                temp[item][1]
            }\`${item}\` for **${total.toLocaleString()}** coins`
        );
    },
    permissions: [],
    requiredRoles: [],
};
