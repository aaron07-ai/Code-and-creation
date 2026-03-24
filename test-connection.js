const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

console.log('Testing MongoDB Connection...');
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✓ DATABASE CONNECTED SUCCESSFULLY');
    process.exit(0);
}).catch(err => {
    console.error('✗ CONNECTION FAILED:');
    console.error('Error:', err.message);
    process.exit(1);
});

// Timeout after 15 seconds
setTimeout(() => {
    console.error('✗ Connection timeout');
    process.exit(1);
}, 15000);
