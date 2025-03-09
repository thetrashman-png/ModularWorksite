import mongoose from "mongoose"; // ✅ Fixes "mongoose is not defined"
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    // Personal Info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: false },
    password: { type: String, required: true },

    // Authentication
    refreshToken: { type: String, required: false },
    revokedTokens: [{ type: String }], // 🔥 List of blacklisted tokens

    // Professional Info
    profileType: {
        type: String,
        enum: ["Freelancer", "Business Owner", "Agency", "Service Provider", "Other"],
        required: true
    },
    bio: { type: String, required: false },
    industry: [{ type: String, required: true }],

    // Business Info
    companyName: { type: String, required: false },
    website: { type: String, required: false },
    businessEmail: { type: String, required: false },
    businessPhone: { type: String, required: false },
    serviceArea: { type: String, required: false },
    location: { type: String, required: false },

    // Social Media Links
    socialMediaLinks: {
        linkedIn: { type: String, required: false },
        twitter: { type: String, required: false },
        instagram: { type: String, required: false }
    }
}, { timestamps: true });

// 🔥 Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model("User", userSchema);
export default User;