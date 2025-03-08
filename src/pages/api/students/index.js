import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();
    const studentsCollection = db.collection('students');

    // Fetch all students, excluding password field
    const students = await studentsCollection
      .find({})
      .project({ password: 0 })
      .toArray();

    return res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
} 