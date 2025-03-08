import { getMongoDb } from '../../../utils/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, accountType } = req.body;

  if (!email || !password || !accountType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const db = await getMongoDb();
    
    // Determine which collection to use based on account type
    const collection = accountType === 'student' 
      ? db.collection('students')
      : db.collection('users');

    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login time
    await collection.updateOne(
      { email },
      { $set: { lastLogin: new Date() } }
    );

    // Remove sensitive data before sending response
    const { password: _, ...userWithoutPassword } = user;

    // Determine redirect path based on account type
    const redirectTo = accountType === 'student' ? '/' : '/dashboard';

    return res.status(200).json({
      message: 'Sign in successful',
      user: userWithoutPassword,
      redirectTo
    });

  } catch (error) {
    console.error('Sign in error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 