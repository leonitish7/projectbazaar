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

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('WARNING: MONGODB_URI environment variable is not defined');
    throw new Error(
      'Please define the MONGODB_URI environment variable in your Vercel project settings'
    );
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(mongoUri, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
