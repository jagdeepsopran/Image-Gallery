import mongoose from "mongoose";

// Connect to MongoDB
export async function dbConnect(){
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");
    }catch(error){
        console.log(error);
    }
}