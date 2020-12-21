const { none, common, rare, superRare, legendary } = require('@root/replies/fish');
const { MessageEmbed } = require('discord.js');
const getUser = require('@utils/getUser');
const profileSchema = require('@schemas/profile-schema');

module.exports = {
    commands: ['fish'],
    description: 'fishes a random monster',
    cooldown: 100,
    repeats: 1,
    callback: async (message, arguments, text, client) => {
        const userName = message.author.username;
        const userId = message.author.id;

        const fish = async (usr, opp, status) => {
            const filter = (m) => m.author.id === message.author.id;

            message.reply('type `pull` asap, hurryyyy!');

            // await for messages
            let result = await message.channel.awaitMessages(filter, {
                max: 1,
                time: 4000,
                error: ['since you took too long, you found nothing'],
            });

            if (result.size === 0) {
                message.reply('since you took too long, you found nothing');
                return;
            }

            // fetch and validate user reply
            result = result.first().content;
            if (typeof result !== 'string') {
                message.reply('you didnt enter a valid move, you found nothing');
                return;
            }
            result = result.toLowerCase();

            if (result !== 'pull') {
                message.reply('you didnt enter a valid move, you found nothing');
                return;
            }

            if (status !== 'NONE') {
                const res = await getUser(userName, userId);
                let items = JSON.parse(res.items);
                if (!items[opp.name]) {
                    items[opp.name] = {
                        emoji: opp.emoji,
                        count: 1,
                        status,
                    };
                } else {
                    items[opp.name].count++;
                }
                res.items = JSON.stringify(items);
                res.fishedCount++;
                res.inventoryCount++;

                await profileSchema.findOneAndUpdate({ userId }, res);
                message.reply(
                    `you caught something in your fishing pole!\n${opp.emoji} \`${opp.name}\` [ **${status}** ], has been added to your inventory!`
                );
            } else {
                message.reply(`${opp.emoji}. \`${opp.name}\`!`);
            }
        };

        const user = await getUser(userName, userId);
        const inventory = JSON.parse(user.items);
        if (!inventory['fishing pole']) {
            message.reply(
                'you need a 🎣 `fishing pole` to use the `fish` command.\n**TIP** you can buy it in the shop'
            );
            return;
        }

        const usr = {
            name: user.name,
            hp: user.hp,
            atk: user.atk,
            def: user.def,
        };

        const roll = Math.floor(Math.random() * 100);
        // legendary (4000 - 200- 330)
        if (roll < 0.1) {
            const index = Math.floor(Math.random() * legendary.length);
            const [emoji, name] = legendary[index];
            opp = { emoji, name };
            fish(usr, opp, 'LEGENDARY');
        } // epic (1000- 80 - 200)
        else if (roll < 2) {
            const index = Math.floor(Math.random() * superRare.length);
            const [emoji, name] = superRare[index];
            opp = { emoji, name };
            fish(usr, opp, 'EPIC');
        } //super rare (450 - 50 - 100)
        else if (roll < 15) {
            const index = Math.floor(Math.random() * rare.length);
            const [emoji, name] = rare[index];
            opp = { emoji, name };
            fish(usr, opp, 'RARE');
        } //rare (200 - 35- 50)
        else if (roll < 50) {
            const index = Math.floor(Math.random() * common.length);
            const [emoji, name] = common[index];
            opp = { emoji, name };
            fish(usr, opp, 'COMMON');
        } // common (120 - 20 - 20)
        else {
            const index = Math.floor(Math.random() * none.length);
            const [emoji, name] = none[index];
            opp = { emoji, name };
            fish(usr, opp, 'NONE');
        }
    },
};
