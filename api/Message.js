const mongoose = require('mongoose');

// This is your "Schema" (the blueprint for your data)
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);