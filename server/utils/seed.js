import { config } from '../config.js';
import Attendee from '../models/Attendee.js';
import Admin from '../models/Admin.js';
import { generateAttendeeCode } from './generateAttendeeCode.js';
import { generateQRCode } from './qrGenerator.js';

const seedAttendees = [
  {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '9876543210',
    designation: 'Student',
  },
  {
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '9876543211',
    designation: 'Alumni',
    passedOutYear: 2020,
  },
  {
    fullName: 'Robert Johnson',
    email: 'robert.j@example.com',
    phone: '9876543212',
    designation: 'Staff',
  },
  {
    fullName: 'Emily Davis',
    email: 'emily.d@example.com',
    phone: '9876543213',
    designation: 'Guest',
  },
  {
    fullName: 'Michael Brown',
    email: 'michael.b@example.com',
    phone: '9876543214',
    designation: 'VIP',
  },
  {
    fullName: 'Sarah Wilson',
    email: 'sarah.w@example.com',
    phone: '9876543215',
    designation: 'Alumni',
    passedOutYear: 2018,
  },
  {
    fullName: 'David Lee',
    email: 'david.l@example.com',
    phone: '9876543216',
    designation: 'Student',
  },
  {
    fullName: 'Lisa Anderson',
    email: 'lisa.a@example.com',
    phone: '9876543217',
    designation: 'Staff',
  },
];

const seedDatabase = async () => {
  try {
    console.log('✅ Starting database seed...');

    // Clear existing data
    await Attendee.deleteMany();
    await Admin.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create admin
    const admin = await Admin.create({
      email: config.ADMIN_EMAIL,
      password: config.ADMIN_PASSWORD,
    });
    console.log('👤 Admin created:', admin.email);

    // Create attendees with QR codes
    const attendees = [];
    for (const attendeeData of seedAttendees) {
      const attendeeCode = generateAttendeeCode(attendeeData.designation);
      const qrCode = await generateQRCode(attendeeCode);

      const attendee = await Attendee.create({
        ...attendeeData,
        attendeeCode,
        qrCode,
        isScanned: Math.random() > 0.5, // Randomly mark some as scanned
        entryTime: Math.random() > 0.5 ? new Date() : null,
      });

      attendees.push(attendee);
    }

    console.log(`✅ Created ${attendees.length} attendees`);
    console.log('\n📋 Sample Attendee Codes:');
    attendees.forEach((a) => {
      console.log(`   ${a.attendeeCode} - ${a.fullName} (${a.designation})`);
    });

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
