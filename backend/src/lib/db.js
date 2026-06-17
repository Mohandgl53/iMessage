import mongoose from "mongoose";

mongoose.connection.on("connected", () => console.log("MongoDB connected"));
mongoose.connection.on("error", (err) => console.error("MongoDB error:", err.message));
mongoose.connection.on("disconnected", () => console.log("MongoDB disconnected"));

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI is required");
    return;
  }
  try {
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
}