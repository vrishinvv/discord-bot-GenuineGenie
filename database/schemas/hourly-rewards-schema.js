const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const hourlyRewardsSchema = mongoose.Schema(
    {
        userId: reqString,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('hourly-rewards', hourlyRewardsSchema);
