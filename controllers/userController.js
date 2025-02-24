const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// 📌 Register User (Now Hashing Passwords!)
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "This email is already in use." });
        }

        // Ensure password meets security criteria
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        // Create and save user (no need to manually hash the password)
        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully. You can now log in." });
    } catch (error) {
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// 📌 Login User (Now Verifying Hashed Passwords!)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "No account found with this email." });
        }

        // Compare entered password with hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password. Please try again." });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({ message: "Login successful!", token });
    } catch (error) {
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

module.exports = { registerUser, loginUser };
