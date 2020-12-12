const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const reqNumber = {
    type: Number,
    required: true,
};

const reqBoolean = {
    type: Boolean,
    required: true,
};

const profileSchema = mongoose.Schema({
    name: reqString,
    userId: reqString,
    coins: reqNumber,
    vault_coins: reqNumber,
    vault_size: reqNumber,
    hunting_bow: reqBoolean,
    fishing_rod: reqBoolean,
    commands_issued: reqNumber,
});

module.exports = mongoose.model('profiles', profileSchema);
