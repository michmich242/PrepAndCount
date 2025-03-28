const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: false,
    },

    password: {
        type: String,
        required: true,
        unique: false,
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model('User', UserSchema, 'User');