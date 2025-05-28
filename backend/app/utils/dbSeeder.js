const mongoose = require('mongoose');
const User = require('../models/User');
const { Room, RoomType } = require('../models/Room');
const { Booking } = require('../models/Booking'); // Fixed import syntax
const Invoice = require('../models/Invoice');
const HotelPolicy = require('../models/hotelPolicy');

// Main seeder function to call all seeders
exports.seedDatabase = async () => {
  console.log('Starting database seeding...');
  
  try {
    // Seed in order of dependencies
    await this.seedHotelPolicy();
    const users = await this.seedUsers();
    const rooms = await this.seedRooms();
    const bookings = await this.seedBookings(users, rooms);
    await this.seedInvoices(bookings); // Add this line back
    await this.seedTestBookings();
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Database seeding failed:', error);
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
      const roomsToCreate = [];
      
      // Create 5 rooms of each type
      for (let i = 1; i <= 5; i++) {
        roomsToCreate.push({
          roomNumber: `A${i.toString().padStart(2, '0')}`,
          type: 'A',
          status: 'available'
        });
        
        roomsToCreate.push({
          roomNumber: `B${i.toString().padStart(2, '0')}`,
          type: 'B',
          status: 'available'
        });
        
        roomsToCreate.push({
          roomNumber: `C${i.toString().padStart(2, '0')}`,
          type: 'C',
          status: 'available'
        });
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
      
      // Create a sample booking with the new schema
      const sampleBooking = new Booking({
        roomNumber: rooms[0].roomNumber,
        startDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        customerList: sampleCustomers,
        status: 'active'
      });
      
      await sampleBooking.save();
      console.log('Sample booking created successfully');
      return [sampleBooking];
    } else {
      console.log(`Bookings already exist (${bookingCount} bookings found)`);
      return await Booking.find().limit(1);
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
      console.log('Creating sample invoice...');
      
      const booking = bookings[0];
      
      // Get the room type to determine price
      const room = await Room.findOne({ roomNumber: booking.roomNumber });
      if (!room) {
        console.error('Room not found for booking');
        return [];
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
      const totalPrice = basePrice * stayLength;
      
      // Get customer info from booking
      const customerName = booking.customerList && booking.customerList.length > 0 
        ? booking.customerList[0].name 
        : 'Guest';
        
      const customerAddress = booking.customerList && booking.customerList.length > 0 
        ? (booking.customerList[0].address || 'No address provided') 
        : 'No address provided';
      
      // Create a sample invoice with the correct schema
      const sampleInvoice = new Invoice({
        customer: customerName,
        address: customerAddress,
        totalValue: totalPrice,
        rentals: [{
          roomNumber: booking.roomNumber,
          numberOfDays: stayLength,
          pricePerDay: basePrice,
          total: totalPrice
        }],
        status: 'pending'  // Valid status according to the schema
      });
      
      await sampleInvoice.save();
      console.log('Sample invoice created successfully');
      return [sampleInvoice];
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