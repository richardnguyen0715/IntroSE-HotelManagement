const mongoose = require('mongoose');

const hotelPolicySchema = new mongoose.Schema({
    maxCapacity: {
        type: Number,
        required: true,
        default: 3
    },
    domesticPolicy: {
        type: Number,
        required: true,
        default: 1    
    },
    foreignPolicy: {
        type: Number,
        required: true,
        default: 1.5
    },
    surchargePolicy: {
        type: Number,
        required: true,
        default: 0.25
    },
});

const HotelPolicy = mongoose.model('HotelPolicy', hotelPolicySchema);
module.exports = HotelPolicy;