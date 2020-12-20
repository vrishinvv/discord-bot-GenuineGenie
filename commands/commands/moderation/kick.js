module.exports = {
    commands: ['kick'],
    description: 'kicks the user from the server',
    expectedArgs: "<user's @>",
    minArgs: 1,
    maxArgs: 1,
    callback: (message, arguments, text) => {
        const { member, mentions } = message;
        const target = mentions.users.first();
        const tag = `<@${target.id}>`;
        //console.log(target);
        if (target) {
            const targetMember = message.guild.members.cache.get(target.id);
            targetMember.kick();
            message.channel.send(`${tag} has been kicked`);
        } else {
            message.relpy(`${tag} does not exist`);
        }
    },
    permissions: ['ADMINISTRATOR', 'KICK_MEMBERS'], //kick?
};
