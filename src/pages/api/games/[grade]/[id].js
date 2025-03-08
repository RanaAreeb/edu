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

    // Get the game document
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

      // Get total plays from gamePlays collection before initializing
      const totalPlays = await db.collection('gamePlays').countDocuments({
        grade: grade,
        gameId: parseInt(id)
      });

      // Initialize the game in MongoDB with gameId and existing total plays
      game = {
        ...localGame,
        gameId: parseInt(id),
        likes: 0,
        dislikes: 0,
        totalPlays: totalPlays || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('games').insertOne(game);
      game._id = result.insertedId;
    }

    // Always get the latest total plays count
    const totalPlays = await db.collection('gamePlays').countDocuments({
      grade: grade,
      gameId: parseInt(id)
    });

    // Update the game document with current total plays
    await db.collection('games').updateOne(
      { _id: game._id },
      { $set: { 
          totalPlays: totalPlays || 0,
          updatedAt: new Date()
        } 
      }
    );

    // Get the updated game document
    game = await db.collection('games').findOne({ _id: game._id });

    // Get user's rating if userId provided
    let userRating = null;
    if (userId) {
      const ratingDoc = await db.collection('gameRatings').findOne({
        gameId: game._id,
        userId: userId
      });
      if (ratingDoc) {
        userRating = ratingDoc.rating;
      }
    }

    // Log for debugging
    console.log('Fetching game data:', {
      gameId: game.gameId,
      totalPlays: game.totalPlays,
      userId,
      userRating
    });

    return res.status(200).json({
      game,
      userRating
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    return res.status(500).json({ error: 'Failed to fetch game data' });
  }
}
