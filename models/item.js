const mongoose = require('mongoose');

// Define the Items schema
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    table_number: { type: Number, required: true }, // Adjust field names as per your structure
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

// Create the Items model
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
