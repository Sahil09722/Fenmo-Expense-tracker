const mongoose = require('mongoose');

const connectDB = async () => {
    const MAX_RETRIES = 5;
    const RETRY_DELAY_MS = 3000;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const conn = await mongoose.connect(process.env.MONGODB_URI, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });

            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

            mongoose.connection.on('error', (err) => {
                console.error('MongoDB connection error:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.warn('MongoDB disconnected. Attempting to reconnect...');
            });

            mongoose.connection.on('reconnected', () => {
                console.log('MongoDB reconnected');
            });

            return conn;
        } catch (error) {
            console.error(
                `MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed:`,
                error.message
            );

            if (attempt === MAX_RETRIES) {
                console.error('Max retries reached. Exiting...');
                process.exit(1);
            }

            const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
            console.log(`Retrying in ${delay / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
};

module.exports = connectDB;