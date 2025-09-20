import mongoose from "mongoose";

export const ConnectDB=async()=>{
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    });
}