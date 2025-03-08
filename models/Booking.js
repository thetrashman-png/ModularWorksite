const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }, // 🔗 Link to customer profile
    customerName: { type: String, required: true }, // Still storing for quick reference
    customerPhone: { type: String, required: true },
    serviceType: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["confirmed", "pending", "canceled"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", BookingSchema);