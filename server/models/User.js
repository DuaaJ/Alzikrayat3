
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    occupation: {
        type: String,
        default: ''
    }
});

userSchema.statics.getEmail = function (email) {
    return this.findOne({ email: email.toLowerCase().trim() });
};

userSchema.statics.addUser = function (userData) {
    return this.create(userData);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
