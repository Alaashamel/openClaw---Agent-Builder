import mongoose from 'mongoose';
import { env } from './env.js';

let cachedConnection = null;

export async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  mongoose.set('strictQuery', true);

  cachedConnection = await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 15000
  });

  console.log(`MongoDB connected: ${mongoose.connection.name}`);
  return cachedConnection;
}
