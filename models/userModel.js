const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
   
    
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

userSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Ensure virtual fields are included when you convert a document to JSON
userSchema.set('toJSON', {
    virtuals: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;