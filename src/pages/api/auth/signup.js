import { getMongoDb } from '../../../utils/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password, accountType } = req.body;

  if (!name || !email || !password || !accountType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (accountType !== 'parent' && accountType !== 'institution') {
    return res.status(400).json({ message: 'Invalid account type' });
  }

  try {
    const db = await getMongoDb();
    const usersCollection = db.collection('users');

    // Check if email already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const user = {
      name,
      email,
      password: hashedPassword,
      accountType,
      createdAt: new Date(),
      lastLogin: null
    };

    // Insert the user into the database
    await usersCollection.insertOne(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      message: 'Account created successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error creating account:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
