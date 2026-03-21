const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Message = require('./Message'); // Importing the schema we just made

const app = express();

// MIDDLEWARE
app.use(cors()); // Allows your frontend to talk to this server
app.use(express.json()); // Allows the server to read JSON data

// 1. DATABASE CONNECTION
// Make sure your .env file has: MONGO_URI=your_mongodb_link
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Database Connected: Logic & Motion Engine Ready"))
    .catch(err => console.log("❌ Database Connection Error:", err));

// 2. THE "POST" ROUTE (The Receiver)
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Create a new entry in the database
        const newMessage = new Message({ name, email, message });
        await newMessage.save();

        res.status(201).json({ success: true, message: "Message stored in MongoDB!" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Server Error" });
    }
});

// 3. START SERVER
const PORT = process.env.PORT || 5000;
module.exports = app;