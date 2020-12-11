const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const messageCountSchema = mongoose.Schema({
    _id: reqString,
    messageCount: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('message-counts', messageCountSchema);
