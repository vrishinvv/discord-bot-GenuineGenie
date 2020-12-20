const mongo = require('@root/database/mongo');
const dailyRewardsSchema = require('@schemas/daily-rewards-schema');
const updateCoins = require('@utils/updateCoins');
const updateXP = require('@utils/updateXP');

// Array of member IDs who have claimed their daily rewards in the last 24hrs
// Resets every 20 mins
let claimedCache = [];
const clearCache = () => {
    claimedCache = [];
    setTimeout(clearCache, 20 * 60 * 1000);
};
clearCache();

module.exports = {
    commands: ['daily'],
    description: 'get some fantastic daily rewards, coins, xp and what not?',
    expectedArgs: "<user's @>",
    /* cooldown: 5,
    repeats: 3, */
    callback: async (message, arguments, text) => {
        const { guild, member } = message;
        const { id } = member;

        if (claimedCache.includes(id)) {
            //console.log('returning from cache');
            message.reply(`you have already claimed your **daily** rewards!`);
            return;
        }

        //console.log('Fetching from Mongo');

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
                    const diffDays = diffTime / (1000 * 60 * 60 * 24);

                    if (diffDays <= 1) {
                        claimedCache.push(id);
                        message.reply(`you have already claimed your **daily** rewards!`);
                        return;
                    }
                }

                await dailyRewardsSchema.findOneAndUpdate(obj, obj, { new: true, upsert: true });

                claimedCache.push(id);

                const coins = Math.floor(Math.random() * 500) + 500;
                await updateCoins(message.author.id, coins);

                const XP = Math.floor(Math.random() * 20) + 25;
                await updateXP(message.author.id, XP, message);

                message.reply(`> WOAH! you just got **${coins}** coins and \`${XP}\`XP`);
            } finally {
            }
        });
    },
    permissions: [],
    requiredRoles: [],
};
