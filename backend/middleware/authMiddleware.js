import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { formatResponse } from "../utils/helpers.js"; // 🔥 Use helper function

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json(formatResponse(false, "Missing authentication token"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json(formatResponse(false, "User not found"));
        }

        next();
    } catch (error) {
        return res.status(401).json(formatResponse(false, "Invalid or expired token"));
    }
};