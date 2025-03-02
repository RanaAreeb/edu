import fs from 'fs';
import path from 'path';

// Path to the games.json file
const dataPath = path.resolve('src', 'data', 'games.json');

export default async function handler(req, res) {
  const { method } = req;
  const { grade, id } = req.query; // Dynamic route params

  if (method === 'POST') {
    try {
      // Step 1: Check if the file exists
      if (!fs.existsSync(dataPath)) {
        return res.status(500).json({ message: 'Game data file not found' });
      }

      // Step 2: Read the local data file to get the game data
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

      // Find the game with the specific id and grade
      const game = data.find((g) => g.id === id && g.grade === grade);
      if (!game) {
        return res.status(404).json({ message: 'Game not found' });
      }

      // Step 3: Increment the play count
      game.totalPlays += 1;

      // Step 4: Save the updated data back to the games.json file
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

      // Step 5: Respond with the updated total plays
      return res.status(200).json({ totalPlays: game.totalPlays });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
