const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const subdomainMiddleware = require("../middleware/subdomainMiddleware");

// Apply subdomain middleware to associate bookings with the correct business
router.use(subdomainMiddleware);

// 📌 Create a Booking
router.post("/", async (req, res) => {
    try {
        const { customerName, customerPhone, serviceType, date } = req.body;

        if (!customerName || !customerPhone || !serviceType || !date) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newBooking = new Booking({
            business: req.business._id,
            customerName,
            customerPhone,
            serviceType,
            date,
        });

        await newBooking.save();
        res.status(201).json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        console.error("Booking creation error:", error);
        res.status(500).json({ message: "Server error while creating booking." });
    }
});

// 📌 Get All Bookings for a Business
router.get("/", async (req, res) => {
    try {
        const bookings = await Booking.find({ business: req.business._id }).sort({ date: 1 });
        res.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Server error while fetching bookings." });
    }
});

// 📌 Cancel a Booking
router.put("/:id/cancel", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking || booking.business.toString() !== req.business._id.toString()) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.status = "canceled";
        await booking.save();
        res.json({ message: "Booking canceled successfully", booking });
    } catch (error) {
        console.error("Error canceling booking:", error);
        res.status(500).json({ message: "Server error while canceling booking." });
    }
});

module.exports = router;