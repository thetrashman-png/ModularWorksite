const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    serviceType: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["confirmed", "pending", "canceled"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

// 🔥 Indexes for faster searches
BookingSchema.index({ business: 1, date: 1 });
BookingSchema.index({ customer: 1 });

module.exports = mongoose.model("Booking", BookingSchema);