import { getMongoDb } from '@/utils/mongodb';
import { games } from '@/data/games';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await getMongoDb();
    const { grade, id } = req.query;

    // Get or initialize the game document
    let game = await db.collection('games').findOne({
      grade: grade,
      gameId: parseInt(id)
    });

    if (!game) {
      const localGame = games.find(g => g.grade === grade && g.id.toString() === id);
      
      if (!localGame) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // Get existing total plays before initializing
      const totalPlays = await db.collection('gamePlays').countDocuments({
        grade: grade,
        gameId: parseInt(id)
      });

      // Initialize the game with existing play count
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

    // Add new play record
    await db.collection('gamePlays').insertOne({
      gameId: parseInt(id),
      grade: grade,
      timestamp: new Date()
    });

    // Get updated total plays
    const totalPlays = await db.collection('gamePlays').countDocuments({
      grade: grade,
      gameId: parseInt(id)
    });

    // Update game document with new play count
    await db.collection('games').updateOne(
      { _id: game._id },
      { 
        $set: { 
          totalPlays: totalPlays,
          updatedAt: new Date()
        } 
      }
    );

    // Get the updated game document
    game = await db.collection('games').findOne({ _id: game._id });

    // Log for debugging
    console.log('Incremented play count:', {
      gameId: parseInt(id),
      grade,
      totalPlays,
      game
    });

    return res.status(200).json({
      game,
      totalPlays
    });
  } catch (error) {
    console.error('Error incrementing play count:', error);
    return res.status(500).json({ error: 'Failed to increment play count' });
  }
}
