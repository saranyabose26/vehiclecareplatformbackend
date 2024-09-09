const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true, // Use the new URL string parser
      useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      // Add more options as needed
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error', error);
    process.exit(1);
  }
};

module.exports = connectDB;
