const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Function to test connection
const testConnection = async () => {
  if (!MONGODB_URI) {
    console.error('MongoDB URI not found in environment variables');
    process.exit(1);
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    console.log(`URI: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials in logs
    
    const conn = await mongoose.connect(MONGODB_URI);
    
    console.log('=================================');
    console.log('✅ MongoDB Connection Successful!');
    console.log(`Connected to: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    console.log(`MongoDB version: ${conn.version}`);
    console.log('=================================');
    
    // Close the connection after successful test
    await mongoose.connection.close();
    console.log('Connection closed successfully');
    
    return true;
  } catch (error) {
    console.error('=================================');
    console.error('❌ MongoDB Connection Failed!');
    console.error(`Error: ${error.message}`);
    console.error('=================================');
    
    // If it's a connection error, provide more specific feedback
    if (error.name === 'MongoNetworkError') {
      console.error('Network error - Check if MongoDB is running and accessible');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('Server selection error - Check your MongoDB URI and credentials');
    }
    
    return false;
  }
};

// Run the test if this script is executed directly
if (require.main === module) {
  testConnection()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = testConnection;