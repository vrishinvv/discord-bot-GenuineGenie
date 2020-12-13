const Discord = require('discord.js');
const fields = require('@root/commands/load-commands.js').fields;
module.exports = {
    commands: ['shelp'],
    description: 'displays server info',
    callback: (message, arguments, text, client) => {
        const { guild } = message;

        const { name, region, memberCount, owner } = guild;
        const icon = guild.iconURL();
        const getPrefix = require('@root/commands/command-base').getPrefix;
        const prefix = getPrefix(client, guild.id);

        let footer = `\n\n\`${prefix} help <command_name>\` - to know more about a command\n`;
        footer += `NOTE: Some commands require special *roles* and/or *permissions* to run`;
        const embed = new Discord.MessageEmbed()
            //.setDescription('modules and commands of the GG-bot')
            //.setTitle(`_Genuine Genie_ #HELP`)
            .addFields(...fields)
            .setFooter(footer)
            .setColor('RANDOM');

        message.channel.send(embed);
    },
};
