const mongo = require('@root/database/mongo');
const hourlyRewardsSchema = require('@schemas/hourly-rewards-schema');
const updateCoins = require('@utils/updateCoins');
const updateXP = require('@utils/updateXP');

// Array of member IDs who have claimed their hourly rewards in the last 24hrs
// Resets every 20 mins
let claimedCache = [];
const clearCache = () => {
    claimedCache = [];
    setTimeout(clearCache, 20 * 1000 * 60);
};
clearCache();

module.exports = {
    commands: ['hourly'],
    description: 'get some fantastic hourly rewards',
    expectedArgs: "<user's @>",
    /* cooldown: 5,
    repeats: 3, */
    callback: async (message, arguments, text) => {
        const { guild, member } = message;
        const { id } = member;

        if (claimedCache.includes(id)) {
            console.log('returning from cache');
            message.reply(`you have already claimed your **hourly** rewards!`);
            return;
        }

        console.log('Fetching from Mongo');

        const obj = {
            userId: id,
        };

        await mongo().then(async (mongoose) => {
            try {
                const results = await hourlyRewardsSchema.findOne(obj);
                if (results) {
                    const then = new Date(results.updatedAt).getTime();
                    const now = new Date().getTime();

                    const diffTime = Math.abs(now - then);
                    const diffHours = diffTime / (1000 * 60);

                    if (diffHours <= 1) {
                        claimedCache.push(id);
                        message.reply(`you have already claimed your **hourly** rewards!`);
                        return;
                    }
                }

                await hourlyRewardsSchema.findOneAndUpdate(obj, obj, { new: true, upsert: true });

                claimedCache.push(id);

                const coins = Math.floor(Math.random() * 75) + 100;
                await updateCoins(message.author.id, coins);

                const XP = Math.floor(Math.random() * 5) + 10;
                await updateXP(message.author.id, XP, message);

                message.reply(`nice! **${coins}** coins and \`${XP}\`XP were granted to you`);
            } finally {
            }
        });
    },
    permissions: [],
    requiredRoles: [],
};
