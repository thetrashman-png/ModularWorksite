const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    serviceType: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["confirmed", "pending", "canceled"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", BookingSchema);