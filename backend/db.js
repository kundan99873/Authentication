import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connect = () => {
    try {
        // console.log("mongo url ", process.env.MONGO_URL)
        mongoose.connect(process.env.MONGO_URL).then(() => {
            console.log("Connected to mongo successfully...");
        })
    } catch (error) {
        throw new Error(error);
    }
}

export default connect;