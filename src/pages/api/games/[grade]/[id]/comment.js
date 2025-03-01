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
      const { comment, userId } = req.body;
      const db = await connectToDatabase();
      const commentsCollection = db.collection('comments');

      await commentsCollection.insertOne({
        gameId: id,
        grade: grade,
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

  if (req.method === 'GET') {
    try {
      const db = await connectToDatabase();
      const commentsCollection = db.collection('comments');

      const comments = await commentsCollection
        .find({ gameId: id, grade: grade })
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json({ comments });
    } catch (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
