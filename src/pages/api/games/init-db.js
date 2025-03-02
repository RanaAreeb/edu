import { MongoClient } from 'mongodb';
import { games } from '../../../data/games';

const MONGODB_URI = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();
    const gamesCollection = db.collection('games');

    // First, check if games already exist
    const existingGames = await gamesCollection.countDocuments();
    if (existingGames > 0) {
      return res.status(400).json({ message: 'Games are already initialized in the database' });
    }

    // Initialize each game with totalPlays set to 0
    const gamesWithTotalPlays = games.map(game => ({
      ...game,
      id: game.id.toString(), // Convert id to string for consistency
      totalPlays: 0
    }));

    // Insert all games into the database
    const result = await gamesCollection.insertMany(gamesWithTotalPlays);

    return res.status(200).json({
      message: 'Games initialized successfully',
      count: result.insertedCount
    });
  } catch (error) {
    console.error('Error initializing games:', error);
    return res.status(500).json({ error: 'Failed to initialize games' });
  } finally {
    await client.close();
  }
} 