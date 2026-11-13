import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * @returns {Promise<typeof mongoose>}
 */
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri || mongoUri.includes('<db_password>')) {
      console.warn('⚠️ MONGODB_URI has placeholder <db_password>. Update backend/.env with your MongoDB password when ready.');
      console.warn('⚠️ Server running in resilient mode for development and testing.');
      return null;
    }

    const conn = await mongoose.connect(mongoUri, {
      autoIndex: process.env.NODE_ENV !== 'production'
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    console.warn('⚠️ Continuing in resilient local development mode.');
    return null;
  }
};

export default connectDB;
