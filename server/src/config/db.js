import { setServers } from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env.js';

/** Connect to MongoDB before accepting HTTP traffic. @returns {Promise<void>} */
export async function connectDB() {
  if (env.mongoDnsServers.length > 0) {
    setServers(env.mongoDnsServers);
  }
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10000 });
}
