module.exports = {
    commands: ['ban'],
    expectedArgs: "<user's @>",
    minArgs: 1,
    maxArgs: 1,
    callback: (message, arguments, text) => {
        const { member, mentions } = message;
        const target = mentions.users.first();
        const tag = `<@${target.id}>`;
        console.log(target);
        if (target) {
            const targetMember = message.guild.members.cache.get(target.id);
            targetMember.ban();
            message.channel.send(`${tag} has been banned`);
        } else {
            message.relpy(`${tag} does not exist`);
        }
    },
    permissions: ['ADMINISTRATOR', 'BAN_MEMBERS'],
};
