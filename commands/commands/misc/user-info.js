const { MessageEmbed } = require('discord.js');
const { version } = require('@root/package.json');

module.exports = {
    commands: ['userInfo', 'user-info'],
    description: "display's bot information",

    callback: async (message, arguments, text, client) => {
        const getPrefix = require('@root/commands/command-base').getPrefix;
        const prefix = getPrefix(client, message.guild.id);
        let totalMembers = 0;
        for (const guild of client.guilds.cache) {
            totalMembers += (await guild[1].members.fetch()).size;
        }
        const embed = new MessageEmbed()
            .setAuthor(`${client.user.username} Bot`, client.user.displayAvatarURL())
            .addFields(
                {
                    name: "Bot's tag",
                    value: `\`${client.user.tag}\``,
                    inline: true,
                },
                {
                    name: 'Version',
                    value: `*${version}*`,
                    inline: true,
                },
                {
                    name: "Server's comamnd prefix",
                    value: prefix,
                },
                {
                    name: 'Time since last restart',
                    value: `${process.uptime().toFixed(2)}s`,
                },
                {
                    name: 'Server count',
                    value: client.guilds.cache.size,
                },
                {
                    name: 'Total Members',
                    value: totalMembers,
                }
            )
            .setColor('RANDOM');
        message.channel.send(embed);
    },
    permissions: [],
    requiredRoles: [],
};
