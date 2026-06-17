import mongoose from "mongoose";

export async function connectDB(){
    try{
        const mongoUri = process.env.MONGO_URI;
        
        if (!mongoUri){
            throw new Error("MONGO_URI is Required");
        }

        await mongoose.connect(mongoUri);

        console.log("MongoDB is Connected");
    }catch(error){
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
}