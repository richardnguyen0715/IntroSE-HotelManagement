const mongoose = require('mongoose');
const config = require('./config/config');
const dbSeeder = require('./utils/dbSeeder');

// Kết nối database
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected: ' + config.MONGODB_URI);
    
    // Chạy seeder
    return dbSeeder.seedDatabase();
  })
  .then(() => {
    console.log('Database seeding completed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error seeding database:', err);
    process.exit(1);
  });