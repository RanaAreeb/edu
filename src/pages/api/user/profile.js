// pages/api/user/profile.js
import { connectToDatabase } from "../../../utils/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email;

      const db = await connectToDatabase();
      const usersCollection = db.collection("users");

      // Fetch the user profile from the database
      const user = await usersCollection.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user profile" });
    }
  } else if (method === "PUT") {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email;

      const db = await connectToDatabase();
      const usersCollection = db.collection("users");

      // Update the user profile based on the provided data
      const updatedData = req.body;

      const result = await usersCollection.updateOne(
        { email },
        { $set: updatedData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating user profile" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
