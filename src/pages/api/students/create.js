import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password, age, grade, parentId } = req.body;

  if (!name || !email || !password || !age || !grade || !parentId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();
    const studentsCollection = db.collection('students');

    // Check if email already exists
    const existingStudent = await studentsCollection.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student document
    const student = {
      name,
      email,
      password: hashedPassword,
      age: parseInt(age),
      grade,
      parentId,
      accountType: 'student',
      createdAt: new Date(),
      lastLogin: null,
      gameStats: {
        gamesPlayed: 0,
        totalPlayTime: 0,
        achievements: [],
        skillsDistribution: {
          math: 0,
          logic: 0,
          memory: 0,
          problemSolving: 0,
          speed: 0,
          accuracy: 0
        },
        gameTimeDistribution: {},
        weeklyProgress: [0, 0, 0, 0]
      }
    };

    // Insert the student into the database
    const result = await studentsCollection.insertOne(student);
    student._id = result.insertedId;

    // Remove password from response
    const { password: _, ...studentWithoutPassword } = student;

    return res.status(201).json({
      message: 'Student created successfully',
      student: studentWithoutPassword
    });

  } catch (error) {
    console.error('Error creating student:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
} 