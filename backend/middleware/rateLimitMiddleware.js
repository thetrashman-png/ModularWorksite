import rateLimit from "express-rate-limit";

// 🔥 Global API Rate Limit → Limits all requests to 100 per 15 minutes
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { success: false, message: "Too many requests, please try again later." }
});

// 🔥 Login Rate Limit → Limits to 5 login attempts per 15 minutes
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit to 5 login attempts per IP
    message: { success: false, message: "Too many login attempts, please try again later." }
});