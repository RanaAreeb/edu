import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cachedClient = null;
let cachedDb = null;

export async function getMongoDb() {
  // If we have cached values, use them
  if (cachedDb) {
    return cachedDb;
  }

  if (!cachedClient) {
    cachedClient = await MongoClient.connect(MONGODB_URI);
  }

  cachedDb = cachedClient.db();
  return cachedDb;
}

export async function getMongoClient() {
  try {
    return await cachedClient;
  } catch (error) {
    console.error('MongoDB client error:', error);
    throw new Error('Failed to get MongoDB client');
  }
}
