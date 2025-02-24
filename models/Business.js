const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    businessName: { type: String, required: true },
    subdomain: { type: String, required: true, unique: true },
    // Additional fields can be added later (e.g., availableHours, services, etc.)
});

module.exports = mongoose.model("Business", BusinessSchema);