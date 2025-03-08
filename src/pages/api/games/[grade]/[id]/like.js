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
      id: parseInt(id)
    });

    // If game not found in DB, initialize it from local data
    if (!game) {
      const localGame = games.find(g => g.grade === grade && g.id.toString() === id);
      
      if (!localGame) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // Initialize the game in MongoDB
      game = {
        ...localGame,
        likes: 0,
        dislikes: 0,
        totalPlays: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('games').insertOne(game);
      game._id = result.insertedId;
    }

    // Initialize ratings collection if it doesn't exist
    const userRating = await db.collection('gameRatings').findOne({
      gameId: game._id,
      userId: userId
    });

    let likes = game.likes || 0;
    let dislikes = game.dislikes || 0;

    if (action === 'remove') {
      // Remove the previous rating
      if (previousRating === 'like') {
        likes = Math.max(0, likes - 1);
      } else if (previousRating === 'dislike') {
        dislikes = Math.max(0, dislikes - 1);
      }

      // Remove the user's rating from the ratings collection
      await db.collection('gameRatings').deleteOne({
        gameId: game._id,
        userId: userId
      });
    } else {
      // Handle new or changed rating
      if (userRating) {
        // User has rated before - update their rating
        if (userRating.rating !== action) {
          // User is changing their rating
          if (userRating.rating === 'like') {
            likes = Math.max(0, likes - 1);
          } else if (userRating.rating === 'dislike') {
            dislikes = Math.max(0, dislikes - 1);
          }

          if (action === 'like') {
            likes++;
          } else {
            dislikes++;
          }

          await db.collection('gameRatings').updateOne(
            { gameId: game._id, userId: userId },
            { $set: { rating: action, updatedAt: new Date() } }
          );
        }
      } else {
        // New rating
        if (action === 'like') {
          likes++;
        } else {
          dislikes++;
        }

        // Add new rating to ratings collection
        await db.collection('gameRatings').insertOne({
          gameId: game._id,
          userId: userId,
          rating: action,
          createdAt: new Date()
        });
      }
    }

    // Update game document with new counts
    await db.collection('games').updateOne(
      { _id: game._id },
      { 
        $set: { 
          likes, 
          dislikes,
          updatedAt: new Date()
        } 
      }
    );

    // Log the update for debugging
    console.log('Updated game ratings:', { likes, dislikes, userId, action });

    return res.status(200).json({ likes, dislikes });
  } catch (error) {
    console.error('Error updating rating:', error);
    return res.status(500).json({ error: 'Failed to update rating' });
  }
}
