// Create Order

// Get Orders

// Get Single Order

// Update Status

// Cancel Order
const Order = require("../models/Order");

const {
    recalculateQueue,
    recalculateETA
} = require("../services/queueService");

const {
    calculateQueuePosition,
    calculateETA
} = require("../services/queueService");

const {
    calculateCost
} = require("../services/recommendationService");

const Printer = require("../models/Printer");

// Create Order
const createOrder = async (req, res) => {

    try {

        const {
            userId,
            printerId,
            fileName,
            fileUrl,
            totalPages,
            copies,
            priorityLevel,
            confidential
        } = req.body;

        const printer =
            await Printer.findById(printerId);

        if (!printer) {
            return res.status(404).json({
                success: false,
                message: "Printer not found"
            });
        }

        const queuePosition =
            await calculateQueuePosition(
                printerId
            );

        const eta =
            await calculateETA(
                printerId
            );

        const estimatedCost =
            calculateCost(
                totalPages,
                copies,
                printer.printerType,
                priorityLevel
            );

        const order =
            await Order.create({

                userId,

                printerId,

                fileName,

                fileUrl,

                totalPages,

                copies,

                priorityLevel,

                confidential,

                queuePosition,

                eta,

                estimatedCost
            });

        res.status(201).json({
            success: true,
            data: order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get All Orders
const getOrders = async (req, res) => {

    try {

        const orders =
            await Order.find()
                .populate("userId")
                .populate("printerId");

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const getOrderById = async (req, res) => {
    try {

        const order =
            await Order.findById(req.params.id)
                .populate("userId")
                .populate("printerId");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const updateOrderStatus = async (req, res) => {

    try {

        const order =
            await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.status = req.body.status;

        await order.save();

        await recalculateQueue(
            order.printerId
        );

        await recalculateETA(
            order.printerId
        );
        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const cancelOrder = async (req, res) => {

    try {

        const order =
            await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.status = "cancelled";

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get Pending Priority Requests
const getPendingPriorityRequests = async (req, res) => {

    try {

        const orders = await Order.find({
            priorityRequested: true,
            priorityApproved: false
        })
            .populate("userId")
            .populate("printerId");

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Approve Priority
const approvePriority = async (req, res) => {

    try {

        const order =
            await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.priorityApproved = true;

        order.priorityLevel = "priority";

        order.priorityScore = 1;

        order.approvedBy = req.user._id;

        order.approvedAt = new Date();

        await order.save();

        res.status(200).json({
            success: true,
            message: "Priority approved",
            data: order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Reject Priority
const rejectPriority = async (req, res) => {

    try {

        const order =
            await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.priorityRequested = false;

        order.priorityApproved = false;

        order.priorityScore = 0;

        order.rejectedReason =
            req.body.reason || "Rejected";

        await order.save();

        res.status(200).json({
            success: true,
            message: "Priority rejected",
            data: order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Request Priority
const requestPriority = async (req, res) => {

    try {

        const order =
            await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.priorityRequested = true;

        order.priorityReason =
            req.body.reason;

        await order.save();

        res.status(200).json({
            success: true,
            message: "Priority request submitted",
            data: order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    requestPriority,
    getPendingPriorityRequests,
    approvePriority,
    rejectPriority
};