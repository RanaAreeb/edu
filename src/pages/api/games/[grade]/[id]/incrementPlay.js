import { MongoClient } from 'mongodb';

const connectToDatabase = async () => {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();
  return db;
};

export default async (req, res) => {
  const { grade, id } = req.query; // Get grade and id from the URL params

  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase();
      const gamesCollection = db.collection('games');

      // Find the game and increment the play count
      const game = await gamesCollection.findOne({ id: id, grade });

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // Increment the play count
      await gamesCollection.updateOne(
        { id: id, grade },
        { $inc: { totalPlays: 1 } }
      );

      // Return the updated play count
      const updatedGame = await gamesCollection.findOne({ id: id, grade });

      return res.status(200).json({ totalPlays: updatedGame.totalPlays });
    } catch (error) {
      console.error('Error incrementing play count:', error);
      return res.status(500).json({ error: 'Failed to increment play count' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};
