const mongoose = require('mongoose');
const User = require('../models/User');
const Room = require('../models/Room');
const RoomType = require('../models/RoomType');
const { Booking } = require('../models/Booking'); // Fixed import syntax
const Invoice = require('../models/Invoice');
const HotelPolicy = require('../models/hotelPolicy');

// Main seeder function to call all seeders
exports.seedDatabase = async () => {
  console.log('Starting database seeding...');
  
  try {
    // Seed in order of dependencies
    await this.seedHotelPolicy();
    await this.seedRoomTypes();
    const users = await this.seedUsers();
    const rooms = await this.seedRooms();
    const bookings = await this.seedBookings(users, rooms);
    await this.seedInvoices(bookings); // Add this line back
    // await this.seedTestBookings();
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Database seeding failed:', error);
  }
};

// Seed room types
exports.seedRoomTypes = async () => {
  try {
    // Check if room types exist
    const count = await RoomType.countDocuments();

    if (count === 0) {
      console.log('Creating default room types...');
      
      const defaultTypes = [
        {
          type: 'A',
          price: 150000,
        },
        {
          type: 'B',
          price: 170000,
        },
        {
          type: 'C',
          price: 200000,
        }
      ];
      
      await RoomType.insertMany(defaultTypes);
      console.log('Default room types initialized');
    } else {
      console.log(`Room types already exist (${count} types found)`);
    }
    
    return await RoomType.find();
  } catch (error) {
    console.error('Error seeding room types:', error);
    throw error;
  }
};

// Seed hotel policy
exports.seedHotelPolicy = async () => {
  try {
    const policyExists = await HotelPolicy.findOne();
    
    if (!policyExists) {
      console.log('Creating default hotel policy...');
      const defaultPolicy = new HotelPolicy(); // Uses schema defaults
      await defaultPolicy.save();
      console.log('Default hotel policy created successfully');
      return defaultPolicy;
    } else {
      console.log('Hotel policy already exists');
      return policyExists;
    }
  } catch (error) {
    console.error('Error seeding hotel policy:', error);
    throw error;
  }
};

