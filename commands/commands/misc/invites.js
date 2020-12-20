const Discord = require('discord.js');

module.exports = {
    commands: ['invites'],
    description: 'checks invites leaderboard',
    callback: async (message, arguments, text) => {
        const { guild } = message;
        const inviteCounter = {};
        await guild.fetchInvites().then((invites) => {
            invites.forEach((invite) => {
                const { uses, inviter } = invite;
                const { username, discriminator } = inviter;

                const name = `${username}#${discriminator}`;

                inviteCounter[name] = (inviteCounter[name] || 0) + uses;
            });
        });

        const sortedInvites = Object.keys(inviteCounter).sort((a, b) => {
            return inviteCounter[b] - inviteCounter[a];
        });

        sortedInvites.length = Math.min(sortedInvites.length, 10);

        //console.log(sortedInvites);
        let i = 1;
        let replyText = ``;
        for (const invite of sortedInvites) {
            const count = inviteCounter[invite];
            //console.log(invite, count);
            replyText += `\n(${i}). **${invite}** has invited **${count}** member(s)!`;
            i += 1;
        }

        const icon = guild.iconURL();
        const embed = new Discord.MessageEmbed()
            .setTitle(`Top ${sortedInvites.length} Invitees: `)
            .setThumbnail(icon)
            .setDescription(replyText);

        message.channel.send(embed);

        //message.channel.send(replyText);
    },
};
