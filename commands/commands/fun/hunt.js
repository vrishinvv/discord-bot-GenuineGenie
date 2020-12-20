const { common, rare, superRare, epic, legendary } = require('@root/replies/hunt');
const { MessageEmbed } = require('discord.js');
const getUser = require('@utils/getUser');
const profileSchema = require('@schemas/profile-schema');
module.exports = {
    commands: ['hunt'],
    description: 'hunts a random monster',
    cooldown: 20,
    repeats: 1,
    callback: async (message, arguments, text, client) => {
        const userName = message.author.username;
        const userId = message.author.id;

        const fight = async (usr, opp, status) => {
            message.reply(
                `${opp.emoji} \`${opp.name}\` [ **${status}** ] - (*${opp.hp}/${opp.atk}/${opp.def}*),\nhas jumped right next to you!`
            );
            const filter = (m) => m.author.id === message.author.id;

            const displayStats = (usr, opp) => {
                const embed = new MessageEmbed().setDescription(
                    `Your *HP* = **${usr.hp.toFixed(2)}**\n${opp.emoji}'s *HP*: **${opp.hp.toFixed(2)}**`
                );
                return embed;
            };

            const attack = (A, B) => {
                let dat, dis;
                if (A.emoji) (dat = `${A.emoji} ${A.name}`), (dis = `you`);
                else (dis = `${B.emoji} ${B.name}`), (dat = `you`);

                const damage_dealt = A.atk - (A.atk * B.def) / 1000 + Math.random() * 5 - Math.random() * 2;
                B.hp -= damage_dealt;
                message.reply(`\`${dat}\` attacked \`${dis}\` and dealt **${damage_dealt.toFixed(2)}** true damage`);
            };

            const defend = (A, B) => {
                let dat;
                if (A.emoji) dat = `${A.emoji} ${A.name}`;
                else dat = `you`;

                A.def += 25;
                message.reply(`\`${dat}\` defended and permenantly rose thier DEF by **25**`);
            };

            const heal = (A, B) => {
                let dat;
                if (A.emoji) dat = `${A.emoji} ${A.name}`;
                else dat = `you`;

                const heal = Math.random() * (A.hp / 30) + 10;
                A.hp += heal;
                message.reply(`\`${dat}\` and recovered **${heal.toFixed(2)}** HP`);
            };

            const action = (usr, opp, move, counter) => {
                if (move === 'attack') {
                    attack(usr, opp);
                } else if (move === 'defend') {
                    defend(usr, opp);
                } else if (move === 'heal') {
                    heal(usr, opp);
                } else {
                    return -1;
                }
            };

            const isEndGame = async (usr, opp) => {
                //console.log('in here', usr.hp, opp.hp);
                if (opp.hp <= 0) {
                    message.reply(
                        `you **WON** the battle!\n${opp.emoji} \`${opp.name}\` [ **${status}** ], has been added to your inventory!`
                    );
                    let res = await getUser(userName, userId);

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
                    res.huntedCount++;
                    res.inventoryCount++;

                    await profileSchema.findOneAndUpdate({ userId }, res);
                    return 1;
                }

                if (usr.hp <= 0) {
                    message.reply(`you **LOST** the battle!`);
                    return 1;
                }

                return 0;
            };

            let turn = 0;
            let counter = 0;
            // 0 - usr, 1 - opp

            while ((await isEndGame(usr, opp)) === 0) {
                if (turn === 0) {
                    // Display prompt for battle
                    if (counter === 0) {
                        message.channel.send('what would you like to do?\n `attack`, `defend`, `heal`, `run`');
                    } else {
                        message.channel.send('what would you like to do?\n `attack`, `defend`, `heal`');
                    }

                    // await for messages
                    let result = await message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 20000,
                        error: ['since you took too long, the monster ran away'],
                    });

                    if (result.size === 0) {
                        message.reply('since you took too long, the monster ran away');
                        break;
                    }

                    // fetch and validate user reply
                    result = result.first().content;
                    if (typeof result !== 'string') {
                        message.reply('you didnt enter a valid move, the monster ran away');
                        return;
                    }
                    result = result.toLowerCase();

                    if (result === 'run' && counter === 0) {
                        message.reply("the monster growls! I guess it says 'wise choice human' in monster lang");
                        return;
                    }

                    // handle cases
                    const val = action(usr, opp, result, counter);
                    if (val === -1) {
                        message.reply('there is no such move, say again xD');
                        continue;
                    }
                } else {
                    const roll = Math.random() * 3;
                    if (roll < 2) {
                        action(opp, usr, 'attack');
                    } else if (roll < 2.5) {
                        action(opp, usr, 'defend');
                    } else {
                        action(opp, usr, 'heal');
                    }
                }

                message.reply(displayStats(usr, opp));

                turn = 1 - turn;
                counter++;
            }
        };

        const setAttribute = (base) => {
            const mul = Math.floor(Math.random() * 2) === 0 ? -1 : +1;
            const add =
                mul === -1 ? Math.floor(-1 * Math.random() * (base / 60)) : Math.floor(Math.random() * (base / 10));
            const attr = base + add;

            return attr;
        };

        const user = await getUser(userName, userId);
        const inventory = JSON.parse(user.items);
        if (!inventory['hunting bow']) {
            message.reply('you need a 🏹 `hunting bow` to use the `hunt` command.\n**TIP** you can buy it in the shop');
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
        if (roll < 2) {
            const index = Math.floor(Math.random() * legendary.length);
            const [emoji, name] = legendary[index];
            const hp = setAttribute(4000);
            const atk = setAttribute(250);
            const def = setAttribute(300);

            const opp = {
                emoji,
                name,
                hp,
                atk,
                def,
            };
            fight(usr, opp, 'LEGENDARY');
        } // epic (1000- 80 - 200)
        else if (roll < 10) {
            const index = Math.floor(Math.random() * epic.length);
            const [emoji, name] = epic[index];
            const hp = setAttribute(1000);
            const atk = setAttribute(100);
            const def = setAttribute(200);
            const opp = {
                emoji,
                name,
                hp,
                atk,
                def,
            };
            fight(usr, opp, 'EPIC');
        } //super rare (450 - 50 - 100)
        else if (roll < 25) {
            const index = Math.floor(Math.random() * superRare.length);
            const [emoji, name] = superRare[index];
            const hp = setAttribute(450);
            const atk = setAttribute(60);
            const def = setAttribute(100);

            const opp = {
                emoji,
                name,
                hp,
                atk,
                def,
            };
            fight(usr, opp, 'SUPER RARE');
        } //rare (200 - 35- 50)
        else if (roll < 50) {
            const index = Math.floor(Math.random() * rare.length);
            const [emoji, name] = rare[index];
            const hp = setAttribute(200);
            const atk = setAttribute(40);
            const def = setAttribute(50);
            const opp = {
                emoji,
                name,
                hp,
                atk,
                def,
            };
            fight(usr, opp, 'RARE');
        } // common (120 - 20 - 20)
        else {
            const index = Math.floor(Math.random() * common.length);
            const [emoji, name] = common[index];
            const hp = setAttribute(120);
            const atk = setAttribute(20);
            const def = setAttribute(20);

            const opp = {
                emoji,
                name,
                hp,
                atk,
                def,
            };
            fight(usr, opp, 'COMMON');
        }
    },
};
