const Business = require("../models/Business");

const subdomainMiddleware = async (req, res, next) => {
    const host = req.headers.host;
    let subdomain = null;

    if (host) {
        const hostParts = host.split('.');
        if (hostParts.length >= 3) {
            subdomain = hostParts[0].toLowerCase();
        }
    }

    // ⚠ If no subdomain is found, use a default business for local testing.
    if (!subdomain) {
        console.warn("⚠ No subdomain found. Using default business for local testing.");
        subdomain = "default-business"; // Set a fallback business subdomain
    }

    try {
        const business = await Business.findOne({ subdomain: subdomain });

        if (!business) {
            console.warn(`⚠ No business found for subdomain: ${subdomain}`);
            return res.status(404).json({ message: `Business not found for subdomain: ${subdomain}` });
        }

        req.business = business;
        next();
    } catch (error) {
        console.error("Subdomain middleware error:", error);
        return res.status(500).json({ message: "Server error while fetching business." });
    }
};

module.exports = subdomainMiddleware;