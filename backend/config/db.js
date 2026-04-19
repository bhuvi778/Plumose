import mongoose from 'mongoose';

// Cache connection across serverless invocations
let cached = { conn: null, promise: null };

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/divyam';
    cached.promise = mongoose.connect(uri).then((m) => {
      console.log(`✅ MongoDB connected: ${m.connection.host}`);
      return m;
    }).catch((err) => {
      cached.promise = null;
      console.error('❌ MongoDB connection error:', err.message);
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
