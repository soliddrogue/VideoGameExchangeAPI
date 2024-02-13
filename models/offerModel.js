const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    offeredUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    offeringUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    state: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;