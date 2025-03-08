import { getMongoDb } from '@/utils/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await getMongoDb();
    const { studentId, gameId, gameTitle, gameType, startTime, endTime, score, skillsGained } = req.body;

    // Validate required fields
    if (!studentId || !gameId || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate duration in minutes
    const duration = Math.round((new Date(endTime) - new Date(startTime)) / (1000 * 60));

    // Create game session record
    const session = {
      studentId,
      gameId: parseInt(gameId),
      gameTitle,
      gameType: gameType || 'educational',
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      duration,
      score: score || 0,
      skillsGained: skillsGained || ['problem-solving'],
      createdAt: new Date()
    };

    // Insert session into database
    const result = await db.collection('gameSessions').insertOne(session);

    // Log for debugging
    console.log('Game session tracked:', {
      sessionId: result.insertedId,
      studentId,
      gameId,
      duration
    });

    return res.status(200).json({
      success: true,
      session: {
        ...session,
        _id: result.insertedId
      }
    });

  } catch (error) {
    console.error('Error tracking game session:', error);
    return res.status(500).json({ error: 'Failed to track game session' });
  }
} 