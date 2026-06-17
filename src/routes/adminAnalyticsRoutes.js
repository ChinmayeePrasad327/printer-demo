const express =
    require("express");

const router =
    express.Router();

const {
    requireAuth
} = require("@clerk/express");

const allowRoles =
    require("../middleware/roleMiddleware");

const {
    getDashboardStats,
    getPrinterStats,
    getMonthlyTrends,
    getTopUsers
} = require(
    "../controllers/adminAnalyticsController"
);

router.get(
    "/dashboard",
    requireAuth(),
    allowRoles(
        "admin",
        "operator"
    ),
    getDashboardStats
);

router.get(
    "/printers",
    requireAuth(),
    allowRoles(
        "admin",
        "operator"
    ),
    getPrinterStats
);

router.get(
    "/monthly-trends",
    requireAuth(),
    allowRoles(
        "admin",
        "operator"
    ),
    getMonthlyTrends
);

router.get(
    "/top-users",
    requireAuth(),
    allowRoles(
        "admin",
        "operator"
    ),
    getTopUsers
);

module.exports = router;