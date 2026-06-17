const Order = require("../models/Order");
const Printer = require("../models/Printer");
const User = require("../models/User");

const {
    calculateQueuePosition,
    calculateETA,
    recalculateQueue,
    recalculateETA
} = require("../services/queueService");

const {
    calculateCost
} = require("../services/recommendationService");

// =====================================
// CREATE ORDER
// =====================================

const createOrder = async (req, res) => {

    try {

        const {
            printerId,
            fileName,
            fileUrl,
            totalPages,
            copies,
            priorityLevel,
            confidential
        } = req.body;

        const clerkId =
            req.auth.userId;

        const user =
            await User.findOne({
                clerkId
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const printer =
            await Printer.findById(
                printerId
            );

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

                userId:
                    user._id,

                printerId,

                fileName,

                fileUrl,

                totalPages,

                copies,

                priorityLevel,

                priorityScore:
                    priorityLevel ===
                        "priority"
                        ? 1
                        : 0,

                confidential,

                queuePosition,

                eta,

                estimatedCost

            });

        await recalculateQueue(
            printerId
        );

        await recalculateETA(
            printerId
        );
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

// =====================================
// GET ALL ORDERS
// =====================================

const getOrders = async (req, res) => {

    try {

        let orders;

        if (
            req.user.role === "admin" ||
            req.user.role === "operator"
        ) {

            orders =
                await Order.find()
                    .populate("userId")
                    .populate("printerId");

        } else {

            orders =
                await Order.find({
                    userId:
                        req.user._id
                })
                    .populate("userId")
                    .populate("printerId");

        }

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
// =====================================
// GET SINGLE ORDER
// =====================================

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

// =====================================
// UPDATE STATUS
// =====================================

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

        order.status =
            req.body.status;

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

// =====================================
// CANCEL ORDER
// =====================================

const cancelOrder = async (req, res) => {

    try {

        const order =
            await Order.findById(
                req.params.id
            );

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }

        if (
            order.userId.toString() !==
            req.user._id.toString() &&
            req.user.role !== "admin"
        ) {

            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });

        }

        order.status =
            "cancelled";

        await order.save();

        await recalculateQueue(
            order.printerId
        );

        await recalculateETA(
            order.printerId
        );

        res.status(200).json({
            success: true,
            message:
                "Order cancelled"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =====================================
// REQUEST PRIORITY
// =====================================

const requestPriority = async (req, res) => {

    try {

        const order =
            await Order.findById(
                req.params.id
            );

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }

        if (
            order.userId.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });

        }

        order.priorityRequested = true;

        order.priorityReason =
            req.body.reason;

        await order.save();

        res.status(200).json({
            success: true,
            message:
                "Priority request submitted",
            data: order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// =====================================
// PENDING PRIORITY REQUESTS
// =====================================

const getPendingPriorityRequests =
    async (req, res) => {

        try {

            const orders =
                await Order.find({
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

// =====================================
// APPROVE PRIORITY
// =====================================

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

        order.approvedAt =
            new Date();

        await order.save();

        await recalculateQueue(
            order.printerId
        );

        await recalculateETA(
            order.printerId
        );

        res.status(200).json({
            success: true,
            message:
                "Priority approved",
            data: order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =====================================
// REJECT PRIORITY
// =====================================

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
            req.body.reason ||
            "Rejected";

        await order.save();

        await recalculateQueue(
            order.printerId
        );

        await recalculateETA(
            order.printerId
        );

        res.status(200).json({
            success: true,
            message:
                "Priority rejected",
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