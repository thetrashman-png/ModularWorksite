const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Customer = require("../models/Customer");
const subdomainMiddleware = require("../middleware/subdomainMiddleware");

router.use(subdomainMiddleware);

// 📌 Create a Booking (with Customer Integration)
router.post("/", async (req, res) => {
    try {
        const { customerName, customerPhone, serviceType, date } = req.body;

        if (!customerName || !customerPhone || !serviceType || !date) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if customer already exists for this business
        let customer = await Customer.findOne({
            business: req.business._id,
            phone: customerPhone
        });

        // If customer does not exist, create a new one
        if (!customer) {
            customer = new Customer({
                business: req.business._id,
                name: customerName,
                phone: customerPhone
            });
            await customer.save();
        }

        // Create a new booking and link it to the customer
        const newBooking = new Booking({
            business: req.business._id,
            customer: customer._id, // Link to customer profile
            customerName,
            customerPhone,
            serviceType,
            date
        });

        await newBooking.save();
        res.status(201).json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Server error while creating booking." });
    }
});

// 📌 Get Bookings with Filters (Date Range & Status)
router.get("/", async (req, res) => {
    try {
        let query = { business: req.business._id };

        // Apply status filter
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Apply date range filter
        if (req.query.startDate && req.query.endDate) {
            query.date = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        }

        const bookings = await Booking.find(query)
            .populate("customer", "name phone email")
            .sort({ date: 1 });

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

// 📌 Update Booking Status (Confirm, Reschedule, Cancel)
router.put("/:id/status", async (req, res) => {
    try {
        const { status, newDate } = req.body;

        const booking = await Booking.findOne({
            _id: req.params.id,
            business: req.business._id
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        if (status) {
            booking.status = status;
        }

        if (newDate) {
            booking.date = newDate;
        }

        await booking.save();
        res.json({ message: "Booking updated successfully.", booking });
    } catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({ message: "Server error while updating booking." });
    }
});

// 📌 Delete a Booking (by ID)
router.delete("/:id", async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            business: req.business._id
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        await booking.deleteOne();
        res.json({ message: "Booking deleted successfully." });
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ message: "Server error while deleting booking." });
    }
});

module.exports = router;