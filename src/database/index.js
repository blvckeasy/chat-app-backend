import mongoose from "mongoose";

export async function connectDatabase () {
    const connection = await mongoose.connect("mongodb://127.0.0.1:27017/chat-app");
    return connection;
}