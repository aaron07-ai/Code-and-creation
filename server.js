const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✓ Database connected successfully');
}).catch(err => {
    console.error('✗ Database connection error:', err.message);
    process.exit(1);
});

// Schema for collaboration messages
const collabSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now }
});

const Collab = mongoose.model('Collab', collabSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/contact', async (req, res) => {
    console.log('📨 Received POST /api/contact:', req.body);
    
    try {
        const { name, email, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !message) {
            console.warn('⚠️  Missing required fields');
            return res.status(400).json({ success: false, error: 'All fields (name, email, message) are required' });
        }

        // Create and save new collaboration entry
        const newCollab = new Collab({ name, email, message });
        const savedCollab = await newCollab.save();
        
        console.log('✓ Data inserted successfully:', savedCollab._id);
        const response = { 
            success: true,
            message: 'Message received! I\'ll get back to you soon.',
            id: savedCollab._id.toString()
        };
        console.log('📤 Sending response:', response);
        res.status(200).json(response);
    } catch (error) {
        console.error('✗ Error inserting data:', error);
        const errorResponse = { success: false, error: 'Failed to insert data: ' + error.message };
        console.error('📤 Sending error response:', errorResponse);
        res.status(500).json(errorResponse);
    }
});

// Keep old route for backwards compatibility
app.post('/submit', async (req, res) => {
    console.log('📨 Received POST /submit:', req.body);
    
    try {
        const { name, email, message } = req.body;
        
        if (!name || !email || !message) {
            console.warn('⚠️  Missing required fields');
            return res.status(400).json({ error: 'All fields (name, email, message) are required' });
        }

        const newCollab = new Collab({ name, email, message });
        await newCollab.save();
        
        console.log('✓ Data inserted successfully:', newCollab._id);
        res.status(200).json({ 
            message: 'Data inserted successfully',
            id: newCollab._id
        });
    } catch (error) {
        console.error('✗ Error inserting data:', error.message);
        res.status(500).json({ error: 'Failed to insert data: ' + error.message });
    }
});

// Start the server with retry logic when the port is already in use
function startServer(port, retries = 3) {
    const attempt = (p, remaining) => {
        const srv = app.listen(p, () => {
            console.log(`\n🚀 Server running on http://localhost:${p}`);
            console.log(`📝 Submit forms at http://localhost:${p}`);
        });

        srv.on('error', (err) => {
            if (err && err.code === 'EADDRINUSE') {
                console.error(`✗ Port ${p} is already in use.`);
                if (remaining > 0) {
                    const nextPort = parseInt(p, 10) + 1;
                    console.log(`→ Retrying with port ${nextPort} (${remaining} retries left)`);
                    // Give the OS a moment before retrying
                    setTimeout(() => {
                        attempt(nextPort, remaining - 1);
                    }, 500);
                } else {
                    console.error('✗ No available ports left to try. Exiting.');
                    process.exit(1);
                }
            } else {
                console.error('✗ Server error:', err);
                process.exit(1);
            }
        });
    };

    attempt(port, retries);
}

startServer(PORT, 5);