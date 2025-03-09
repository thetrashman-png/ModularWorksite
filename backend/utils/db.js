import mongoose from "mongoose";

// Function to get Pacific Time (PT) timestamp in format [YY-MM-DD / HH:MM]
const getTimestamp = () => {
    const now = new Date();
    const options = { timeZone: "America/Los_Angeles", hour12: false };
    const date = now.toLocaleDateString("en-CA", { ...options }).replace(/\//g, "-").slice(2); // YY-MM-DD
    const time = now.toLocaleTimeString("en-US", { ...options, hour: "2-digit", minute: "2-digit" }).replace(":", ":");
    return `[${date} // ${time}]`;
};

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        if (process.env.NODE_ENV !== "production") {
            console.log(`${getTimestamp()} ✅ MongoDB Connected: ${conn.connection.host}`);
        }
    } catch (error) {
        console.error(`${getTimestamp()} ❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;