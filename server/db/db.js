import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb://localhost:27017`)
        console.log(`\n MongoDB connected !! DB HOST:`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}
export default connectDB