import { MongoClient } from "mongodb";

const connectToDatabase = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, // This option is no longer necessary, but added for older MongoDB versions
      useUnifiedTopology: true, // Ensures a stable connection with MongoDB
    });
    const db = client.db();
    return db;
  } catch (error) {
    console.error("MongoDB connection error: ", error);
    throw new Error("Could not connect to the database");
  }
};

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      // Attempt to connect to MongoDB
      const db = await connectToDatabase();

      // Access the users collection
      const usersCollection = db.collection("users");
      
      // Try to find the user by email
      const user = await usersCollection.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Check if the password matches (password hashing can be added here)
      if (user.password !== password) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      return res.status(200).json({ message: "Login successful" });

    } catch (error) {
      console.error("Error in login API: ", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
};
