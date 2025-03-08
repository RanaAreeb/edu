import { getMongoDb } from '../../../../../utils/mongodb';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { grade, id } = req.query;
  const { action } = req.body; // 'like' or 'dislike'

  if (!action || (action !== 'like' && action !== 'dislike')) {
    return res.status(400).json({ error: 'Invalid action. Must be "like" or "dislike"' });
  }

  try {
    const db = await getMongoDb();
    const gamesCollection = db.collection('games');

    // Find the game first
    const game = await gamesCollection.findOne({
      grade,
      id: id.toString()
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Initialize likes and dislikes if they don't exist
    const updateQuery = {
      $set: {}
    };

    if (typeof game.likes !== 'number') {
      updateQuery.$set.likes = 0;
    }
    if (typeof game.dislikes !== 'number') {
      updateQuery.$set.dislikes = 0;
    }

    // If we need to initialize the counts, do it first
    if (Object.keys(updateQuery.$set).length > 0) {
      await gamesCollection.updateOne(
        { grade, id: id.toString() },
        updateQuery
      );
    }

    // Now handle the like/dislike action
    let updateOperation;
    if (action === 'like') {
      updateOperation = {
        $inc: { likes: 1 }
      };
    } else {
      updateOperation = {
        $inc: { dislikes: 1 }
      };
    }

    const result = await gamesCollection.findOneAndUpdate(
      { grade, id: id.toString() },
      updateOperation,
      { returnDocument: 'after' }
    );

    return res.status(200).json({
      likes: result.value.likes || 0,
      dislikes: result.value.dislikes || 0
    });

  } catch (error) {
    console.error('Error updating rating:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
