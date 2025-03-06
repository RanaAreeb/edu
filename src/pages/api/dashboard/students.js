import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

export default async function handler(req, res) {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();
    const studentsCollection = db.collection('students');

    switch (req.method) {
      case 'GET':
        // Get students for a specific parent/institution
        const { userId, accountType } = req.query;
        const students = await studentsCollection
          .find({ parentId: userId })
          .toArray();
        res.status(200).json(students);
        break;

      case 'POST':
        // Add a new student
        const newStudent = {
          ...req.body,
          createdAt: new Date(),
          gameStats: {
            totalPlayTime: 0,
            gamesPlayed: [],
            achievements: [],
            skillLevels: {
              math: 0,
              logic: 0,
              memory: 0,
              problemSolving: 0,
              speed: 0,
              accuracy: 0
            }
          }
        };
        const result = await studentsCollection.insertOne(newStudent);
        res.status(201).json(result);
        break;

      case 'PUT':
        // Update student stats
        const { studentId, stats } = req.body;
        const updateResult = await studentsCollection.updateOne(
          { _id: studentId },
          { $set: { gameStats: stats } }
        );
        res.status(200).json(updateResult);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
} 