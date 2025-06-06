const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    username: { type: String, required: true }, // ✅ Add this
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    otp: { type: String },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
}, {
    timestamps: true,
});


// Password encryption
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Password matching
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to set password (when updating password)
userSchema.methods.setPassword = async function (newPassword) {
    return await bcrypt.hash(newPassword, 10);
};
const User = mongoose.model('User', userSchema);

module.exports = User;
