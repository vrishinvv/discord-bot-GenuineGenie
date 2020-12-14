const mongoose = require('mongoose');
const { mongoURL } = require('@root/config.json');

module.exports = async () => {
    await mongoose.connect(mongoURL, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    return mongoose;
};
