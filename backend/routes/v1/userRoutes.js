import express from "express";
import {
    registerUser,
    loginUser,
    refreshToken,
    logoutUser,
    getUserProfile,
    updateUserProfile
} from "../../controllers/userController.js";

import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);

// 🔐 Protected Routes (Require Authentication)
router.get("/me", protect, getUserProfile);
router.put("/me", protect, updateUserProfile);

export default router;