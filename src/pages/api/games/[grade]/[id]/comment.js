// pages/api/games/[id]/comment.js
import { MongoClient } from 'mongodb';

const connectToDatabase = async () => {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();
  return db;
};

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { comment, userId } = req.body;
      const { id } = req.query;
      const db = await connectToDatabase();
      const commentsCollection = db.collection('comments');

      await commentsCollection.insertOne({
        gameId: id,
        comment,
        userId,
        createdAt: new Date(),
      });

      return res.status(200).json({ message: 'Comment added!' });
    } catch (error) {
      console.error("Error saving comment:", error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
