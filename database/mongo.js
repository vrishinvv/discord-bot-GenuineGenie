const mongoose = require('mongoose');
const mongoURL = process.env.mongoURL;

module.exports = async () => {
    await mongoose.connect(encodeURI(mongoURL), {
        //keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    return mongoose;
};
