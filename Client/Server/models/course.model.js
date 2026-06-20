const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        instructor: {
            type: String,
            required: true,
            trim: true,
        },
        description: { // New Field
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: [
                "ai_ml", "web_development", "data_science", "cloud_computing", 
                "cyber_security", "devops", "mobile_development", "software_engineering",
                "management", "communication_skills", "business_analysis", "finance", 
                "marketing", "human_resources", "sales", "entrepreneurship", 
                "product_management", "career_guidance"
            ],
        },
        type: {
            type: String,
            required: true,
            enum: ["free", "paid"],
        },
        platform: {
            type: String,
            required: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
        },
        photo: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("course", courseSchema);