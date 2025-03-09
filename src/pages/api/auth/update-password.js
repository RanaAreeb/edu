import { getMongoDb } from '../../../utils/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const db = await getMongoDb();

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    const result = await db.collection('users').updateOne(
      { email: req.body.email }, // You'll need to pass the user's email from the frontend
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    return res.status(500).json({ message: 'Error updating password' });
  }
} 