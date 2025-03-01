import { MongoClient } from 'mongodb';

const connectToDatabase = async () => {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();
  return db;
};

// Get userId based on email (similar to the logic used in your comment API)
const getUserId = async (email) => {
  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return null;
    }

    return user._id.toString(); // Return userId
  } catch (error) {
    console.error('Error fetching userId:', error);
    return null;
  }
};

export default async (req, res) => {
  const { grade, id } = req.query; // Get grade and id from the URL params

  if (req.method === 'POST') {
    try {
      const { rating, email } = req.body; // Expect rating and email in the request body

      // Get userId based on email
      const userId = await getUserId(email);

      if (!userId) {
        return res.status(400).json({ error: 'User not found' });
      }

      const db = await connectToDatabase();
      const gamesCollection = db.collection('games');
      const userActionsCollection = db.collection('user_actions');

      // Check if the user has already liked/disliked the game
      const existingAction = await userActionsCollection.findOne({ userId, gameId: id });

      if (existingAction) {
        // If the user has already liked/disliked, update the action
        if (existingAction.action === rating) {
          return res.status(400).json({ error: `You already ${rating}d this game.` });
        }

        // Update the action in user_actions collection
        await userActionsCollection.updateOne(
          { userId, gameId: id },
          { $set: { action: rating } }
        );

        // Adjust the like/dislike count in the games collection
        if (rating === '👍') {
          await gamesCollection.updateOne(
            { gameId: id },
            { $inc: { likes: 1, dislikes: -1 } }
          );
        } else if (rating === '👎') {
          await gamesCollection.updateOne(
            { gameId: id },
            { $inc: { dislikes: 1, likes: -1 } }
          );
        }
      } else {
        // If the user hasn't liked/disliked yet, add their action
        await userActionsCollection.insertOne({
          userId,
          gameId: id,
          action: rating,
        });

        // Update the like/dislike count
        if (rating === '👍') {
          await gamesCollection.updateOne(
            { gameId: id },
            { $inc: { likes: 1 } }
          );
        } else if (rating === '👎') {
          await gamesCollection.updateOne(
            { gameId: id },
            { $inc: { dislikes: 1 } }
          );
        }
      }

      // Fetch the updated game data from the database
      const updatedGame = await gamesCollection.findOne({ gameId: id });

      return res.status(200).json({
        message: 'Rating updated',
        likes: updatedGame.likes,
        dislikes: updatedGame.dislikes,
      });
    } catch (error) {
      console.error('Error updating rating:', error);
      return res.status(500).json({ error: 'Failed to update rating' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};
