import { MongoClient } from "mongodb";

// MongoDB connection URI (should be stored in your environment variable)
const uri = process.env.MONGODB_URI; // Ensure this is set in your .env.local file

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb) {
    // Return the cached database connection if it exists
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(); // Default database
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
