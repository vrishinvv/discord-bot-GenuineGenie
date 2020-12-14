const { MessageEmbed } = require('discord.js');
const getUser = require('@utils/getUser');

module.exports = {
    commands: ['profile'],
    description: "shows yours'/user's GGprofile",
    expectedArgs: "<user's @>(opt)",
    permissionError: '',
    callback: async (message, arguments, text, client) => {
        const target = message.mentions.users.first() || message.author;
        const targetId = target.id;
        const name = target.username;
        const member = message.guild.members.cache.get(targetId);

        const result = await getUser(name, targetId);
        let desc = `Coins:\t **${result.coins}**`;
        desc += `\nVault:\t **${result.vault_coins}/${result.vault_size}**`;

        //TODO:: complete this bit
        let itemReply = '';

        const embed = new MessageEmbed()
            .setAuthor(`${name} profile`, target.displayAvatarURL())
            .addFields(
                {
                    name: 'General',
                    value: `Level: **${result.level}**\nXP: \`${result.xp}/${
                        result.level * 200 + result.commands_issued * 10
                    }\`\nCommands Issued: *${result.commands_issued}*`,
                },
                {
                    name: 'Richness',
                    value: desc,
                },
                {
                    name: 'Misc',
                    value: `Nickname: \`${member.nickname || 'None'}\`\nJoined Server: *${new Date(
                        member.joinedTimestamp
                    ).toLocaleDateString()}*\nRole Count: **${member.roles.cache.size}**`,
                }
            )
            .setColor('RANDOM');

        message.channel.send(embed);
    },
    permissions: [],
    requiredRoles: [],
};
