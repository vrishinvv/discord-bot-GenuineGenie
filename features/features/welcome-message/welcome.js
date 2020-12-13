/* module.exports = (client) => {
    const channelId = '786862580814839838'; //welcome
    const targetChannelId = '786863816058863656'; //rules-and-info

    client.on('guildMemberAdd', (member) => {
        console.log('added');
        const tag = `<@${member.id}>`;

        const tell = `Welcome ${tag} to the GG server! Please check out ${member.guild.channels.cache
            .get(targetChannelId)
            .toString()}`;

        const channel = member.guild.channels.cache.get(channelId);

        channel.send(tell);
    });
};
 */

const { onJoin } = require('@commands/management/set-welcome');
const dummy = require('@commands/management/set-welcome');
module.exports = async (client) => {
    // set up event listner for channel
    client.on('guildMemberAdd', (member) => {
        onJoin(member);
    });
};
