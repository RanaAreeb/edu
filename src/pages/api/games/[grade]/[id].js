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

    // First try to get the game from MongoDB
    let game = await db.collection('games').findOne({
      grade: grade,
      id: parseInt(id)
    });

    // If game not found in DB, check local data and initialize in DB
    if (!game) {
      const localGame = games.find(g => g.grade === grade && g.id.toString() === id);
      
      if (!localGame) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // Initialize the game in MongoDB with default values
      game = {
        ...localGame,
        likes: 0,
        dislikes: 0,
        totalPlays: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Insert the game into MongoDB
      const result = await db.collection('games').insertOne(game);
      game._id = result.insertedId;
    }

    // If userId is provided, get user's rating
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

    // Get total plays
    const totalPlays = await db.collection('gamePlays').countDocuments({
      gameId: game._id
    }) || 0;

    // Ensure likes and dislikes are numbers
    game.likes = game.likes || 0;
    game.dislikes = game.dislikes || 0;

    // Log the response for debugging
    console.log('Sending game data:', {
      game: {
        ...game,
        _id: game._id.toString()
      },
      totalPlays,
      userRating
    });

    return res.status(200).json({
      game: {
        ...game,
        _id: game._id.toString() // Convert ObjectId to string
      },
      totalPlays,
      userRating
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    return res.status(500).json({ error: 'Failed to fetch game data' });
  }
}
