// pages/api/games/[id]/rate.js
import { connectToDatabase } from "../../../../utils/mongodb";

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const { id } = req.query;  // Get the game ID from the URL
      const { rating } = req.body;  // Get the rating from the request body

      // Handle rating logic here

      return res.status(200).json({ message: "Rating submitted!" });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
