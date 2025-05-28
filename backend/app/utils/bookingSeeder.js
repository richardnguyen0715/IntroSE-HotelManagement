const mongoose = require('mongoose');
const { Booking } = require('../models/Booking'); // Correct import using named export
const { Room } = require('../models/Room');
const User = require('../models/User');

/**
 * Generate sample bookings across multiple months for testing the revenue report
 */
exports.generateSampleBookings = async () => {
  try {
    console.log('Generating sample bookings for revenue reports...');

    // Get a customer user
    const customer = await User.findOne({ role: 'customer' });
    if (!customer) {
      console.error('No customer users found. Please run the main seeder first.');
      return;
    }

    // Get all rooms
    const rooms = await Room.find();
    if (rooms.length === 0) {
      console.error('No rooms found. Please run the main seeder first.');
      return;
    }

    // Group rooms by type
    const roomsByType = {};
    rooms.forEach(room => {
      if (!roomsByType[room.type]) {
        roomsByType[room.type] = [];
      }
      roomsByType[room.type].push(room);
    });

    const sampleBookings = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const timestamp = Date.now();

    // Create sample customer data for bookings
    const createCustomer = (index) => {
      const isDomestic = Math.random() > 0.3; // 70% domestic customers
      return {
        name: `Test Customer ${index}`,
        type: isDomestic ? 'domestic' : 'foreign',
        identityCard: isDomestic ? 
          `${Math.floor(Math.random() * 999999999) + 1000000000}` : // Vietnamese ID
          `P${Math.floor(Math.random() * 9999999) + 1000000}`, // Passport number
        address: `${Math.floor(Math.random() * 999) + 1} Test Street`
      };
    };

    for (let monthOffset = -3; monthOffset <= 3; monthOffset++) {
      const bookingMonth = new Date(currentYear, currentDate.getMonth() + monthOffset, 1);
      const monthDays = new Date(bookingMonth.getFullYear(), bookingMonth.getMonth() + 1, 0).getDate();

      for (const roomType of Object.keys(roomsByType)) {
        const bookingsPerType = 3 + Math.floor(Math.random() * 5); // 3–7 bookings

        for (let i = 0; i < bookingsPerType; i++) {
          let attempt = 0;
          const maxAttempts = 10;
          let created = false;

          while (attempt < maxAttempts && !created) {
            attempt++;

            const roomIndex = Math.floor(Math.random() * roomsByType[roomType].length);
            const room = roomsByType[roomType][roomIndex];

            const startDay = Math.floor(Math.random() * monthDays) + 1;
            const startDate = new Date(bookingMonth.getFullYear(), bookingMonth.getMonth(), startDay);

            // Check for overlap with existing sample bookings
            const isConflict = sampleBookings.some(b =>
              b.roomNumber === room.roomNumber &&
              new Date(b.startDate).getMonth() === startDate.getMonth() &&
              new Date(b.startDate).getDate() === startDate.getDate()
            );

            if (isConflict) continue;

            // Create 1-3 customers for the booking
            const customerCount = Math.floor(Math.random() * 3) + 1;
            const customerList = [];
            for (let c = 0; c < customerCount; c++) {
              customerList.push(createCustomer(`${i}${c}${timestamp}`));
            }

            // Status logic: active for future/current, inactive for past
            const status = monthOffset < 0 ? 'inactive' : 'active';

            const booking = {
              roomNumber: room.roomNumber,
              startDate: startDate,
              customerList: customerList,
              status: status
            };

            sampleBookings.push(booking);
            created = true;
          }
        }
      }
    }

    // Save all the bookings to DB
    if (sampleBookings.length > 0) {
      await Booking.insertMany(sampleBookings);
      console.log(`Successfully created ${sampleBookings.length} sample bookings across 7 months`);
    }

    return sampleBookings;
  } catch (error) {
    console.error('Error generating sample bookings:', error);
    throw error;
  }
};

// Optional: Run as standalone script
if (require.main === module) {
  const config = require('../config/config');
  mongoose.connect(config.MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      exports.generateSampleBookings()
        .then(() => mongoose.disconnect());
    })
    .catch(err => console.error('Database connection error:', err));
}