const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Success: Connected to Atlas');
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ Error Message:', err.message);
    process.exit(1);
  });
