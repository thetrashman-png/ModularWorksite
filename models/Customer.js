const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// 🔥 Index for fast customer lookup by phone number within a business
CustomerSchema.index({ business: 1, phone: 1 });

module.exports = mongoose.model("Customer", CustomerSchema);