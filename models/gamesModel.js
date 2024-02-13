const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gamesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    system: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Games = mongoose.model('Games', gamesSchema);

module.exports = Games;