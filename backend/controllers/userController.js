import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { formatResponse } from "../utils/helpers.js"; // 🔥 Standardized API responses

// @desc    Register a new user
// @route   POST /api/v1/users/register
// @access  Public
export const registerUser = async (req, res, next) => {
    const {
        name,
        email,
        password,
        phoneNumber,
        profileType,
        industry
    } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            return res.status(400).json(formatResponse(false, "User already exists", null, 400));
        }

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password,
            phoneNumber,
            profileType,
            industry
        });

        res.status(201).json(formatResponse(true, "User registered successfully", { id: newUser._id }, 201));
    } catch (error) {
        next(error);
    }
};

// @desc    Authenticate user & return JWT
// @route   POST /api/v1/users/login
// @access  Public
export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        console.log("🔍 Checking email:", email);

        // Find user
        const user = await User.findOne({ email }).select("+password").lean();
        if (!user) {
            return res.status(400).json(formatResponse(false, "Invalid email or password", null, 400));
        }

        console.log("✅ User found:", user);

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json(formatResponse(false, "Invalid email or password", null, 400));
        }

        console.log("🔑 Generating tokens...");

        // Ensure JWT_SECRET is set
        if (!process.env.JWT_SECRET) {
            console.error("❌ JWT_SECRET is missing from .env");
            throw new Error("JWT Secret not configured");
        }

        // Generate Access Token (Short-Lived)
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Generate Refresh Token (Long-Lived)
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Store the Refresh Token in MongoDB
        await User.findByIdAndUpdate(user._id, { refreshToken });

        console.log("✅ Login successful");

        res.status(200).json(formatResponse(true, "Login successful", { accessToken, refreshToken }, 200));
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user profile (Protected)
// @route   GET /api/v1/users/me
// @access  Private
export const getUserProfile = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error("User not authenticated"); // 🔥 Throw an error if user is missing
        }

        // Fetch user data but exclude password & version
        const user = await User.findById(req.user.id)
            .select("-password -__v") // 🔥 Exclude unnecessary fields
            .lean();

        res.status(200).json(formatResponse(true, "User profile data", { user }, 200));
    } catch (error) {
        next(error); // ✅ Send error to centralized error handler
    }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/me
// @access  Private
export const updateUserProfile = async (req, res, next) => {
    try {
        // Use findByIdAndUpdate to avoid extra DB calls
        const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validation is enforced
        })
            .select("-password -__v") // 🔥 Exclude password & version field
            .lean();

        if (!updatedUser) {
            throw new Error("User not found"); // 🔥 Throw an error if user is missing
        }

        res.status(200).json(formatResponse(true, "Profile updated successfully", {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profileType: updatedUser.profileType,
            industry: updatedUser.industry,
            bio: updatedUser.bio,
            companyName: updatedUser.companyName,
            website: updatedUser.website,
            businessEmail: updatedUser.businessEmail,
            businessPhone: updatedUser.businessPhone,
            serviceArea: updatedUser.serviceArea,
            location: updatedUser.location,
            socialMediaLinks: updatedUser.socialMediaLinks,
        }, 200));
    } catch (error) {
        next(error); // ✅ Send error to centralized error handler
    }
};

export const refreshToken = async (req, res, next) => {
    const { token } = req.body;

    try {
        if (!token) {
            return res.status(400).json(formatResponse(false, "Refresh Token is required", null, 400));
        }

        // Find user with the provided Refresh Token
        const user = await User.findOne({ refreshToken: token });
        if (!user) {
            return res.status(403).json(formatResponse(false, "Invalid Refresh Token", null, 403));
        }

        // Check if token is blacklisted
        if (user.revokedTokens.includes(token)) {
            return res.status(403).json(formatResponse(false, "This Refresh Token has been revoked", null, 403));
        }

        // Verify the Refresh Token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json(formatResponse(false, "Invalid or Expired Refresh Token", null, 403));
            }

            // Generate new Access Token
            const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.status(200).json(formatResponse(true, "Access Token refreshed successfully", { accessToken: newAccessToken }, 200));
        });
    } catch (error) {
        next(error);
    }
};


export const logoutUser = async (req, res, next) => {
    const { token } = req.body;

    try {
        if (!token) {
            return res.status(400).json(formatResponse(false, "Refresh Token is required", null, 400));
        }

        // Find user with the provided Refresh Token
        const user = await User.findOne({ refreshToken: token });
        if (!user) {
            return res.status(403).json(formatResponse(false, "Invalid Refresh Token", null, 403));
        }

        // Add token to blacklist
        user.revokedTokens.push(token);
        user.refreshToken = null; // Remove active refresh token
        await user.save();

        res.status(200).json(formatResponse(true, "User logged out successfully", null, 200));
    } catch (error) {
        next(error);
    }
};