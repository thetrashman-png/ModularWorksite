const getTimestamp = () => {
    const now = new Date();
    const options = { timeZone: "America/Los_Angeles", hour12: false };
    const date = now.toLocaleDateString("en-CA", { ...options }).replace(/\//g, "-").slice(2); // YY-MM-DD
    const time = now.toLocaleTimeString("en-US", { ...options, hour: "2-digit", minute: "2-digit" }).replace(":", ":");
    return `[${date} / ${time}]`;
};

// 🔥 Centralized Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log the error with a timestamp
    console.error(`${getTimestamp()} ❌ ERROR: ${message}`);

    res.status(statusCode).json({
        success: false,
        message
    });
};

export default errorHandler; // ✅ Ensure this is a default export