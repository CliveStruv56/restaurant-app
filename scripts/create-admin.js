
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@savorybites.com',
        password: hashedPassword,
        phone: '+1234567890',
        role: 'ADMIN'
      }
    });

    console.log('Admin user created successfully:');
    console.log('Email: admin@savorybites.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login.');

    // Create default restaurant settings
    const existingSettings = await prisma.restaurantSettings.findFirst();
    if (!existingSettings) {
      await prisma.restaurantSettings.create({
        data: {
          restaurantName: 'Savory Bites',
          restaurantPhone: '+1234567890',
          restaurantEmail: 'info@savorybites.com',
          restaurantAddress: '123 Food Street, Culinary City, CC 12345',
          openingTime: '09:00',
          closingTime: '22:00',
          bookingSlotDuration: 120,
          maxAdvanceBookingDays: 30,
          pickupTimeSlots: [
            '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
            '14:00', '14:30', '17:00', '17:30', '18:00', '18:30',
            '19:00', '19:30', '20:00', '20:30'
          ],
          isOnline: true
        }
      });
      console.log('Default restaurant settings created.');
    }

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
