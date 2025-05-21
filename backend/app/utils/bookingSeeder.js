const mongoose = require('mongoose');
const Booking = require('../models/Booking');
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
    const emailPrefix = customer.email.split('@')[0];
    const emailSuffix = customer.email.split('@')[1];
    const timestamp = Date.now();

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

            const stayLength = 1 + Math.floor(Math.random() * 7);
            const maxStartDay = monthDays - stayLength + 1;
            const startDay = Math.floor(Math.random() * maxStartDay) + 1;

            const checkInDate = new Date(bookingMonth.getFullYear(), bookingMonth.getMonth(), startDay);
            const checkOutDate = new Date(bookingMonth.getFullYear(), bookingMonth.getMonth(), startDay + stayLength);

            // Check for overlap with existing sample bookings
            const isConflict = sampleBookings.some(b =>
              b.room === room.roomNumber &&
              checkInDate < b.checkOutDate &&
              checkOutDate > b.checkInDate
            );

            if (isConflict) continue;

            // Price per room type
            let basePrice = 0;
            switch (roomType) {
              case 'A': basePrice = 150000; break;
              case 'B': basePrice = 170000; break;
              case 'C': basePrice = 200000; break;
              default: basePrice = 0;
            }

            const totalPrice = basePrice * stayLength;

            // Status logic
            const rand = Math.random();
            let status;
            if (monthOffset < 0) {
              status = 'checked-out';
            } else if (monthOffset === 0) {
              if (rand < 0.6) status = 'confirmed';
              else if (rand < 0.8) status = 'cancelled';
              else status = 'checked-in';
            } else {
              status = rand < 0.8 ? 'confirmed' : 'checked-in';
            }

            const booking = {
              email: `${emailPrefix}+${timestamp}_${room.roomNumber}_${i}_${monthOffset}@${emailSuffix}`,
              room: room.roomNumber,
              checkInDate,
              checkOutDate,
              totalPrice,
              status,
              paymentStatus: status === 'checked-out' ? 'paid' : 'pending'
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
      console.log(`✅ Successfully created ${sampleBookings.length} sample bookings across 7 months`);
    }

    return sampleBookings;
  } catch (error) {
    console.error('❌ Error generating sample bookings:', error);
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
