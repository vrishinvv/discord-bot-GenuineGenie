const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const getUser = require('@utils/getUser');
const updateVault = require('@utils/updateVault');
// Array of member IDs who have claimed their daily rewards in the last 24hrs
// Resets every 10 mins
let claimedCache = [];

const clearCache = () => {
    claimedCache = [];
    setTimeout(clearCache, 20 * 60 * 1000);
};

clearCache();

module.exports = class kickCommand extends (
    Commando.Command
) {
    constructor(client) {
        super(client, {
            name: 'dep',
            aliases: ['deposit'],
            group: 'economy',
            memberName: 'dep',
            description: 'deposits coins into your vault',
            format: '<coins> -or- <max>',
            throttling: {
                usages: 3,
                duration: 10,
            },
            argsType: 'multiple',
        });
    }

    async run(message, args) {
        const name = message.author.username;
        const userId = message.author.id;

        const result = await getUser(name, userId);

        const available = result.vault_size - result.vault_coins;
        if (available === 0) {
            message.reply('Your vault is already full!');
            return;
        }
        if (args[0] === 'max') {
            await updateVault(userId, available);
            message.reply(`Transferred **${available}** :coin: to vault.`);
        } else {
            let delta = +args[0];
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
    }
};
