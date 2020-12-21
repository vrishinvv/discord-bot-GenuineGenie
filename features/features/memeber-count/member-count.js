module.exports = (client) => {
    const channelId = '786900703804129290'; // member Count channel

    const updateMemmbers = (guild) => {
        const channel = guild.channels.cache.get(channelId);
        if (!channel) return;
        channel.setName(`Members: ${guild.memberCount.toLocaleString()}`);
    };

    client.on('guildMemberAdd', (member) => updateMemmbers(member.guild));
    client.on('guildMemberRemove', (member) => updateMemmbers(member.guild));

    const guild = client.guilds.cache.get('776778928639311882');
    updateMemmbers(guild);
};
