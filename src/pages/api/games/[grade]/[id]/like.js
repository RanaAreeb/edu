import { MongoClient } from 'mongodb';

const connectToDatabase = async () => {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();
  return db;
};

export default async function handler(req, res) {
  const { grade, id } = req.query;

  if (req.method === 'POST') {
    const { rating } = req.body; // Get the rating from the request body

    try {
      const db = await connectToDatabase();
      const gamesCollection = db.collection('games');

      // Update the game's rating (assumes 'rating' is a simple string or object field)
      const updateResponse = await gamesCollection.updateOne(
        { grade, id },
        { $push: { ratings: rating } } // Adds the rating to the 'ratings' array field
      );

      if (updateResponse.modifiedCount === 1) {
        return res.status(200).json({ message: 'Rating updated successfully' });
      } else {
        return res.status(400).json({ message: 'Failed to update rating' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
