const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
    password: { type: String, required: true }
}, { timestamps: true });

// Metod som exkluderar lösenord när user returneras som JSON
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password; // tar bort lösenord
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;