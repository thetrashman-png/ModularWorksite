import express from "express";
import cors from "cors";
import morgan from "morgan";
import "./utils/env.js"; // 🔥 Load environment variables
import connectDB from "./utils/db.js"; // 🔥 Connect to MongoDB
import routes from "./routes/v1/index.js"; // 🔥 Load all API routes
import errorHandler from "./middleware/errorMiddleware.js"; // ✅ Import global error handler
import { apiLimiter, loginLimiter } from "./middleware/rateLimitMiddleware.js"; // 🔥 Import rate limiters

const app = express();
const PORT = process.env.PORT || 5000;

const getTimestamp = () => {
    const now = new Date();
    const options = { timeZone: "America/Los_Angeles", hour12: false };
    const date = now.toLocaleDateString("en-CA", { ...options }).replace(/\//g, "-").slice(2); // YY-MM-DD
    const time = now.toLocaleTimeString("en-US", { ...options, hour: "2-digit", minute: "2-digit" }).replace(":", ":");
    return `[${date} / ${time}]`;
};

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// 🔥 Apply Rate Limits
app.use(apiLimiter); // Limits all requests globally
app.use("/api/v1/users/login", loginLimiter); // Limits login attempts

// Connect to MongoDB
connectDB();

// Load API routes
app.use("/api/v1", routes);

// Test Route
app.get("/", (req, res) => {
    res.json({ success: true, message: "API is running..." });
});

// ✅ Only show logs in development mode
if (process.env.NODE_ENV !== "production") {
    console.log(`${getTimestamp()} ✅ Environment variables loaded.`);
    console.log(`${getTimestamp()} ✅ Server running on port ${PORT}`);
}

// 🔥 Centralized error handling (placed at the very end)
app.use(errorHandler);

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`${getTimestamp()} ✅ Server running on port ${PORT}`);
});

export default app;