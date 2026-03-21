const mongoose = require('mongoose');

// Define the blueprint for a contact message
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now } // Automatically stamps the exact time they message you
});

// Export it so our server can use it
module.exports = mongoose.model('Contact', contactSchema);