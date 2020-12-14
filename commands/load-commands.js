const path = require('path');
const fs = require('fs');

let temp = {};
const fields = [];

module.exports = (client) => {
    const baseFile = 'command-base.js';

    const commandBase = require(`./${baseFile}`);

    const commands = [];

    // Registering all the commands
    const readCommands = (dir) => {
        const files = fs.readdirSync(path.join(__dirname, dir));
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file));
            if (stat.isDirectory()) {
                if (file !== 'commands') {
                    // reseting our temp
                    temp = {};
                    temp.name = file;
                    temp.value = '';
                }
                readCommands(path.join(dir, file));
            } else if (file !== baseFile && file !== 'load-commands.js') {
                const options = require(path.join(__dirname, dir, file));
                commands.push(options);
                const comm = options.commands;
                if (typeof comm === 'string') comm = [comm];
                temp.value += `\`${comm[0]}\`, `;
                if (client) {
                    commandBase(client, options);
                }
            }
        }
        fields.push(temp);
        // reseting our temp
        temp = {};
    };
    readCommands('./');
    fields.length = 4; // cos i have 4 directories in my commmadns folder
    //console.log(fields);
    return commands;
};

module.exports.fields = fields;
