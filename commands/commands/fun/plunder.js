const getUser = require('@utils/getUser');
const updateCoins = require('@utils/updateCoins');
const plunderSchema = require('@schemas/plunder-schema');
const { MessageEmbed } = require('discord.js');

module.exports = {
    commands: ['plunder', 'rob', 'steal'],
    description: "robs a % from someone's coins",
    expectedArgs: "<user's @>",
    permissionError: '',
    minArgs: 1,
    maxArgs: 1,
    cooldown: 60,
    repeats: 1,
    callback: async (message, arguments, text) => {
        const target = message.mentions.users.first();
        if (!target) {
            message.reply('No such user exists');
            return;
        }

        if (target.id === message.author.id) {
            message.reply('Funny you thought that will work xD');
            return;
        }

        const userName = message.author.username;
        const userId = message.author.id;

        const targetName = target.username;
        const targetId = target.id;

        const resultUser = await getUser(userName, userId);
        const resultTarget = await getUser(targetName, targetId);
        if (resultUser.coins < 400) {
            message.reply(`you need atleast *400* coins in your coin pouch, before you can plunder somoene else`);
            return 1;
        }

        const results = await plunderSchema.findOne({ userId: targetId });
        //console.log(results);
        if (results) {
            const then = new Date(results.updatedAt).getTime();
            const now = new Date().getTime();

            const diffTime = Math.abs(now - then);
            const diffMinutes = diffTime / (1000 * 60);
            //console.log(diffMinutes);
            if (diffMinutes <= 2) {
                message.reply(`this user was robbed within the last 2 mins! please give them some time to cry`);
                return 1;
            }
        }

        const roll = Math.floor(Math.random() * 100);
        if (roll < 5) {
            const delta = resultTarget.coins;
            message.channel.send(
                `<@${userId}>, 🤑 You evil little twig. You emptied <@${targetId}>'s wallet.\nyou plundered **${delta}** coins.`
            );
            await updateCoins(userId, delta);
            await updateCoins(targetId, -delta);
            await plunderSchema.findOneAndUpdate(
                { userId: targetId },
                { userId: targetId },
                { new: true, upsert: true }
            );
        } else if (roll < 10) {
            const delta = Math.floor((Math.random() * resultTarget.coins * 75) / 100);
            message.channel.send(
                `<@${userId}>, 💰 You almost stole everything from <@${targetId}>'s wallet. What a theif!\nyou plundered **${delta}** coins.`
            );
            await updateCoins(userId, delta);
            await updateCoins(targetId, -delta);
            await plunderSchema.findOneAndUpdate(
                { userId: targetId },
                { userId: targetId },
                { new: true, upsert: true }
            );
        } else if (roll < 20) {
            const delta = Math.floor((Math.random() * resultTarget.coins * 33) / 100);
            message.channel.send(
                `<@${userId}>, 💵 you plundered **${delta}** coins from <@${targetId}>'s wallet. oof. `
            );
            await updateCoins(userId, delta);
            await updateCoins(targetId, -delta);
            await plunderSchema.findOneAndUpdate(
                { userId: targetId },
                { userId: targetId },
                { new: true, upsert: true }
            );
        } else if (roll < 40) {
            const delta = Math.floor((Math.random() * resultTarget.coins * 20) / 100);
            message.channel.send(`<@${userId}>, you plundered **${delta}** coins from your target. not bad. `);
            await updateCoins(userId, delta);
            await updateCoins(targetId, -delta);
            await plunderSchema.findOneAndUpdate(
                { userId: targetId },
                { userId: targetId },
                { new: true, upsert: true }
            );
        } else if (roll < 60) {
            const delta = 250;
            message.reply('😂 you got caught!\nyou payed the person you tried to rob **250** coins');
            await updateCoins(userId, -250);
            await updateCoins(targetId, 250);
        } else {
            message.reply('lol. you are bad at even plundering! try again later or something xD');
        }
    },
    permissions: [],
    requiredRoles: [],
};
