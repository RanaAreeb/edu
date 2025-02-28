import { MongoClient } from 'mongodb';

const connectToDatabase = async () => {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();
  return db;
};

export default async function handler(req, res) {
  const { grade, id } = req.query;

  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase();
      const gamesCollection = db.collection('games');

      // Increment the 'totalPlays' field for the game
      const updateResponse = await gamesCollection.updateOne(
        { grade, id },
        { $inc: { totalPlays: 1 } } // Increment total plays
      );

      if (updateResponse.modifiedCount === 1) {
        // Retrieve the updated game data
        const updatedGame = await gamesCollection.findOne({ grade, id });
        return res.status(200).json({ totalPlays: updatedGame.totalPlays });
      } else {
        return res.status(400).json({ message: 'Failed to update play count' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
