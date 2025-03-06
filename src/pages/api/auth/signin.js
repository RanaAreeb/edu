import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, accountType } = req.body;

  if (!email || !password || !accountType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();
    const users = db.collection('users');

    // Find user by email
    const user = await users.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // In a real application, you should hash passwords and compare hashes
    // This is just for demonstration
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if account type matches
    if (user.accountType !== accountType) {
      return res.status(401).json({ message: 'Invalid account type for this user' });
    }

    // Return success with user info (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
      message: 'Successfully signed in',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({ message: 'An error occurred. Please try again.' });
  } finally {
    await client.close();
  }
} 