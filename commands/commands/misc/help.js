const loadCommands = require('@root/commands/load-commands');
const { prefix } = require('@root/config.json');

module.exports = {
    commands: ['help'],
    description: 'describes differnt commands',
    callback: (message, arguments, text) => {
        let reply = 'I am the **GenuinGenie**-bot. I can pretty much do anything: \n\n';
        const commands = loadCommands();

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
    },
};
