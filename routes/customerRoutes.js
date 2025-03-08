const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const subdomainMiddleware = require("../middleware/subdomainMiddleware");

// Apply subdomain middleware to associate requests with the correct business
router.use(subdomainMiddleware);

// 📌 Create a New Customer
router.post("/", async (req, res) => {
    try {
        const { name, phone, email, notes } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ message: "Customer name and phone are required." });
        }

        const newCustomer = new Customer({
            business: req.business._id,
            name,
            phone,
            email,
            notes
        });

        await newCustomer.save();
        res.status(201).json({ message: "Customer created successfully", customer: newCustomer });
    } catch (error) {
        console.error("Error creating customer:", error);
        res.status(500).json({ message: "Server error while creating customer." });
    }
});

// 📌 Get All Customers for a Business
router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find({ business: req.business._id }).sort({ createdAt: -1 });
        res.json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ message: "Server error while fetching customers." });
    }
});

// 📌 Get a Specific Customer (by ID)
router.get("/:id", async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, business: req.business._id });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found." });
        }

        res.json(customer);
    } catch (error) {
        console.error("Error fetching customer:", error);
        res.status(500).json({ message: "Server error while fetching customer." });
    }
});

// 📌 Update a Customer
router.put("/:id", async (req, res) => {
    try {
        const { name, phone, email, notes } = req.body;
        const customer = await Customer.findOne({ _id: req.params.id, business: req.business._id });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found." });
        }

        if (name) customer.name = name;
        if (phone) customer.phone = phone;
        if (email) customer.email = email;
        if (notes) customer.notes = notes;

        await customer.save();
        res.json({ message: "Customer updated successfully", customer });
    } catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).json({ message: "Server error while updating customer." });
    }
});

// 📌 Delete a Customer
router.delete("/:id", async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, business: req.business._id });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found." });
        }

        await customer.deleteOne();
        res.json({ message: "Customer deleted successfully." });
    } catch (error) {
        console.error("Error deleting customer:", error);
        res.status(500).json({ message: "Server error while deleting customer." });
    }
});

module.exports = router;