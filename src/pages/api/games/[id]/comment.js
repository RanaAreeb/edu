import { connectToDatabase } from "../../../../utils/mongodb";
export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const { id } = req.query;
      const { comment } = req.body;
      const db = await connectToDatabase();
      const gamesCollection = db.collection("games");

      // Store the comment
      await gamesCollection.updateOne(
        { _id: id },
        { $push: { comments: comment } }
      );

      return res.status(200).json({ message: "Comment added!" });
    } catch (error) {
      res.status(500).json({ error: "Unable to add comment" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
