const Discord = require('discord.js');
const loadCommands = require('@root/commands/load-commands');

module.exports = {
    commands: ['help'],
    expectedArgs: '<command_name>[o]',
    description: 'describes differnt commands',
    callback: (message, arguments, text, client) => {
        let reply = 'I am the **GenuinGenie**-bot. I can pretty much do anything: \n\n';
        const commands = loadCommands();

        const getPrefix = require('@root/commands/command-base').getPrefix;
        const prefix = getPrefix(client, message.guild.id);

        let ok = 0;
        if (arguments.length === 0) {
            /* for (const command of commands) {
                let permissions = command.permission;
                if (permissions) {
                    let hasPermission = true;
                    if (typeof permissions === 'string') {
                        permissions = [permissions];
                    }

                    for (const permission of permissions) {
                        if (!message.author.hasPermission(permission)) {
                            hasPermission = false;
                            break;
                        }
                    }

                    if (!hasPermission) {
                        continue;
                    }
                }

                // Format the text
                const mainCommand = typeof command.commands === 'string' ? command.commands : command.commands[0];
                const args = command.expectedArgs ? ` ${command.expectedArgs}` : ``;
                const { description } = command;

                reply += `**${prefix} ${mainCommand}${args}** = ${description}\n`;
            }
            message.channel.send(reply); */
            const { guild } = message;

            const getPrefix = require('@root/commands/command-base').getPrefix;
            const prefix = getPrefix(client, guild.id);
            const fields = require('@root/commands/load-commands.js').fields;

            let footer = `\n\n\`${prefix} help <command_name>\` - to know more about a command\n`;
            footer += `NOTE: Some commands require special *roles* and/or *permissions* to run`;
            const embed = new Discord.MessageEmbed()
                //.setDescription('modules and commands of the GG-bot')
                //.setTitle(`_Genuine Genie_ #HELP`)
                .addFields(...fields)
                .setFooter(footer)
                .setColor('RANDOM');

            message.channel.send(embed);
        } else {
            const query = arguments[0].toLowerCase();
            //console.log(query);
            for (const command of commands) {
                let cc = command.commands;
                if (typeof cc === 'string') cc = [cc];
                for (let i = 0; i < cc.length; i++) {
                    cc[i] = cc[i].toLowerCase();
                }

                if (cc.includes(query)) {
                    let aliases = '';
                    for (const name of cc) {
                        aliases += `\`${name}\`, `;
                    }

                    const { expectedArgs } = command;
                    const mainCommand = typeof command.commands === 'string' ? command.commands : command.commands[0];
                    const args = expectedArgs ? ` ${expectedArgs}` : ``;
                    const format = `*${prefix} ${mainCommand}${args}*`;

                    const fields = [];
                    fields.push({
                        name: 'aliases',
                        value: aliases,
                    });
                    fields.push({
                        name: 'description',
                        value: command.description,
                    });
                    fields.push({
                        name: 'format',
                        value: format,
                    });

                    if (command.requiredRoles ? command.requiredRoles.length : undefined) {
                        let rol = command.requiredRoles;
                        if (typeof rol === 'string') rol = [rol];
                        fields.push({
                            name: 'Required Roles',
                            value: rol.join(', '),
                        });
                    }

                    if (command.permissions ? command.permissions.length : undefined) {
                        let per = command.permissions;
                        if (typeof per === 'string') per = [per];
                        fields.push({
                            name: 'Required Permissions',
                            value: per.join(', '),
                        });
                    }

                    ok = 1;
                    const embed = new Discord.MessageEmbed().addFields(fields).setColor('RANDOM');

                    message.channel.send(embed);
                }
            }
        }

        if (!ok) {
            message.reply('No such command\n**TIP** `help` command for the full list of commands');
        }
    },
};
