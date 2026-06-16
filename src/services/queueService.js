const Order = require("../models/Order");
const Printer = require("../models/Printer");

// Queue Position
const calculateQueuePosition = async (printerId) => {

    const pendingOrders =
        await Order.countDocuments({
            printerId,
            status: {
                $in: [
                    "pending",
                    "accepted",
                    "printing"
                ]
            }
        });

    return pendingOrders + 1;
};

// ETA
const calculateETA = async (printerId) => {

    const printer =
        await Printer.findById(printerId);

    if (!printer) {
        return 0;
    }

    const orders =
        await Order.find({
            printerId,
            status: {
                $in: [
                    "pending",
                    "accepted",
                    "printing"
                ]
            }
        });

    let totalPagesAhead = 0;

    orders.forEach(order => {

        totalPagesAhead +=
            order.totalPages *
            order.copies;

    });

    return Math.ceil(
        totalPagesAhead /
        printer.pagesPerMinute
    );

};

// Recalculate Queue
const recalculateQueue = async (
    printerId
) => {

    const orders =
        await Order.find({
            printerId,
            status: {
                $in: [
                    "pending",
                    "accepted",
                    "printing"
                ]
            }
        }).sort({
            priorityLevel: -1,
            createdAt: 1
        });

    for (
        let i = 0;
        i < orders.length;
        i++
    ) {

        orders[i].queuePosition =
            i + 1;

        await orders[i].save();

    }

};

// Recalculate ETA
const recalculateETA = async (
    printerId
) => {

    const printer =
        await Printer.findById(printerId);

    if (!printer) {
        return;
    }

    const orders =
        await Order.find({
            printerId,
            status: {
                $in: [
                    "pending",
                    "accepted",
                    "printing"
                ]
            }
        }).sort({
            queuePosition: 1
        });

    let pagesAhead = 0;

    for (const order of orders) {

        order.eta = Math.ceil(
            pagesAhead /
            printer.pagesPerMinute
        );

        pagesAhead +=
            order.totalPages *
            order.copies;

        await order.save();

    }

};

module.exports = {
    calculateQueuePosition,
    calculateETA,
    recalculateQueue,
    recalculateETA
};