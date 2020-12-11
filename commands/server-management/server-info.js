const Discord = require('discord.js');

module.exports = {
    commands: ['server-info'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text) => {
        const { guild } = message;

        const { name, region, memberCount, owner } = guild;
        const icon = guild.iconURL();

        const embed = new Discord.MessageEmbed().setTitle(`Sever info for "${name}"`).setThumbnail(icon).addFields(
            {
                name: 'Region',
                value: region,
            },
            {
                name: 'Member Count',
                value: memberCount,
            },
            {
                name: 'Owner',
                value: owner.user.tag,
            }
        );

        message.channel.send(embed);
    },
};
