import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGODB_URI } = process.env
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI as string);
        console.log(`MongoDB Connected : ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB;
