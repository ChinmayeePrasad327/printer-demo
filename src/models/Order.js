const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        printerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Printer",
            required: true
        },

        fileName: {
            type: String,
            required: true
        },

        fileUrl: {
            type: String,
            required: true
        },

        totalPages: {
            type: Number,
            required: true
        },

        copies: {
            type: Number,
            default: 1
        },

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "printing",
                "ready",
                "collected",
                "cancelled"
            ],
            default: "pending"
        },

        priorityLevel: {
            type: String,
            enum: [
                "normal",
                "priority"
            ],
            default: "normal"
        },

        confidential: {
            type: Boolean,
            default: false
        },

        queuePosition: {
            type: Number,
            default: 0
        },

        eta: {
            type: Number,
            default: 0
        },

        estimatedCost: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model("Order", orderSchema);