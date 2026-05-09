const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const clearDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Clear collections
    console.log('Clearing Users...');
    await mongoose.connection.collection('users').deleteMany({});
    
    console.log('Clearing Projects...');
    await mongoose.connection.collection('projects').deleteMany({});
    
    console.log('Clearing Tasks...');
    await mongoose.connection.collection('tasks').deleteMany({});

    console.log('Database cleared successfully!');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  }
};

clearDatabase();
