import { getMongoDb } from '@/utils/mongodb';
import { games } from '@/data/games';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await getMongoDb();
    const { grade, id } = req.query;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get the game first
    let game = await db.collection('games').findOne({
      grade: grade,
      gameId: parseInt(id)
    });

    // If game not found in DB, initialize it from local data
    if (!game) {
      const localGame = games.find(g => g.grade === grade && g.id.toString() === id);
      
      if (!localGame) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // Initialize the game in MongoDB with gameId
      game = {
        ...localGame,
        gameId: parseInt(id),
        likes: 0,
        dislikes: 0,
        totalPlays: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('games').insertOne(game);
      game._id = result.insertedId;
    }

    // Get user's rating
    const ratingDoc = await db.collection('gameRatings').findOne({
      gameId: game._id,
      userId: userId
    });

    // Log for debugging
    console.log('Fetching rating:', {
      gameId: game.gameId,
      userId,
      rating: ratingDoc?.rating || null
    });

    return res.status(200).json({
      rating: ratingDoc ? ratingDoc.rating : null
    });
  } catch (error) {
    console.error('Error fetching user rating:', error);
    return res.status(500).json({ error: 'Failed to fetch user rating' });
  }
} 