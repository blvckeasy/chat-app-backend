import mongoose from "mongoose";
import { MONGODB_CONFIG } from '../constants/index.js'


export async function connectDatabase () {
    const connection = await mongoose.connect(MONGODB_CONFIG.uri);
    return connection;
}