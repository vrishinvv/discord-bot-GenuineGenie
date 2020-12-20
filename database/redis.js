const redis = require('redis');
//const { redisURL } = require('@root/config.json');
const redisURL = process.env.redisURL;
// 8rAhMhZyLOsbe1oWVrC45Zikzkt76BJY
// redis-18143.c232.us-east-1-2.ec2.cloud.redislabs.com:18143

module.exports = async () => {
    return await new Promise((resolve, reject) => {
        const client = redis.createClient({
            url: redisURL,
        });

        client.on('error', (err) => {
            console.error('Radis error: ', err);
            client.quit();
            reject(err);
        });

        client.on('ready', () => {
            resolve(client);
        });
    });
};

module.exports.expire = (callback) => {
    const expired = () => {
        const sub = redis.createClient({ url: redisURL });
        sub.subscribe('__keyevent@0__:expired', () => {
            sub.on('message', (channel, message) => {
                callback(message);
            });
        });
    };

    const pub = redis.createClient({ url: redisURL });
    pub.send_command('config', ['set', 'notify-keyspace-events', 'Ex'], expired());
};

// later convert code to mongoDB
