const User = require('../models/User');

exports.seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ideanomics.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Platform Owner',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        role: 'admin'
      });
      console.log('✅ Default admin account created:', adminEmail);
    } else {
      console.log('ℹ️  Admin account already exists');
    }
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
  }
};