// Seed default users
exports.seedUsers = async () => {
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    const staffExists = await User.findOne({ role: 'staff' });
    
    const createdUsers = [];
    
    // Create default admin if none exists
    if (!adminExists) {
      console.log('Creating default admin user...');
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@hotel.com',
        password: 'Admin@123',
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Default admin created successfully');
      createdUsers.push(adminUser);
    }
    
    // Create default staff if none exists
    if (!staffExists) {
      console.log('Creating default staff user...');
      const staffUser = new User({
        name: 'Staff User',
        email: 'staff@hotel.com',
        password: 'Staff@123',
        role: 'staff'
      });
      
      await staffUser.save();
      console.log('Default staff created successfully');
      createdUsers.push(staffUser);
    }
    
    // Create a default customer for testing
    const customerExists = await User.findOne({ 
      email: 'customer@example.com', 
      role: 'customer' 
    });
    
    if (!customerExists) {
      console.log('Creating default customer user...');
      const customerUser = new User({
        name: 'Test Customer',
        email: 'customer@example.com',
        password: 'Customer@123',
        role: 'customer'
      });
      
      await customerUser.save();
      console.log('Default customer created successfully');
      createdUsers.push(customerUser);
    }
    
    return createdUsers.length > 0 ? createdUsers : [adminExists, staffExists];
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

// Seed default rooms
exports.seedRooms = async () => {
  try {
    // Check if rooms exist
    const roomCount = await Room.countDocuments();
    
    if (roomCount === 0) {
      console.log('Creating default rooms...');
      
      // Get all room types
      const roomTypes = await RoomType.find();
      if (roomTypes.length === 0) {
        console.error('No room types found. Please run seedRoomTypes first.');
        return [];
      }
      
      const roomsToCreate = [];
      
      // Create 5 rooms of each type
      for (let i = 1; i <= 5; i++) {
        for (const roomType of roomTypes) {
          roomsToCreate.push({
            roomNumber: `${roomType.type}${i.toString().padStart(2, '0')}`,
            type: roomType.type,
            capacity: 3,
            status: 'available'
          });
        }
      }
      
      const rooms = await Room.insertMany(roomsToCreate);
      console.log(`Created ${rooms.length} default rooms`);
      return rooms;
    } else {
      console.log(`Rooms already exist (${roomCount} rooms found)`);
      return await Room.find().limit(5); // Return a few rooms for reference
    }
  } catch (error) {
    console.error('Error seeding rooms:', error);
    throw error;
  }
};

// Updated: Seed sample bookings using the new schema
exports.seedBookings = async (users, rooms) => {
  try {
    // Check if bookings exist
    const bookingCount = await Booking.countDocuments();
    
    if (bookingCount === 0 && users.length > 0 && rooms.length > 0) {
      console.log('Creating sample bookings...');
      const today = new Date();
      
      // Create sample customer data
      const sampleCustomers = [
        {
          name: 'John Doe',
          type: 'domestic',
          identityCard: '1234567890',
          address: '123 Test Street'
        },
        {
          name: 'Jane Smith',
          type: 'domestic',
          identityCard: '0987654321',
          address: '456 Main Road'
        }
      ];
      
      const bookings = [];
      
      // Create 10 bookings from the first 10 rooms
      for (let i = 0; i < 10; i++) {
        if (i < rooms.length) {
          const sampleBooking = new Booking({
            roomNumber: rooms[i].roomNumber,
            startDate: new Date(today.getTime() + (7 + i) * 24 * 60 * 60 * 1000), // Staggered start dates
            customerList: sampleCustomers,
            status: 'active'
          });
          
          await sampleBooking.save();
          bookings.push(sampleBooking);
          
          // Update room status to 'occupied'
          await Room.findOneAndUpdate(
            { roomNumber: rooms[i].roomNumber },
            { status: 'occupied' },
            { new: true }
          );
        }
      }
      
      console.log(`Created ${bookings.length} sample bookings successfully`);
      return bookings;
    } else {
      console.log(`Bookings already exist (${bookingCount} bookings found)`);
      return await Booking.find().limit(10);
    }
  } catch (error) {
    console.error('Error seeding bookings:', error);
    throw error;
  }
};

// Seed sample invoices - Updated for new Booking schema
exports.seedInvoices = async (bookings) => {
  try {
    // Check if invoices exist
    const invoiceCount = await Invoice.countDocuments();
    
    if (invoiceCount === 0 && bookings.length > 0) {
      console.log('Creating sample invoices...');
      
      // Only proceed if we have at least 6 bookings
      if (bookings.length < 6) {
        console.log('Not enough bookings to create sample invoices (need at least 6)');
        return [];
      }
      
      const invoices = [];
      
      // Create 3 invoices, each for 2 bookings
      for (let i = 0; i < 3; i++) {
        const bookingPair = [bookings[i*2], bookings[i*2+1]];
        const rentals = [];
        let totalInvoiceValue = 0;
        
        // Process each booking in the pair
        for (const booking of bookingPair) {
          // Get the room type to determine price
          const room = await Room.findOne({ roomNumber: booking.roomNumber });
          if (!room) {
            console.error(`Room not found for booking with roomNumber: ${booking.roomNumber}`);
            continue;
          }
          
          // Calculate a price based on room type
          let basePrice = 0;
          switch (room.type) {
            case 'A': basePrice = 150000; break;
            case 'B': basePrice = 170000; break;
            case 'C': basePrice = 200000; break;
            default: basePrice = 150000;
          }
          
          // Assume 3 nights stay
          const stayLength = 3;
          const rentalTotal = basePrice * stayLength;
          
          // Add to the total invoice value
          totalInvoiceValue += rentalTotal;
          
          // Add rental entry for this booking
          rentals.push({
            roomNumber: booking.roomNumber,
            numberOfDays: stayLength,
            pricePerDay: basePrice,
            total: rentalTotal
          });
          
          // Update booking status to 'inPayment'
          await Booking.findByIdAndUpdate(
            booking._id,
            { status: 'inPayment' },
            { new: true }
          );
        }
        
        // Get customer info from the first booking in the pair
        const firstBooking = bookingPair[0];
        const customerName = firstBooking.customerList && firstBooking.customerList.length > 0 
          ? firstBooking.customerList[0].name 
          : 'Guest';
          
        const customerAddress = firstBooking.customerList && firstBooking.customerList.length > 0 
          ? (firstBooking.customerList[0].address || 'No address provided') 
          : 'No address provided';
        
        // Create invoice for this booking pair
        const invoice = new Invoice({
          customer: customerName,
          address: customerAddress,
          totalValue: totalInvoiceValue,
          rentals: rentals,
          status: 'pending'
        });
        
        await invoice.save();
        invoices.push(invoice);
      }
      
      console.log(`Created ${invoices.length} sample invoices successfully`);
      return invoices;
    } else {
      console.log(`Invoices already exist (${invoiceCount} invoices found)`);
      return [];
    }
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
};

exports.seedTestBookings = async () => {
  try {
    const bookingSeeder = require('./bookingSeeder');
    return await bookingSeeder.generateSampleBookings();
  } catch (error) {
    console.error('Error seeding test bookings:', error);
    return [];
  }
};