const Discord = require('discord.js');
const loadCommands = require('@root/commands/load-commands');
const { prefix } = require('@root/config.json');

module.exports = {
    commands: ['help'],
    expectedArgs: '<command_name>[o]',
    description: 'describes differnt commands',
    callback: (message, arguments, text, client) => {
        let reply = 'I am the **GenuinGenie**-bot. I can pretty much do anything: \n\n';
        const commands = loadCommands();

        const getPrefix = require('@root/commands/command-base').getPrefix;
        const prefix = getPrefix(client, message.guild.id);

        if (arguments.length === 0) {
            for (const command of commands) {
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
            message.channel.send(reply);
        } else {
            const query = arguments[0];
            for (const command of commands) {
                const cc = command.commands;
                if (typeof cc === 'string') cc = [cc];

                if (cc.includes(query)) {
                    let aliases = '';
                    for (const name of cc) {
                        aliases += `\`${name}\`,`;
                    }

                    const { expectedArgs } = command;
                    const mainCommand = typeof command.commands === 'string' ? command.commands : command.commands[0];
                    const args = expectedArgs ? ` ${expectedArgs}` : ``;
                    const format = `*${prefix} ${mainCommand}${args}*`;

                    const embed = new Discord.MessageEmbed()
                        .addFields(
                            {
                                name: 'aliases',
                                value: aliases,
                            },
                            {
                                name: 'description',
                                value: command.description,
                            },
                            {
                                name: 'format',
                                value: format,
                            }
                        )
                        .setColor('RANDOM');

                    message.channel.send(embed);
                }
            }
        }
    },
};
