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
    items: reqString,
    huntedCount: reqNumber,
    fishedCount: reqNumber,
    inventoryCount: reqNumber,
    commands_issued: {
        type: Number,
        default: 0,
    },
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 1,
    },
    hp: {
        type: Number,
        default: 100,
    },
    atk: {
        type: Number,
        default: 30,
    },
    def: {
        type: Number,
        default: 30,
    },
});

module.exports = mongoose.model('profiles', profileSchema);
