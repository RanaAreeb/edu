import { MongoClient } from "mongodb";
import { games } from "../../../../data/games";

const MONGODB_URI = process.env.MONGODB_URI;

export default async (req, res) => {
  const { grade, id } = req.query;
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();
    const gamesCollection = db.collection('games');

    // Find the game in MongoDB
    const dbGame = await gamesCollection.findOne({ 
      grade: grade,
      id: id.toString()
    });

    if (!dbGame) {
      // If not in database, get from local data and initialize in DB
      const localGame = games.find((g) => g.grade === grade && g.id.toString() === id);
      
      if (!localGame) {
        return res.status(404).json({ error: "Game not found" });
      }

      // Initialize the game in the database
      const newGame = {
        ...localGame,
        id: id.toString(),
        grade: grade,
        totalPlays: 0
      };

      await gamesCollection.insertOne(newGame);
      
      return res.status(200).json({
        game: newGame,
        totalPlays: 0
      });
    }

    // Return both game data and total plays from database
    return res.status(200).json({
      game: dbGame,
      totalPlays: dbGame.totalPlays || 0
    });

  } catch (error) {
    console.error('Error fetching game:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
};
