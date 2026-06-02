import mongoose from 'mongoose';

// Define the type for our cached mongoose connection
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Define global mongoose in a proper namespace
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Try to get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || '';

// Check if MONGODB_URI is defined
if (!MONGODB_URI) {
  console.error('WARNING: MONGODB_URI environment variable is not defined');
  // In production, we still want to fail to prevent security issues
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Please define the MONGODB_URI environment variable in your Vercel project settings'
    );
  }
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
