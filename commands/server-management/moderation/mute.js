const redis = require('../../../redis');

module.exports = {
    commands: ['mute'],
    description: 'mutes the user for the given time',
    expectedArgs: "<user's @> <duration> <s/m/h/d>",
    minArgs: 3,
    maxArgs: 3,
    callback: async (message, arguments, text, client) => {
        const redisKeyPrefix = 'muted-';

        const getRole = (guild) => {
            return guild.roles.cache.find((role) => role.name === 'Silence');
        };

        redis.expire((message) => {
            if (message.startsWith(redisKeyPrefix)) {
                const [d1, memberId, guildId] = message.split('-');
                const guild = client.guilds.cache.get(guildId);
                const member = guild.members.cache.get(memberId);

                const role = getRole(guild);
                if (role) {
                    member.roles.remove(role);
                    console.log('Unmuted' + member.id);
                } else {
                    console.log('Could not find the role');
                }
                console.log('expired', guild.name);
            }
        });

        // gives the 'Silence' role to a member
        const giveRole = (member) => {
            const role = getRole(member.guild);
            if (role) {
                member.roles.add(role);
                console.log('Muted' + member.id);
            } else {
                console.log('Could not find the role');
            }
        };

        // what we do on member join
        const onJoin = async (member) => {
            const { guild } = member;
            const redisClient = await redis();
            try {
                redisClient.get(`${redisKeyPrefix}${target.id}-${guild.id}`, (err, res) => {
                    if (err) {
                        console.log('redis GET error: ', err);
                    } else if (res) {
                        giveRole(member);
                    } else {
                        console.log('User is not muted');
                    }
                });
            } finally {
                //redisClient.quit();
            }
        };

        // listens to people joinnig the server - to catch people trying to get rid of the mute role
        client.on('guildMemberAdd', (member) => {
            onJoin(member);
        });

        const { mentions, channel, guild, content } = message;
        const target = mentions.users.first();
        const tag = `<@${target.id}>`;
        console.log(target);

        arguments.shift();
        duration = arguments[0];
        durationType = arguments[1];
        console.log(arguments);

        if (target) {
            if (isNaN(duration)) {
                channel.send('Please provide a valid number for the duration ' + this.expectedArgs);
            } else {
                const durations = {
                    s: 1,
                    m: 60,
                    h: 60 * 60,
                    d: 24 * 60 * 60,
                    life: -1,
                };

                if (!durations[durationType]) {
                    channel.send('Please provide a valid duration type ' + this.expectedArgs);
                } else {
                    const targetMember = guild.members.cache.get(target.id);
                    giveRole(targetMember);

                    const seconds = duration * durations[durationType];
                    const redisClient = await redis();
                    try {
                        const redisKey = `${redisKeyPrefix}${target.id}-${guild.id}`;
                        if (seconds > 0) {
                            redisClient.set(redisKey, 'true', 'EX', seconds);
                        } else {
                            redisClient.set(redisKey, 'true');
                        }
                    } finally {
                        //redis.client.quit()
                    }
                }
                /* const targetMember = message.guild.members.cache.get(target.id);
                targetMember.kick();
                message.channel.send(`${tag} has been kicked`); */
            }
        } else {
            message.relpy(`${tag} does not exist`);
        }
    },
    permissions: ['ADMINISTRATOR'],
};
