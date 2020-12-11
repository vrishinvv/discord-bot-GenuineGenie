module.exports = {
    commands: ['give-role'],
    expectedArgs: "<user's @> <role_name>",
    permissionError: '',
    minArgs: 2,
    maxArgs: 2,
    callback: (client, message, arguments, text) => {
        const targetUser = mesage.mentions.users.first();
        if (!targetUser) {
            message.reply('Please specify a proper user @');
            return;
        }

        // Remove the User's @, we dont need it any longert
        arguments.shift();

        // Ensure that the role exists
        const roleName = arguments.join(' ');
        const { guild } = message;
        const role = guild.role.cache.find((role) => {
            return role.name === roleName;
        });
        if (!role) {
            message.reply(`There is no role "${roleName}"`);
        }

        // Member object has more information than the User object
        const member = guild.members.cache.get(targetUser.id);

        // Give the role
        member.roles.add(roleMame);

        message.reply(`${targetUser} now has the role ${roleName} `);
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
};
