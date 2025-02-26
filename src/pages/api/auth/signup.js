import { MongoClient } from 'mongodb';

const connectToDatabase = async () => {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();
  return db;
};

// API handler for POST requests to sign up a user
export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase();
      const usersCollection = db.collection('users');
      const { email, password, accountType } = req.body;

      // Check if the user already exists
      const existingUser = await usersCollection.findOne({ email });

      if (existingUser) {
        return res.status(409).json({ message: 'User already exists!' });
      }

      // Create new user with accountType
      await usersCollection.insertOne({ email, password, accountType });
      return res.status(201).json({ message: 'User created!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
