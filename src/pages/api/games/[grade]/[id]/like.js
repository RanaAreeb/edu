import { getMongoDb } from '@/utils/mongodb';
import { ObjectId } from 'mongodb';
import { games } from '@/data/games';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await getMongoDb();
    const { grade, id } = req.query;
    const { action, userId, previousRating } = req.body;

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

    // First, remove any existing rating for this user and game
    const existingRating = await db.collection('gameRatings').findOne({
      gameId: game._id,
      userId: userId
    });

    // Update the counts based on existing rating
    if (existingRating) {
      if (existingRating.rating === 'like') {
        game.likes = Math.max(0, game.likes - 1);
      } else if (existingRating.rating === 'dislike') {
        game.dislikes = Math.max(0, game.dislikes - 1);
      }
      
      // Remove the existing rating
      await db.collection('gameRatings').deleteOne({
        gameId: game._id,
        userId: userId
      });
    }

    // If not removing, add the new rating
    if (action !== 'remove') {
      // Add new rating
      await db.collection('gameRatings').insertOne({
        gameId: game._id,
        userId: userId,
        rating: action,
        createdAt: new Date()
      });

      // Update counts
      if (action === 'like') {
        game.likes++;
      } else if (action === 'dislike') {
        game.dislikes++;
      }
    }

    // Update game document with new counts
    await db.collection('games').updateOne(
      { _id: game._id },
      { 
        $set: { 
          likes: game.likes, 
          dislikes: game.dislikes,
          updatedAt: new Date()
        } 
      }
    );

    // Get the user's current rating after all updates
    const userRating = await db.collection('gameRatings').findOne({
      gameId: game._id,
      userId: userId
    });

    // Log the update for debugging
    console.log('Updated game ratings:', { 
      gameId: game.gameId, 
      likes: game.likes, 
      dislikes: game.dislikes, 
      userId, 
      action,
      existingRating: existingRating?.rating,
      newRating: userRating?.rating || null
    });

    return res.status(200).json({ 
      likes: game.likes, 
      dislikes: game.dislikes,
      userRating: userRating?.rating || null
    });
  } catch (error) {
    console.error('Error updating rating:', error);
    return res.status(500).json({ error: 'Failed to update rating' });
  }
}
