const Commando = require('discord.js-commando');
const mongo = require('@root/database/mongo');
const dailyRewardsSchema = require('@schemas/daily-rewards-schema');

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
            name: 'daily',
            group: 'economy',
            memberName: 'daily',
            description: 'Get a daily reward',
        });
    }

    async run(message) {
        const { guild, member } = message;
        const { id } = member;

        if (claimedCache.includes(id)) {
            console.log('returning from cache');
            message.reply(`you have already claimed your daily rewards!`);
            return;
        }

        console.log('Fetching from Mongo');

        const obj = {
            userId: id,
        };

        await mongo().then(async (mongoose) => {
            try {
                const results = await dailyRewardsSchema.findOne(obj);
                if (results) {
                    const then = new Date(results.updatedAt).getTime();
                    const now = new Date().getTime();

                    const diffTime = Math.abs(now - then);
                    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays <= 1) {
                        claimedCache.push(id);
                        message.reply(`you have already claimed your daily rewards!`);
                        return;
                    }
                }

                await dailyRewardsSchema.findOneAndUpdate(obj, obj, { new: true, upsert: true });

                claimedCache.push(id);

                //TODO: Give the rewards
                message.reply(`you have claimed your daily!`);
            } finally {
            }
        });
    }
};
