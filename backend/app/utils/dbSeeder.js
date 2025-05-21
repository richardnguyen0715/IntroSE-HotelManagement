const mongoose = require('mongoose');
const User = require('../models/User');
const { Room, RoomType } = require('../models/Room');
const Booking = require('../models/Booking');
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
    await this.seedInvoices(bookings);
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

// Seed sample bookings
exports.seedBookings = async (users, rooms) => {
  try {
    // Check if bookings exist
    const bookingCount = await Booking.countDocuments();
    
    if (bookingCount === 0 && users.length > 0 && rooms.length > 0) {
      console.log('Creating sample bookings...');
      const today = new Date();
      
      // Create a sample booking
      const sampleBooking = new Booking({
        email: users.find(u => u.role === 'customer')?.email || 'customer@example.com',
        room: rooms[0].roomNumber,
        checkInDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        checkOutDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        totalPrice: rooms[0].type === 'A' ? 450000 : rooms[0].type === 'B' ? 510000 : 600000, // 3 days * price
        status: 'confirmed',
        paymentStatus: 'pending'
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

// Seed sample invoices
exports.seedInvoices = async (bookings) => {
  try {
    // Check if invoices exist
    const invoiceCount = await Invoice.countDocuments();
    
    if (invoiceCount === 0 && bookings.length > 0) {
      console.log('Creating sample invoice...');
      
      const booking = bookings[0];
      const today = new Date();
      
      // Generate an invoice number
      const invoiceNumber = `INV-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Create a sample invoice
      const sampleInvoice = new Invoice({
        invoiceNumber: invoiceNumber, // Add this line
        booking: booking._id,
        user: booking.email,
        issueDate: today,
        dueDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        items: [{
          description: `Room ${booking.room} (${booking.checkInDate.toLocaleDateString()} - ${booking.checkOutDate.toLocaleDateString()})`,
          unitPrice: booking.totalPrice / 3, // Per night
          amount: 3 // 3 nights
        }],
        subtotal: booking.totalPrice,
        total: booking.totalPrice,
        status: 'draft'
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
  const bookingSeeder = require('./bookingSeeder');
  return await bookingSeeder.generateSampleBookings();
};