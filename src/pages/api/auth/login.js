import { MongoClient } from "mongodb";
import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const connectToDatabase = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, // This option is no longer necessary, but added for older MongoDB versions
      useUnifiedTopology: true, // Ensures a stable connection with MongoDB
    });
    const db = client.db();
    return { db, client };
  } catch (error) {
    console.error("MongoDB connection error: ", error);
    throw new Error("Could not connect to the database");
  }
};

export default async (req, res) => {
  if (req.method === "POST") {
    let client;
    try {
      const { email, password } = req.body;

      // Attempt to connect to MongoDB
      const { db, client: mongoClient } = await connectToDatabase();
      client = mongoClient;

      // Access the users collection
      const usersCollection = db.collection("users");
      
      // Try to find the user by email
      const user = await usersCollection.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Check if the password matches (you should use proper password hashing in production)
      if (user.password !== password) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Generate JWT token
      const token = sign(
        { 
          userId: user._id.toString(),
          email: user.email,
          accountType: user.accountType 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({ 
        message: "Login successful",
        token,
        accountType: user.accountType
      });

    } catch (error) {
      console.error("Error in login API: ", error);
      return res.status(500).json({ error: "Internal server error" });
    } finally {
      if (client) {
        await client.close();
      }
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
};
