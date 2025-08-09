import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config(); // Load environment variables
connectDB(); // Connect to MongoDB

const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@gmail.com'; // Change this email if needed
    const adminPassword = 'admin123'; // CHANGE THIS TO A STRONG PASSWORD IN REAL SCENARIOS!
    const adminUsername = 'sairoshan'; // Change this username if needed

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists.`);
      // Optionally update password if you want to re-seed with a new password
      // existingAdmin.password = await bcrypt.hash(adminPassword, await bcrypt.genSalt(10));
      // await existingAdmin.save();
      // console.log('Admin password updated.');
      process.exit();
    }

    // Create new admin user
    const adminUser = new User({
      username: adminUsername,
      email: adminEmail,
      password: adminPassword, // Mongoose pre-save hook will hash this
      role: 'admin',
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log(`Username: ${adminUsername}`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`); // This is the plain password you entered
    
    process.exit(); // Exit the script
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1); // Exit with error
  }
};

seedAdmin();
