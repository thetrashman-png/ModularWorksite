require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import CORS

const userRoutes = require("./routes/userRoutes"); // Import user routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Allows JSON data in requests
app.use(cors()); // Enables CORS for frontend communication

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// API Routes
app.use("/api/users", userRoutes); // User Authentication Routes

// Root Route
app.get("/", (req, res) => {
    res.send("Business Platform API is running...");
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});