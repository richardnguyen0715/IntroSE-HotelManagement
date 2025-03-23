const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const connectDB = require('./config/database');

// Import routes
const systemRoutes = require('./routes/systemRoutes');
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/system', systemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);

// Simple test route
app.get('/', (req, res) => {
  res.send('Hotel Management API is running');
});

// Start the server
app.listen(config.PORT, () => {
  console.log(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
});