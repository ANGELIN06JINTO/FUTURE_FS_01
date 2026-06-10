const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options silence deprecation warnings
      serverSelectionTimeoutMS: 10000,  // Fail fast if Atlas is unreachable
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('   Make sure your MONGODB_URI in .env is correct.');
    // Exit process with failure — let nodemon/pm2 restart if needed
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed (SIGINT)');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed (SIGTERM)');
  process.exit(0);
});

module.exports = connectDB;