const express = require("express");

const router = express.Router();

const { requireAuth } =
    require("@clerk/express");

const allowRoles =
    require("../middleware/roleMiddleware");

const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,

    requestPriority,
    getPendingPriorityRequests,
    approvePriority,
    rejectPriority

} = require("../controllers/orderController");

// =======================
// USER ROUTES
// =======================

// Create Order
router.post(
    "/",
    createOrder
);

// Get All Orders
router.get(
    "/",
    getOrders
);

// Get Single Order
router.get(
    "/:id",
    getOrderById
);

// Cancel Order
router.patch(
    "/:id/cancel",
    cancelOrder
);

// Request Priority
router.patch(
    "/:id/request-priority",
    requestPriority
);

// =======================
// OPERATOR / ADMIN
// =======================

// View Pending Priority Requests
router.get(
    "/priority/pending",
    requireAuth(),
    allowRoles(
        "operator",
        "admin"
    ),
    getPendingPriorityRequests
);

// Approve Priority
router.patch(
    "/:id/approve-priority",
    requireAuth(),
    allowRoles(
        "operator",
        "admin"
    ),
    approvePriority
);

// Reject Priority
router.patch(
    "/:id/reject-priority",
    requireAuth(),
    allowRoles(
        "operator",
        "admin"
    ),
    rejectPriority
);

// Update Status
router.patch(
    "/:id/status",
    requireAuth(),
    allowRoles(
        "operator",
        "admin"
    ),
    updateOrderStatus
);

module.exports = router;