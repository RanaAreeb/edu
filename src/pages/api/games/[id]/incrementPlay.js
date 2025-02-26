import { connectToDatabase } from "../../../../utils/mongodb";

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const { id } = req.query;
      const db = await connectToDatabase();
      const gamesCollection = db.collection("games");

      // Increment total plays
      const game = await gamesCollection.findOneAndUpdate(
        { _id: id },
        { $inc: { totalPlays: 1 } },
        { returnDocument: "after" }
      );

      return res.status(200).json({ totalPlays: game.value.totalPlays });
    } catch (error) {
      res.status(500).json({ error: "Unable to increment plays" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
