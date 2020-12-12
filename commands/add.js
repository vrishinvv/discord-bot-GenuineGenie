module.exports = {
    commands: ['add', 'addition'],
    expectedArgs: '<num1> <num2>',
    description: 'adds two numbers',
    permissionError: '',
    minArgs: 2,
    maxArgs: 2,
    cooldown: 5,
    repeats: 3,
    callback: (message, arguments, text) => {
        message.reply(`The sum is ${Number(arguments[0]) + Number(arguments[1])}`);
    },
    permissions: [],
    requiredRoles: [],
};
