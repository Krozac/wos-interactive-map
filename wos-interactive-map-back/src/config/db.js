import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://192.168.1.21:27017/mapBuildings';

  try {
    await mongoose.connect(mongoURI); // ✅ Clean and modern
    console.log('✅ Connected to MongoDB on ',mongoURI);
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

export default connectDB;
