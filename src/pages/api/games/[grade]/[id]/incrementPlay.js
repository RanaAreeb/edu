import { MongoClient } from 'mongodb';
import { games } from '../../../../../data/games';  // Importing game data from the JS file

const MONGODB_URI = process.env.MONGODB_URI;

export default async (req, res) => {
  const { grade, id } = req.query; // Get grade and id from URL params

  // Debug: Log the grade and id to ensure they're being passed correctly
  console.log("Grade:", grade);
  console.log("ID:", id);

  // MongoDB client initialization
  const client = new MongoClient(MONGODB_URI);

  if (req.method === 'POST') {
    try {
      await client.connect(); // Connect to MongoDB
      const db = client.db(); // Use the default database
      const gamesCollection = db.collection('games'); // Target the games collection

      // Find the game in local data
      const game = games.find((g) => g.grade === grade && g.id.toString() === id);

      if (!game) {
        return res.status(404).json({ error: 'Game not found in local data' });
      }

      // First, try to find the game
      let dbGame = await gamesCollection.findOne({
        grade: grade,
        id: id.toString()
      });

      let result;
      if (!dbGame) {
        // If game doesn't exist, insert it with totalPlays = 1
        result = await gamesCollection.insertOne({
          ...game,
          id: id.toString(),
          grade: grade,
          totalPlays: 1
        });
        dbGame = {
          ...game,
          id: id.toString(),
          grade: grade,
          totalPlays: 1
        };
      } else {
        // If game exists, increment totalPlays
        result = await gamesCollection.findOneAndUpdate(
          { 
            grade: grade,
            id: id.toString()
          },
          { 
            $inc: { totalPlays: 1 }
          },
          { 
            returnDocument: 'after'
          }
        );
        dbGame = result.value;
      }

      return res.status(200).json({
        game: dbGame,
        totalPlays: dbGame.totalPlays
      });

    } catch (error) {
      console.error('Error incrementing play count:', error);
      return res.status(500).json({ error: 'Internal server error' });
    } finally {
      await client.close(); // Close the MongoDB connection
    }
  }

  if (req.method === 'GET') {
    try {
      await client.connect(); // Connect to MongoDB
      const db = client.db(); // Use the default database
      const gamesCollection = db.collection('games'); // Target the games collection

      // First try to find the game
      let dbGame = await gamesCollection.findOne({
        grade: grade,
        id: id.toString()
      });

      // If game doesn't exist, create it
      if (!dbGame) {
        const game = games.find((g) => g.grade === grade && g.id.toString() === id);
        if (!game) {
          return res.status(404).json({ error: 'Game not found' });
        }

        const newGame = {
          ...game,
          id: id.toString(),
          grade: grade,
          totalPlays: 0
        };

        await gamesCollection.insertOne(newGame);
        dbGame = newGame;
      }

      return res.status(200).json({
        game: dbGame,
        totalPlays: dbGame.totalPlays
      });
    } catch (error) {
      console.error('Error fetching game:', error);
      return res.status(500).json({ error: 'Internal server error' });
    } finally {
      await client.close(); // Close the MongoDB connection
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
