// models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define schema for admin
const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Hash password before saving it
adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10); // Hash password with salt rounds
    }
    next();
});

// Create and export the Admin model
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
