import { getMongoDb } from '../../../utils/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { studentId, gameId, gameTitle, gameType, startTime, endTime, score, skillsGained } = req.body;

  if (!studentId || !gameId || !gameTitle || !startTime || !endTime) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const db = await getMongoDb();
    const studentsCollection = db.collection('students');

    // Calculate play time in minutes
    const playTime = Math.round((new Date(endTime) - new Date(startTime)) / (1000 * 60));

    // Create game session record
    const gameSession = {
      gameId,
      gameTitle,
      gameType,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      playTime,
      score,
      skillsGained
    };

    // Update student's game stats
    const updateResult = await studentsCollection.updateOne(
      { _id: new ObjectId(studentId) },
      {
        $push: {
          'gameStats.sessions': gameSession
        },
        $inc: {
          'gameStats.totalPlayTime': playTime,
          'gameStats.gamesPlayed': 1,
          [`gameStats.skillsDistribution.${gameType}`]: playTime,
          [`gameStats.gameTimeDistribution.${gameTitle}`]: playTime
        },
        $set: {
          'gameStats.lastPlayed': new Date()
        }
      }
    );

    // Update weekly progress
    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    await studentsCollection.updateOne(
      { _id: new ObjectId(studentId) },
      {
        $inc: {
          [`gameStats.weeklyProgress.${Math.floor((new Date() - weekStart) / (7 * 24 * 60 * 60 * 1000))}`]: score || 0
        }
      }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.status(200).json({
      message: 'Game session tracked successfully',
      session: gameSession
    });

  } catch (error) {
    console.error('Error tracking game session:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 